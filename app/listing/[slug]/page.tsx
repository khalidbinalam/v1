import React from 'react'
import Link from 'next/link'
import prisma from '../../../lib/prisma'
import Card from '../../../components/ui/Card'
import BuyPanel from '../../../components/listing/BuyPanel'
import Breadcrumbs from '../../../components/layout/Breadcrumbs'
import { generateProductSchema } from '../../../lib/seo/schema'

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps) {
  const { slug } = await params

  // Attempt DB lookup or fallback to dynamic formatted title
  const dbItem = await prisma.listing.findFirst({
    where: { id: slug },
  })

  const titleName = dbItem ? dbItem.name : slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  const priceFormatted = dbItem ? (dbItem.priceCents / 100).toLocaleString('en-BD') : 'Market'

  const title = `Buy ${titleName} in Bangladesh | Underground CS2`
  const description = `Purchase ${titleName} for ৳${priceFormatted} BDT on Bangladesh's CS2 Skin Marketplace. 100% Escrow Protection via bKash & Nagad.`

  return {
    title,
    description,
    keywords: `${titleName}, buy cs2 skins bangladesh, cs2 float bd, underground game hub, ${titleName} bkash`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://picsum.photos/seed/cs2item/800/600',
          width: 800,
          height: 600,
          alt: titleName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params

  // Find listing or fallback
  const dbItem = await prisma.listing.findFirst({
    where: { id: slug },
    include: { store: true, media: true },
  })

  const listing = {
    id: dbItem?.id || slug,
    name: dbItem?.name || 'AWP | Dragon Lore (Factory New)',
    exterior: dbItem?.exterior || 'FACTORY_NEW',
    rarity: dbItem?.rarity || 'Covert',
    priceCents: dbItem?.priceCents || 12500000,
    floatValue: dbItem?.floatValue ? Number(dbItem.floatValue) : 0.0214,
    paintSeed: dbItem?.paintSeed || 421,
    statTrak: dbItem?.statTrak || false,
    souvenir: dbItem?.souvenir || false,
    description: dbItem?.description || 'A custom painted dragon artwork with gold inline accents. Highly sought after by collectors in Bangladesh.',
    seller: {
      name: dbItem?.store?.name || 'SkinKing BD',
      slug: dbItem?.store?.slug || 'skinkingbd',
      trustScore: 4.9,
      completedTrades: 340,
      verifiedKYC: true,
    },
  }

  const productSchema = generateProductSchema({
    id: listing.id,
    name: listing.name,
    description: listing.description,
    priceCents: listing.priceCents,
    exterior: listing.exterior,
    floatValue: listing.floatValue,
    sellerName: listing.seller.name,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: listing.exterior.replace('_', ' '), href: `/marketplace?wear=${listing.exterior}` },
          { label: listing.name, href: `/listing/${listing.id}` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border border-[#1c1c26] bg-[#0d0d12]">
            <div className="h-96 relative flex items-center justify-center bg-gradient-to-b from-[#1a0a2e] via-[#0d0d18] to-[#0d0d12] p-8">
              <div className="text-8xl select-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">🔫</div>

              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge badge-hot">{listing.rarity}</span>
                <span className="badge badge-accent">{listing.exterior.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="p-6 border-t border-[#1c1c26]">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{listing.name}</h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">{listing.description}</p>
            </div>
          </Card>

          {/* Specs & Float Details */}
          <Card className="p-6 bg-[#0d0d12] border border-[#1c1c26]">
            <h3 className="text-lg font-bold mb-4 text-slate-100">Item Specifications</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">Float Value</div>
                <div className="font-semibold text-slate-200 mt-1">{listing.floatValue}</div>
                <div className="w-full bg-[#1c1c26] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#22c55e] h-full" style={{ width: `${(listing.floatValue || 0.05) * 100}%` }} />
                </div>
              </div>

              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">Pattern Index</div>
                <div className="font-semibold text-slate-200 mt-1">{listing.paintSeed}</div>
              </div>

              <div className="p-3 bg-[#111118] rounded-xl border border-[#1c1c26]">
                <div className="text-xs text-slate-400">StatTrak™</div>
                <div className="font-semibold text-slate-200 mt-1">{listing.statTrak ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Purchase & Seller Info Panel */}
        <aside className="space-y-6">
          <Card className="p-6 bg-[#0d0d12] border border-[#1c1c26]">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price</div>
            <div className="text-3xl font-extrabold text-[#22c55e] mb-4">
              ৳ {(listing.priceCents / 100).toLocaleString('en-BD')}
            </div>

            <div className="space-y-3 mb-6">
              <div className="w-full">
                <BuyPanel listingId={listing.id} priceCents={listing.priceCents} />
              </div>
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                Item locks for 30 minutes. Pay via bKash / Nagad with admin manual audit.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1c1c26] flex items-center justify-between text-xs">
              <span className="text-slate-400">Merchant Store:</span>
              <span className="font-bold text-white">{listing.seller.name}</span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
