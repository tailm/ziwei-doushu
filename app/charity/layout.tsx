import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '积德行善修行',
  description: '每日积德行善修行修持，记录您的善行善举，坚持每日行善积累功德，培养慈悲利他之心',
  alternates: { canonical: '/charity' },
  openGraph: {
    title: '积德行善修行 - 每日行善修持记录',
    description: '每日积德行善修行修持，记录您的善行善举，坚持每日行善积累功德',
    url: `${SITE_URL}/charity`,
    type: 'website',
  },
};

export default function CharityLayout({ children }: { children: React.ReactNode }) {
  return children;
}