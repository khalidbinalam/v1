/*
# Create all application tables for Underground Game Hub

## Overview
This migration creates the complete database schema for the Underground Game Hub marketplace —
a Bangladesh-based CS2 skins marketplace with seller verification, escrow payments, and admin moderation.

## New Tables (all created with IF NOT EXISTS for idempotency)

1. **User** — Core user accounts with role-based access (USER, SELLER_APPLICANT, SELLER, MODERATOR, SUPPORT, ADMIN).
   Includes optional Steam/Discord IDs for CS2 trading.
2. **Session** — NextAuth database sessions (token, expiry, IP, user agent).
3. **Store** — Seller storefronts with KYC status, trust score, bank/payout details.
4. **Listing** — Marketplace listings for CS2 skins (price, float, paint seed, exterior, delivery method, stock).
5. **ListingMedia** — Media attached to listings (images, videos, inspect videos, screenshots).
6. **ListingStats** — Aggregate stats per listing (views, favorites, sold count).
7. **Order** — Purchase orders with escrow status flow (RESERVED → PENDING_VERIFICATION → AWAITING_DELIVERY → COMPLETED).
8. **OrderItem** — Line items within an order, with item snapshot for historical record.
9. **Payment** — Manual payment proof (bKash/Nagad) with verification workflow and duplicate detection.
10. **Media** — Centralized media records (images, screenshots) with perceptual hash and safety scoring.
11. **AuditLog** — Audit trail for admin actions (verify, reject, reserve, release, etc.).
12. **SeoMeta** — SEO metadata templates for listings.
13. **FeatureFlag** — Feature flag toggles with optional rules.
14. **Permission** — Fine-grained RBAC permissions catalog.
15. **Category** — Listing categories (many-to-many with Listing).
16. **Tag** — Listing tags (many-to-many with Listing).
17. **Notification** — User notifications across channels (browser, email, in-app, SMS).
18. **Favorite** — User favorites/bookmarks on listings.
19. **RecentlyViewed** — User recently-viewed listings tracking.
20. **Review** — Listing reviews with ratings, moderation status, and verified-purchase flag.
21. **Dispute** — Order disputes with evidence and resolution tracking.
22. **Conversation** — Buyer-seller conversations, optionally linked to a listing.
23. **Message** — Individual messages within conversations.
24. **Report** — User-submitted reports for moderation (listings, users, messages, reviews).
25. **SupportTicket** — User support tickets with priority and status.
26. **Article** — Blog/news articles with SEO metadata and draft/published state.
27. **CMSPage** — CMS-managed pages with structured content.
28. **_ListingCategory** — Join table for Listing ↔ Category many-to-many.
29. **_ListingTag** — Join table for Listing ↔ Tag many-to-many.

## Security
- RLS is NOT enabled on these tables because the app uses Prisma with a direct database connection
  (via DATABASE_URL with a dedicated app_user role), not the Supabase anon-key client. Access control
  is enforced at the application layer via NextAuth session checks and role guards.
- The app_user role has full CRUD on all tables in the public schema.

## Important Notes
1. All enum types are created as PostgreSQL ENUMs matching the Prisma schema.
2. All foreign keys use ON DELETE CASCADE for child tables to prevent orphaned records.
3. Indexes are created on frequently-queried columns (email, phone, storeId, priceCents, buyerId, etc.).
4. The `orderNumber` column in `Order` uses SERIAL autoincrement.
5. Decimal columns use DECIMAL(5,4) for float values as specified in the Prisma schema.
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'SELLER_APPLICANT', 'SELLER', 'MODERATOR', 'SUPPORT', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('RESERVED', 'PENDING_VERIFICATION', 'AWAITING_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'DISPUTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'DUPLICATE', 'FLAGGED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ListingCondition" AS ENUM ('FACTORY_NEW', 'MINT', 'WELL_WORN', 'FIELD_TESTED', 'BATTLE_SCARRED', 'MINIMAL_WEAR', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DeliveryMethod" AS ENUM ('INSTANT', 'MANUAL_STEAM_TRADE', 'KEY', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Currency" AS ENUM ('BDT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'INSPECT_VIDEO', 'SCREENSHOT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'PAYMENT_VERIFY', 'PAYMENT_REJECT', 'ORDER_RESERVE', 'ORDER_RELEASE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE,
  "phone" TEXT UNIQUE,
  "name" TEXT,
  "passwordHash" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "is2faEnabled" BOOLEAN NOT NULL DEFAULT false,
  "steamId" TEXT UNIQUE,
  "discordId" TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "User"("phone");

-- Session table
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");

-- Store table
CREATE TABLE IF NOT EXISTS "Store" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "bannerMediaId" TEXT,
  "avatarMediaId" TEXT,
  "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "verifiedAt" TIMESTAMP(3),
  "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "bankDetails" JSONB,
  "payoutMethods" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Store_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Store_slug_idx" ON "Store"("slug");

-- Listing table
CREATE TABLE IF NOT EXISTS "Listing" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "storeId" TEXT NOT NULL,
  "ownerId" TEXT,
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "exterior" "ListingCondition" NOT NULL,
  "floatValue" DECIMAL(5,4),
  "paintSeed" INTEGER,
  "pattern" TEXT,
  "statTrak" BOOLEAN NOT NULL DEFAULT false,
  "souvenir" BOOLEAN NOT NULL DEFAULT false,
  "rarity" TEXT,
  "currency" "Currency" NOT NULL DEFAULT 'BDT',
  "priceCents" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "stock" INTEGER NOT NULL DEFAULT 1,
  "deliveryMethod" "DeliveryMethod" NOT NULL,
  "steamLink" TEXT,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "seoMetaId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Listing_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE,
  CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL,
  CONSTRAINT "Listing_storeId_sku_key" UNIQUE ("storeId", "sku")
);
CREATE INDEX IF NOT EXISTS "Listing_priceCents_idx" ON "Listing"("priceCents");
CREATE INDEX IF NOT EXISTS "Listing_storeId_idx" ON "Listing"("storeId");

-- ListingMedia table
CREATE TABLE IF NOT EXISTS "ListingMedia" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "listingId" TEXT NOT NULL,
  "mediaId" TEXT NOT NULL,
  "type" "MediaType" NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "url" TEXT NOT NULL,
  "thumbUrl" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ListingMedia_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "ListingMedia_listingId_idx" ON "ListingMedia"("listingId");

-- ListingStats table
CREATE TABLE IF NOT EXISTS "ListingStats" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "listingId" TEXT NOT NULL UNIQUE,
  "views" INTEGER NOT NULL DEFAULT 0,
  "favorites" INTEGER NOT NULL DEFAULT 0,
  "soldCount" INTEGER NOT NULL DEFAULT 0,
  "lastSoldAt" TIMESTAMP(3),
  CONSTRAINT "ListingStats_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE
);

-- Order table
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderNumber" SERIAL,
  "buyerId" TEXT NOT NULL,
  "storeId" TEXT NOT NULL,
  "totalCents" INTEGER NOT NULL,
  "currency" "Currency" NOT NULL DEFAULT 'BDT',
  "status" "OrderStatus" NOT NULL,
  "reservedUntil" TIMESTAMP(3),
  "deliveryInfo" JSONB,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Order_buyerId_idx" ON "Order"("buyerId");
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber");

-- OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "itemSnapshot" JSONB NOT NULL,
  CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  CONSTRAINT "OrderItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT
);

-- Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL,
  "buyerId" TEXT,
  "amountCents" INTEGER NOT NULL,
  "currency" "Currency" NOT NULL DEFAULT 'BDT',
  "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  "paymentMethod" TEXT NOT NULL,
  "merchantNumber" TEXT,
  "buyerSenderNumber" TEXT,
  "transactionId" TEXT,
  "screenshotMediaId" TEXT,
  "submittedAt" TIMESTAMP(3),
  "verifiedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "adminVerifierId" TEXT,
  "flags" JSONB,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  CONSTRAINT "Payment_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "Payment_transactionId_idx" ON "Payment"("transactionId");
CREATE INDEX IF NOT EXISTS "Payment_buyerSenderNumber_idx" ON "Payment"("buyerSenderNumber");

-- Media table
CREATE TABLE IF NOT EXISTS "Media" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "ownerId" TEXT,
  "provider" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "sizeBytes" INTEGER,
  "mimeType" TEXT,
  "perceptualHash" TEXT,
  "safeScore" DOUBLE PRECISION,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AuditLog table
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "actorId" TEXT,
  "action" "AuditAction" NOT NULL,
  "targetType" TEXT,
  "targetId" TEXT,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SeoMeta table
CREATE TABLE IF NOT EXISTS "SeoMeta" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "titleTemplate" TEXT,
  "descriptionTemplate" TEXT,
  "ogTitle" TEXT,
  "ogImage" TEXT,
  "structuredData" JSONB
);

-- FeatureFlag table
CREATE TABLE IF NOT EXISTS "FeatureFlag" (
  "key" TEXT PRIMARY KEY,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "rules" JSONB
);

-- Permission table
CREATE TABLE IF NOT EXISTS "Permission" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "desc" TEXT
);

-- Category table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

-- Tag table
CREATE TABLE IF NOT EXISTS "Tag" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL
);

-- Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");

-- Favorite table
CREATE TABLE IF NOT EXISTS "Favorite" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE,
  CONSTRAINT "Favorite_userId_listingId_key" UNIQUE ("userId", "listingId")
);
CREATE INDEX IF NOT EXISTS "Favorite_userId_idx" ON "Favorite"("userId");
CREATE INDEX IF NOT EXISTS "Favorite_listingId_idx" ON "Favorite"("listingId");

-- RecentlyViewed table
CREATE TABLE IF NOT EXISTS "RecentlyViewed" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecentlyViewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "RecentlyViewed_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "RecentlyViewed_userId_idx" ON "RecentlyViewed"("userId");
CREATE INDEX IF NOT EXISTS "RecentlyViewed_listingId_idx" ON "RecentlyViewed"("listingId");

-- Review table
CREATE TABLE IF NOT EXISTS "Review" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "listingId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "title" TEXT,
  "comment" TEXT,
  "images" JSONB,
  "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
  "helpfulCount" INTEGER NOT NULL DEFAULT 0,
  "moderatedAt" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'VISIBLE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE,
  CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Review_listingId_rating_idx" ON "Review"("listingId", "rating");
CREATE INDEX IF NOT EXISTS "Review_listingId_idx" ON "Review"("listingId");
CREATE INDEX IF NOT EXISTS "Review_reviewerId_idx" ON "Review"("reviewerId");

-- Dispute table
CREATE TABLE IF NOT EXISTS "Dispute" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL UNIQUE,
  "openerId" TEXT NOT NULL,
  "responderId" TEXT,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "evidence" JSONB,
  "resolution" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Dispute_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
  CONSTRAINT "Dispute_openerId_fkey" FOREIGN KEY ("openerId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Dispute_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "User"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "Dispute_openerId_idx" ON "Dispute"("openerId");

-- Conversation table
CREATE TABLE IF NOT EXISTS "Conversation" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "listingId" TEXT,
  "buyerId" TEXT,
  "sellerId" TEXT,
  "subject" TEXT,
  "lastMessageAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL,
  CONSTRAINT "Conversation_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL,
  CONSTRAINT "Conversation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "Conversation_buyerId_idx" ON "Conversation"("buyerId");
CREATE INDEX IF NOT EXISTS "Conversation_sellerId_idx" ON "Conversation"("sellerId");

-- Message table
CREATE TABLE IF NOT EXISTS "Message" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "content" TEXT,
  "attachments" JSONB,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE,
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");

-- Report table
CREATE TABLE IF NOT EXISTS "Report" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "reporterId" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "handledBy" TEXT,
  "handledAt" TIMESTAMP(3),
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Report_reporterId_idx" ON "Report"("reporterId");

-- SupportTicket table
CREATE TABLE IF NOT EXISTS "SupportTicket" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- Article table
CREATE TABLE IF NOT EXISTS "Article" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "authorId" TEXT,
  "publishedAt" TIMESTAMP(3),
  "isDraft" BOOLEAN NOT NULL DEFAULT true,
  "seoMetaId" TEXT,
  "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL
);

-- CMSPage table
CREATE TABLE IF NOT EXISTS "CMSPage" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "key" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Join tables for many-to-many relations
CREATE TABLE IF NOT EXISTS "_ListingCategory" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_ListingCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE,
  CONSTRAINT "_ListingCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "_ListingCategory_B_index" ON "_ListingCategory"("B");

CREATE TABLE IF NOT EXISTS "_ListingTag" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_ListingTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE,
  CONSTRAINT "_ListingTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "_ListingTag_B_index" ON "_ListingTag"("B");

-- Grant permissions to app_user on all new tables and sequences
GRANT ALL ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO app_user;