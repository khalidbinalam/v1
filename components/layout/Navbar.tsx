'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const NAV_LINKS = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/buyer/dashboard', label: 'Buyer Portal' },
  { href: '/seller/dashboard', label: 'Seller Portal' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session as any)?.role || (session as any)?.user?.role || null;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link href="/" className="nav-brand" onClick={() => setMobileOpen(false)}>
            <span className="gradient-text">Underground</span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
            ))}
            {role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="nav-link">Admin Portal</Link>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {!session ? (
              <>
                <Link href="/auth/signin" className="btn btn-ghost btn-sm hidden md:inline-flex">Sign in</Link>
                <Link href="/auth/signup" className="btn btn-primary btn-sm">Sell Skins</Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">{(session as any)?.user?.name || (session as any)?.user?.email}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div className="mobile-nav z-50" role="dialog" aria-modal="true" aria-label="Mobile menu">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Link href="/auth/signin" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/auth/signup" className="btn btn-primary" style={{ marginTop: '0.25rem', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                Start Selling
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
