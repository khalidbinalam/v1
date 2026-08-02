import type { Metadata } from 'next';
import MarketplaceClient from './marketplace-client';

export const metadata: Metadata = {
  title: 'CS2 Skins Marketplace Bangladesh',
  description: 'Browse thousands of CS2 skins listed by verified sellers in Bangladesh. Filter by rarity, weapon, float, and price. Pay via bKash & Nagad.',
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
