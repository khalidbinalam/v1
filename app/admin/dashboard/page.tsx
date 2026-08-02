import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard — Underground',
  description: 'Manage payments, sellers, disputes, and system security',
};

export default function AdminDashboardPage() {
  const pendingPayments = [
    { id: 'PAY-101', order: '#1004', amount: '৳ 32,000', method: 'bKash', trxId: 'BK928371X', sender: '01711223344', status: 'SUBMITTED' },
    { id: 'PAY-102', order: '#1005', amount: '৳ 6,200', method: 'Nagad', trxId: 'NG847291Z', sender: '01899887766', status: 'SUBMITTED' },
  ];

  const sellerApplications = [
    { id: 'APP-01', name: 'Tanvir Rahman', email: 'tanvir@example.com', nid: '1998273645123', status: 'PENDING' },
    { id: 'APP-02', name: 'CS2 Skins BD', email: 'shop@cs2bd.com', nid: '1995123456789', status: 'PENDING' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1c1c26] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-accent">Admin Portal</span>
            <span className="text-xs text-slate-400">System Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">Admin Dashboard</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/cms" className="btn btn-primary text-xs flex items-center gap-1.5 shadow-lg shadow-[#22c55e]/20">
            <Sparkles className="w-3.5 h-3.5" /> CMS Builder
          </Link>
          <Link href="/admin/sellers" className="btn btn-ghost text-xs border border-[#22c55e]/40 text-[#22c55e] hover:bg-[#22c55e]/10">
            Seller KYC Applications (Review)
          </Link>
          <Link href="/admin/payments" className="btn btn-ghost text-xs">
            Review Payments ({pendingPayments.length})
          </Link>
          <Link href="/admin/disputes" className="btn btn-ghost text-xs">
            Dispute Center (0)
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Verifications', value: pendingPayments.length, color: 'text-[#ff6a00]' },
          { label: 'Seller Applications', value: sellerApplications.length, color: 'text-[#ff3d81]' },
          { label: 'Total Volume (Monthly)', value: '৳ 1.2M', color: 'text-[#22c55e]' },
          { label: 'Active Disputes', value: '0', color: 'text-slate-200' },
        ].map((m) => (
          <div key={m.label} className="p-5 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl">
            <div className="text-xs text-slate-400 font-medium">{m.label}</div>
            <div className={`text-3xl font-extrabold mt-2 ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Manual Payment Verification Queue */}
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Pending Manual Payment Verification</h2>
            <span className="text-xs text-slate-400">bKash / Nagad Trx Audit</span>
          </div>

          <div className="space-y-3">
            {pendingPayments.map((p) => (
              <div key={p.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{p.order}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#ff6a00]/10 text-[#ff6a00] font-semibold">{p.method}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    TrxID: <span className="text-slate-200 font-mono">{p.trxId}</span> | Sender: {p.sender}
                  </div>
                  <div className="text-sm font-extrabold text-[#22c55e] mt-1">{p.amount}</div>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[#22c55e] text-black text-xs font-bold rounded-lg hover:bg-green-400 transition">
                    Approve
                  </button>
                  <button className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg hover:bg-red-500/30 transition">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seller Verification KYC Applications */}
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Seller KYC Applications</h2>
            <Link href="/admin/sellers" className="text-xs text-[#22c55e] font-bold hover:underline">
              View All Applications & Dossiers →
            </Link>
          </div>

          <div className="space-y-3">
            {sellerApplications.map((s) => (
              <div key={s.id} className="p-4 bg-[#111118] border border-[#1c1c26] rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-200">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.email}</div>
                  <div className="text-xs text-slate-400 mt-1">NID: <span className="font-mono">{s.nid}</span></div>
                </div>

                <div className="flex gap-2">
                  <Link href="/admin/sellers" className="px-3.5 py-1.5 bg-[#22c55e] text-black text-xs font-bold rounded-lg hover:bg-green-400 transition">
                    Review Dossier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
