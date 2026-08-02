import Link from 'next/link';

export const metadata = {
  title: 'Top Seller Stores | Underground Bangladesh',
  description: 'Browse verified CS2 skin merchant stores and top rated sellers in Bangladesh.',
};

const TOP_STORES = [
  { id: '1', name: 'Karambit King BD', rating: '4.9 ★', sales: '1,420+ sales', avatar: '👑', response: '10 mins', verified: true },
  { id: '2', name: 'Dhaka CS2 Vault', rating: '4.8 ★', sales: '980+ sales', avatar: '⚡', response: '15 mins', verified: true },
  { id: '3', name: 'Chittagong Skins Hub', rating: '4.9 ★', sales: '750+ sales', avatar: '🔥', response: '8 mins', verified: true },
  { id: '4', name: 'AWM Snipe Store', rating: '4.7 ★', sales: '520+ sales', avatar: '🎯', response: '20 mins', verified: true },
];

export default function StoresPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem', maxWidth: 1000 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>Verified Merchants</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
          Top Seller <span className="gradient-text">Stores</span>
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
          Verified Bangladeshi CS2 traders with high trust scores and rapid trade delivery guarantees.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {TOP_STORES.map((s) => (
          <div key={s.id} className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  {s.avatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800, margin: 0 }}>{s.name}</h3>
                    {s.verified && <span title="Verified Seller" style={{ color: '#00cc88', fontSize: '0.85rem' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#ffb300' }}>{s.rating}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>({s.sales})</span>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
                Average response time: <strong style={{ color: '#fff' }}>{s.response}</strong>
              </p>
            </div>
            <Link href={`/store/${s.id}`} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Visit Store Front →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
