import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'My Account & Orders — Underground',
  description: 'Track skin purchases, reservation status, and trade history',
};

export default function BuyerDashboardPage() {
  const buyerProfile = {
    name: 'Sabbir Ahmed',
    email: 'sabbir@example.com',
    phone: '01711223344',
    tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=12345678&token=abcdef',
  };

  const activeReservations = [
    {
      id: 'ORD-1004',
      item: 'AWP | Asiimov (Field-Tested)',
      price: '৳ 32,000',
      seller: 'SkinKing BD',
      status: 'PENDING_VERIFICATION',
      trxId: 'BK928371X',
      reservedTimeLeft: '24 mins remaining',
    },
  ];

  const pastOrders = [
    {
      id: 'ORD-9821',
      item: 'AK-47 | Redline (Field-Tested)',
      price: '৳ 6,200',
      seller: 'TradeHaven BD',
      status: 'COMPLETED',
      date: 'Aug 01, 2026',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-accent">Buyer Dashboard</span>
            <span className="text-xs text-slate-400">Personal Trade & Order History</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">My Orders & Inventory</h1>
        </div>

        <div>
          <Link href="/marketplace" className="btn btn-primary text-xs">
            Browse Marketplace →
          </Link>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Reservations & Purchases (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Pending Reservations */}
          <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Active Skin Reservations</h2>

            {activeReservations.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No active skin reservations at the moment.</p>
            ) : (
              <div className="space-y-3">
                {activeReservations.map((r) => (
                  <div key={r.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{r.item}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#ff6a00]/10 text-[#ff6a00] font-semibold">{r.status}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Seller: {r.seller} | TrxID: <span className="font-mono text-slate-200">{r.trxId}</span>
                      </div>
                      <div className="text-sm font-extrabold text-[#22c55e] mt-1">{r.price}</div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-amber-400 font-bold block">{r.reservedTimeLeft}</span>
                      <button className="mt-2 px-3 py-1.5 bg-[#1c1c26] text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-800 transition">
                        View Audit Log
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Order History */}
          <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-100">Completed Order History</h2>

            <div className="space-y-3">
              {pastOrders.map((o) => (
                <div key={o.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{o.item}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Purchased on {o.date} from {o.seller}</div>
                    <div className="text-sm font-extrabold text-slate-100 mt-1">{o.price}</div>
                  </div>

                  <div>
                    <span className="badge badge-verified">COMPLETED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile & Steam Settings */}
        <aside className="space-y-6">
          <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Profile Settings</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-slate-400 block font-semibold">Name</label>
                <div className="font-medium text-slate-200 mt-0.5">{buyerProfile.name}</div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block font-semibold">Email</label>
                <div className="font-medium text-slate-200 mt-0.5">{buyerProfile.email}</div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block font-semibold">Phone (bKash/Nagad)</label>
                <div className="font-medium text-slate-200 mt-0.5">{buyerProfile.phone}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1c1c26]">
              <label className="text-xs text-slate-400 block font-semibold mb-1">Steam Trade URL</label>
              <input
                type="text"
                readOnly
                value={buyerProfile.tradeUrl}
                className="w-full px-3 py-2 bg-[#111118] border border-[#1c1c26] rounded-lg text-xs text-slate-300 font-mono focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Required for sellers to send skin trade offers directly to your Steam inventory.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
