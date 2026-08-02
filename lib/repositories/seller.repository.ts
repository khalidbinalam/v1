import prisma from '../prisma';

export interface SellerApplication {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  nid: string;
  facebook: string;
  steamProfile: string;
  discord: string;
  experience: string;
  bankDetails: string;
  bkash: string;
  nagad: string;
  portfolio: string;
  previousSales: string;
  documentsUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

// In-memory state for immediate responsiveness and fallback
const initialApplications: SellerApplication[] = [
  {
    id: 'app-bd-1001',
    userId: 'user-tanvir-01',
    name: 'Tanvir Ahmed Chowdhury',
    email: 'tanvir.cs2@gmail.com',
    phone: '01712345678',
    nid: '1998123456789',
    facebook: 'https://facebook.com/tanvir.cs2trader',
    steamProfile: 'https://steamcommunity.com/id/tanvir_skins_bd',
    discord: 'tanvir_cs2#1337',
    experience: '3+ years',
    bankDetails: 'Dutch Bangla Bank, Mirpur Branch, Acc: 110.120.45892',
    bkash: '01712345678',
    nagad: '01712345678',
    portfolio: 'CSFloat Store ID #8842 (Over $12,000 Volume in 2025)',
    previousSales: 'Sold 15+ Knives (Karambits, Butterflies) via Facebook CS2 Trading Bangladesh group. High rep vouchers available.',
    documentsUrl: 'https://picsum.photos/seed/nid_front/800/500',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'app-bd-1002',
    userId: 'user-skinking-01',
    name: 'Rahat Hasan',
    email: 'rahat@skinkingbd.com',
    phone: '01899887766',
    nid: '1995887766554',
    facebook: 'https://facebook.com/rahat.skinking',
    steamProfile: 'https://steamcommunity.com/id/skinking_bd',
    discord: 'rahat_skinking#9900',
    experience: 'High Volume Commercial Trader',
    bankDetails: 'BRAC Bank, Gulshan Branch, Acc: 150.992.8812',
    bkash: '01899887766',
    nagad: '01899887766',
    portfolio: 'Buff163 Merchant Store (1,400+ transactions)',
    previousSales: 'Verified CS2 Merchant since 2022. Bulk importer of High Tier CS2 Knives & Gloves.',
    documentsUrl: 'https://picsum.photos/seed/nid_back/800/500',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    reviewedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    adminNotes: 'Fully verified NID and Steam Inventory ($45,000+ total inventory value). Approved for 0% promo fee.',
  },
  {
    id: 'app-bd-1003',
    userId: 'user-farhan-01',
    name: 'Farhan Kabir',
    email: 'farhan.skins@gmail.com',
    phone: '01911223344',
    nid: '2001443322110',
    facebook: 'https://facebook.com/farhan.kabir.cs2',
    steamProfile: 'https://steamcommunity.com/id/farhan_dragonlore',
    discord: 'farhan_lore#0001',
    experience: '1-2 years',
    bankDetails: 'Eastern Bank Ltd, Banani, Acc: 102.332.1198',
    bkash: '01911223344',
    nagad: '01911223344',
    portfolio: 'Facebook CS2 BD Group Trader',
    previousSales: 'Sold various AK-47, M4A1-S skins and AWP Asiimovs in Dhaka.',
    documentsUrl: 'https://picsum.photos/seed/nid_doc3/800/500',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

class SellerRepository {
  private applications: SellerApplication[] = [...initialApplications];

  public getApplications(): SellerApplication[] {
    return [...this.applications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getApplicationById(id: string): SellerApplication | undefined {
    return this.applications.find((app) => app.id === id);
  }

  public createApplication(data: Omit<SellerApplication, 'id' | 'status' | 'createdAt'>): SellerApplication {
    const newApp: SellerApplication = {
      ...data,
      id: `app-bd-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);

    // Sync async with Prisma if DB is available
    this.syncCreateToPrisma(newApp).catch((err) => console.error('Prisma seller sync error:', err));

    return newApp;
  }

  public approveApplication(id: string, notes?: string): SellerApplication {
    const app = this.applications.find((a) => a.id === id);
    if (!app) throw new Error('Seller application not found');

    app.status = 'APPROVED';
    app.reviewedAt = new Date().toISOString();
    if (notes) app.adminNotes = notes;

    // Sync approval to Prisma
    this.syncApprovalToPrisma(app).catch((err) => console.error('Prisma seller approval sync error:', err));

    return app;
  }

  public rejectApplication(id: string, notes?: string): SellerApplication {
    const app = this.applications.find((a) => a.id === id);
    if (!app) throw new Error('Seller application not found');

    app.status = 'REJECTED';
    app.reviewedAt = new Date().toISOString();
    if (notes) app.adminNotes = notes;

    return app;
  }

  private async syncCreateToPrisma(app: SellerApplication) {
    if (!app.email) return;
    try {
      const user = await prisma.user.findUnique({ where: { email: app.email } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: 'SELLER_APPLICANT',
            phone: app.phone,
            steamId: app.steamProfile,
            discordId: app.discord,
          },
        });
      }
    } catch {
      // Ignore Prisma errors in dev mock mode
    }
  }

  private async syncApprovalToPrisma(app: SellerApplication) {
    if (!app.email) return;
    try {
      const user = await prisma.user.findUnique({ where: { email: app.email } });
      if (user) {
        // Upgrade role to SELLER
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'SELLER' },
        });

        // Ensure Store exists
        const existingStore = await prisma.store.findUnique({ where: { userId: user.id } });
        if (!existingStore) {
          const slug = app.name.toLowerCase().replace(/[^a-z0-9]/g, '') || `seller${Date.now()}`;
          await prisma.store.create({
            data: {
              userId: user.id,
              name: `${app.name}'s CS2 Vault`,
              slug,
              description: app.portfolio || 'Verified CS2 Merchant Store on Underground Bangladesh',
              kycStatus: 'APPROVED',
              verifiedAt: new Date(),
              trustScore: 99.0,
              bankDetails: app.bankDetails ? { details: app.bankDetails } : undefined,
              payoutMethods: { bkash: app.bkash, nagad: app.nagad },
            },
          });
        }
      }
    } catch {
      // Ignore Prisma errors in dev mock mode
    }
  }
}

export const sellerRepository = new SellerRepository();
