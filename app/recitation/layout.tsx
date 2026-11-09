import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '诵经打卡',
  description: '每日诵经打卡修持，记录您的诵经修行历程，坚持每日诵经积累功德，修心养性',
  alternates: { canonical: '/recitation' },
  openGraph: {
    title: '诵经打卡 - 每日诵经修持记录',
    description: '每日诵经打卡修持，记录您的诵经修行历程，坚持每日诵经积累功德',
    url: `${SITE_URL}/recitation`,
    type: 'website',
  },
};

export default function RecitationLayout({ children }: { children: React.ReactNode }) {
  return children;
}