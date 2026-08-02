'use client';
import Link from 'next/link';
import { useState } from 'react';
import Button from '../../../components/ui/Button';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState<'buyer'|'seller'>('buyer');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, accountType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Signup failed')
      // auto sign-in
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { signIn } = require('next-auth/react')
      await signIn('credentials', { redirect: true, email, password })
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6a00] to-[#ff3d81] flex items-center justify-center text-sm font-black">⚡</span>
            <span className="gradient-text text-2xl font-black tracking-tight">Underground</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Create your Account</h1>
          <p className="text-sm text-slate-400 mt-1">Start trading CS2 skins with bKash & Nagad in Bangladesh</p>
        </div>

        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4"> 
            <div className="text-xs text-slate-400">Account type</div>
            <div className="flex gap-3 items-center">
              <label className={`px-3 py-2 rounded-lg border ${accountType === 'buyer' ? 'border-[#ff6a00] bg-[#1a0f00]' : 'border-[#1c1c26] bg-[#0d0d12]'} text-sm`}>
                <input type="radio" name="accountType" value="buyer" checked={accountType === 'buyer'} onChange={() => setAccountType('buyer')} className="mr-2" /> Buyer
              </label>
              <label className={`px-3 py-2 rounded-lg border ${accountType === 'seller' ? 'border-[#ff6a00] bg-[#1a0f00]' : 'border-[#1c1c26] bg-[#0d0d12]'} text-sm`}>
                <input type="radio" name="accountType" value="seller" checked={accountType === 'seller'} onChange={() => setAccountType('seller')} className="mr-2" /> Apply as Seller
              </label>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full px-4 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#ff6a00] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#ff6a00] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                bKash / Nagad Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01712345678"
                className="w-full px-4 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#ff6a00] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#ff6a00] transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 text-sm font-bold"
            >
              {loading ? 'Creating Account...' : 'Sign Up →'}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-[#1c1c26]">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[#ff6a00] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
