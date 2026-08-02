'use client';
import Link from 'next/link';
import { useState } from 'react';
import Button from '../../../components/ui/Button';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // dynamic import to avoid SSR issues
      const nextAuth = await import('next-auth/react')
      const { signIn } = nextAuth
      const res: any = await signIn('credentials', { redirect: false, email, password })
      if (res?.error) throw new Error(res.error)
      // redirect to home
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand & Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6a00] to-[#ff3d81] flex items-center justify-center text-sm font-black">⚡</span>
            <span className="gradient-text text-2xl font-black tracking-tight">Underground</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to trade and manage your skin reservations</p>
        </div>

        {/* Card Form */}
        <div className="bg-[#0d0d12] border border-[#1c1c26] rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#111118] border border-[#1c1c26] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#ff6a00] transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#ff6a00] hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
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
              {loading ? 'Authenticating...' : 'Sign in →'}
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-[#1c1c26]">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#ff6a00] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
