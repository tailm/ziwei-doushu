import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '忏悔',
  description: '在线忏悔，反省自身过错与罪业，诚心忏悔消业障，净化心灵回归清净',
  alternates: { canonical: '/repent' },
  openGraph: {
    title: '忏悔 - 在线忏悔消业净化心灵',
    description: '反省自身过错与罪业，诚心忏悔消业障，净化心灵回归清净',
    url: `${SITE_URL}/repent`,
    type: 'website',
  },
};

export default function RepentLayout({ children }: { children: React.ReactNode }) {
  return children;
}