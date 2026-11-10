import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '吃斋修行',
  description: '每日吃斋修行修持，记录您的斋食修行历程，坚持每日吃斋清净身心，培养慈悲心',
  alternates: { canonical: '/vegetarian' },
  openGraph: {
    title: '吃斋修行 - 每日斋食修持记录',
    description: '每日吃斋修行修持，记录您的斋食修行历程，清净身心培养慈悲心',
    url: `${SITE_URL}/vegetarian`,
    type: 'website',
  },
};

export default function VegetarianLayout({ children }: { children: React.ReactNode }) {
  return children;
}