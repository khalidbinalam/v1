import React from 'react'
import Link from 'next/link'
import ListingCard from '../../../components/listing/ListingCard'
import Card from '../../../components/ui/Card'

export const metadata = {
  title: 'Storefront — Underground',
  description: 'Verified CS2 Storefront on Underground Bangladesh',
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const store = {
    name: 'SkinKing BD',
    slug,
    trustScore: 4.9,
    completedTrades: 540,
    kycVerified: true,
    description: 'Premier CS2 Skins store in Bangladesh. Fast trade deliveries, top high-tier knives & covert skins.',
  }

  const listings = [
    { id: 'l1', name: 'AWP | Dragon Lore', exterior: 'FACTORY_NEW', rarity: 'Covert', priceCents: 12500000, floatValue: 0.02, statTrak: false, souvenir: false },
    { id: 'l2', name: 'AK-47 | Neon Rider', exterior: 'WELL_WORN', rarity: 'Mil-Spec', priceCents: 800000, floatValue: 0.38, statTrak: true, souvenir: false },
    { id: 'l3', name: 'Asiimov | Minimal Wear', exterior: 'MINIMAL_WEAR', rarity: 'Classified', priceCents: 3500000, floatValue: 0.11, statTrak: false, souvenir: false },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Store Header Card */}
      <Card className="p-8 mb-8 bg-gradient-to-r from-[#0d0d12] via-[#111118] to-[#0d0d12] border border-[#1c1c26] rounded-2xl shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff6a00] to-[#ff3d81] rounded-2xl flex items-center justify-center text-3xl font-black text-black shadow-lg">
              SK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">{store.name}</h1>
                <span className="badge badge-verified">✔ Verified Store</span>
              </div>
              <p className="text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">{store.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#1c1c26] pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-[#ff6a00]">★ {store.trustScore}</div>
              <div className="text-xs text-slate-400">Trust Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-slate-100">{store.completedTrades}</div>
              <div className="text-xs text-slate-400">Completed Trades</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Store Listings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Active Store Inventory ({listings.length})</h2>
          <Link href="/marketplace" className="text-sm font-semibold text-[#ff6a00] hover:underline">
            Explore All Marketplace →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={{ ...l, store }} />
          ))}
        </div>
      </section>
    </div>
  )
}
