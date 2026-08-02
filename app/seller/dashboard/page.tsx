import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Seller Dashboard — Underground',
  description: 'Manage store listings, view pending orders, payout balances, and sales stats',
};

export default function SellerDashboardPage() {
  const storeStats = {
    storeName: 'SkinKing BD',
    payoutBalance: '৳ 145,000',
    pendingOrders: 3,
    activeListings: 18,
    totalSales: '৳ 1,240,000',
  };

  const activeListings = [
    { id: 'l-101', name: 'AWP | Dragon Lore (Factory New)', price: '৳ 125,000', float: '0.020', status: 'ACTIVE' },
    { id: 'l-102', name: 'Butterfly | Doppler (Factory New)', price: '৳ 55,000', float: '0.003', status: 'RESERVED' },
    { id: 'l-103', name: 'Glock | Fade (Factory New)', price: '৳ 8,500', float: '0.010', status: 'ACTIVE' },
  ];

  const pendingOrders = [
    { id: 'ORD-9901', item: 'Butterfly | Doppler', buyer: 'Sabbir Ahmed', amount: '৳ 55,000', status: 'AWAITING_DELIVERY' },
    { id: 'ORD-9902', item: 'AK-47 | Neon Rider', buyer: 'Fahim Hasan', amount: '৳ 8,000', status: 'PENDING_PAYMENT_VERIFICATION' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-verified">Verified Store</span>
            <span className="text-xs text-slate-400">Store Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">{storeStats.storeName} Dashboard</h1>
        </div>

        <div className="flex gap-3">
          <Link href="/seller/listings/new" className="btn btn-primary text-xs">
            + Create New Listing
          </Link>
          <Link href={`/store/skinkingbd`} className="btn btn-ghost text-xs">
            View Public Storefront ↗
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available Payout Balance', value: storeStats.payoutBalance, color: 'text-[#22c55e]' },
          { label: 'Pending Deliveries', value: storeStats.pendingOrders, color: 'text-[#ff6a00]' },
          { label: 'Active Listings', value: storeStats.activeListings, color: 'text-slate-100' },
          { label: 'Total Volume Sales', value: storeStats.totalSales, color: 'text-[#ff3d81]' },
        ].map((m) => (
          <div key={m.label} className="p-5 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl">
            <div className="text-xs text-slate-400 font-medium">{m.label}</div>
            <div className={`text-3xl font-extrabold mt-2 ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Awaiting Steam Trade Delivery */}
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Orders Requiring Action</h2>
            <span className="text-xs text-slate-400">Steam Trade Delivery Queue</span>
          </div>

          <div className="space-y-3">
            {pendingOrders.map((o) => (
              <div key={o.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-200">{o.item}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Buyer: {o.buyer} | <span className="text-[#ff6a00] font-semibold">{o.status}</span>
                  </div>
                  <div className="text-sm font-extrabold text-[#22c55e] mt-1">{o.amount}</div>
                </div>

                <div>
                  {o.status === 'AWAITING_DELIVERY' ? (
                    <button className="px-4 py-2 bg-[#ff6a00] text-black text-xs font-bold rounded-lg hover:bg-[#ff8533] transition">
                      Send Trade Link →
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Awaiting Admin Payment Audit</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Store Inventory */}
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Active Inventory</h2>
            <Link href="/seller/listings" className="text-xs text-[#ff6a00] hover:underline font-semibold">
              Manage All ({storeStats.activeListings})
            </Link>
          </div>

          <div className="space-y-3">
            {activeListings.map((l) => (
              <div key={l.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-200 text-sm">{l.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Float: {l.float}</div>
                  <div className="text-sm font-extrabold text-[#ff6a00] mt-1">{l.price}</div>
                </div>

                <div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${l.status === 'RESERVED' ? 'bg-[#ff3d81]/10 text-[#ff3d81]' : 'bg-[#22c55e]/10 text-[#22c55e]'}`}>
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
