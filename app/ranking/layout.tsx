import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '排行榜',
  description: '修行排行榜，查看每日修行积分排名，与同修们互相激励共同精进',
  alternates: { canonical: '/ranking' },
  openGraph: {
    title: '排行榜 - 修行积分排名',
    description: '查看每日修行积分排名，与同修们互相激励共同精进',
    url: `${SITE_URL}/ranking`,
    type: 'website',
  },
};

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return children;
}