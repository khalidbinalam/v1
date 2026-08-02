'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ListingCard from '../../components/listing/ListingCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const FEATURED = [
  { id: 'f1', name: 'AWP | Dragon Lore', exterior: 'FACTORY_NEW', rarity: 'Covert', priceCents: 12500000, floatValue: 0.02, statTrak: false, souvenir: false, store: { name: 'SkinKing BD', slug: 'skinKingBD', trustScore: 4.9 } },
  { id: 'f2', name: 'AK-47 | Wild Lotus', exterior: 'FIELD_TESTED', rarity: 'Covert', priceCents: 4200000, floatValue: 0.21, statTrak: true, souvenir: false, store: { name: 'TradeHaven', slug: 'tradehaven', trustScore: 4.7 } },
  { id: 'f3', name: 'Karambit | Fade', exterior: 'FACTORY_NEW', rarity: 'Covert', priceCents: 9800000, floatValue: 0.01, statTrak: false, souvenir: false, store: { name: 'KnifeVault', slug: 'knifevault', trustScore: 4.8 } },
  { id: 'f4', name: 'M4A4 | Howl', exterior: 'MINIMAL_WEAR', rarity: 'Covert', priceCents: 7600000, floatValue: 0.12, statTrak: false, souvenir: false, store: { name: 'BDSkins', slug: 'bdskins', trustScore: 4.6 } },
  { id: 'f5', name: 'Butterfly | Doppler', exterior: 'FACTORY_NEW', rarity: 'Covert', priceCents: 5500000, floatValue: 0.003, statTrak: true, souvenir: false, store: { name: 'KnifeVault', slug: 'knifevault', trustScore: 4.8 } },
  { id: 'f6', name: 'Glock | Fade', exterior: 'FACTORY_NEW', rarity: 'Restricted', priceCents: 850000, floatValue: 0.01, statTrak: false, souvenir: false, store: { name: 'PistolKing', slug: 'pistolking', trustScore: 4.5 } },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '🔍',
    title: 'Browse Listings',
    desc: 'Search thousands of verified CS2 skins filtered by rarity, float, price, and weapon type.',
  },
  {
    step: '02',
    icon: '🔒',
    title: 'Secure Reserve',
    desc: 'Click Buy — your item is instantly reserved and locked. Stock won\'t go to anyone else.',
  },
  {
    step: '03',
    icon: '📲',
    title: 'Pay via bKash / Nagad',
    desc: 'Send payment to the seller\'s number. Submit your transaction ID and screenshot as proof.',
  },
  {
    step: '04',
    icon: '✅',
    title: 'Admin Verification',
    desc: 'Our team manually verifies every payment within minutes. No automated fraud here.',
  },
  {
    step: '05',
    icon: '🎮',
    title: 'Receive Your Skin',
    desc: 'Once verified, the seller delivers your skin via Steam trade. Confirm and you\'re done.',
  },
];

const WHY_FEATURES = [
  {
    icon: '🇧🇩',
    title: 'Made for Bangladesh',
    desc: 'BDT pricing, bKash & Nagad payments. Designed from the ground up for Bangladeshi CS2 players.',
  },
  {
    icon: '🛡️',
    title: 'Manual Payment Verification',
    desc: 'Every transaction is manually verified by our team — eliminating duplicate fraud and fake screenshots.',
  },
  {
    icon: '✔️',
    title: 'Verified Sellers',
    desc: 'Sellers go through NID and Steam profile KYC verification. Only real people with real skins.',
  },
  {
    icon: '⚡',
    title: 'Fast & Responsive',
    desc: 'Lightning-fast marketplace with instant stock reservation. Mobile-first, always responsive.',
  },
  {
    icon: '💬',
    title: 'Dispute Protection',
    desc: 'Something went wrong? Our dispute team steps in and mediates with a full audit trail.',
  },
  {
    icon: '📊',
    title: 'Float & Inspect Data',
    desc: 'See exact float values, pattern indices, and inspect links before every purchase.',
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="space-y-12 pb-12">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero-bg relative py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="mb-6 animate-fade-up">
            <span className="badge badge-accent shadow-glow-sm">
              ⚡ Bangladesh's #1 CS2 Marketplace
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-up delay-100">
            Buy & Sell <span className="gradient-text">CS2 Skins</span>
            <br />
            Securely in Bangladesh
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed animate-fade-up delay-200">
            Verified sellers, manual payment verification via bKash & Nagad, and full dispute protection — the safest way to trade CS2 skins in BD.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up delay-300">
            <Button variant="primary" className="text-base px-6 py-3" onClick={() => router.push('/marketplace')}>
              Browse Marketplace →
            </Button>
            <Button variant="ghost" className="text-base px-6 py-3" onClick={() => router.push('/auth/signup')}>
              Start Selling
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#0d0d12] border border-[#1c1c26] rounded-2xl shadow-card">
          {[
            { value: '2,400+', label: 'Skins Listed' },
            { value: '180+', label: 'Verified Sellers' },
            { value: '৳ 4M+', label: 'Traded Volume' },
            { value: '99.2%', label: 'Verified Payments' },
          ].map((s) => (
            <div key={s.label} className="text-center p-2">
              <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured listings ────────────────────────────── */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="badge badge-hot mb-2">🔥 Hot Deals</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Listings</h2>
            </div>
            <Link href="/marketplace" className="text-sm font-semibold text-[#ff6a00] hover:underline flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-b from-transparent via-[#0d0d12]/80 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge badge-accent mb-2">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
              Simple. Secure. <span className="gradient-text">Verified.</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-md mx-auto">
              Every trade on Underground is backed by manual human verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HOW_IT_WORKS.map((step) => (
              <Card key={step.step} className="p-6 text-center hover:border-[#ff6a00]/40 transition-all">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-extrabold text-[#ff6a00] tracking-wider uppercase mb-2">Step {step.step}</div>
                <h3 className="font-bold text-base mb-2 text-slate-100">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Underground ──────────────────────────────── */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge badge-verified mb-2">✔ Why Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">
              Why <span className="gradient-text">Underground?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {WHY_FEATURES.map((f) => (
              <Card key={f.title} className="p-6 flex gap-4 items-start hover:border-[#ff6a00]/30 transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#ff6a00]/10 text-2xl flex-shrink-0 border border-[#ff6a00]/20">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-slate-100">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-[#ff6a00]/10 via-[#111118] to-[#ff3d81]/10 border border-[#ff6a00]/20 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#ff6a00]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#ff3d81]/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative z-10">
              Ready to start <span className="gradient-text">selling?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base relative z-10 leading-relaxed">
              Apply to become a verified seller and reach thousands of CS2 players across Bangladesh.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Button variant="primary" className="px-6 py-3" onClick={() => router.push('/auth/signup')}>
                Apply as Seller
              </Button>
              <Button variant="ghost" className="px-6 py-3" onClick={() => router.push('/marketplace')}>
                Browse First
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
