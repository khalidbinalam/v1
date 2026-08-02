import type { Metadata } from 'next';
import HomePage from './home/home-page';

export const metadata: Metadata = {
  title: 'Underground — Bangladesh CS2 Skins Marketplace',
  description: 'Buy and sell CS2 skins securely in Bangladesh. Verified sellers, manual payment verification via bKash & Nagad, lowest prices guaranteed.',
};

export default function Page() {
  return <HomePage />;
}
