import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '打坐修行',
  description: '每日打坐修行修持，4秒吸气、2秒屏息、6秒呼气呼吸引导，坚持每日打坐静心修行',
  alternates: { canonical: '/meditation' },
  openGraph: {
    title: '打坐修行 - 每日打坐静心修持',
    description: '每日打坐修行修持，呼吸引导辅助静心，坚持每日打坐修行',
    url: `${SITE_URL}/meditation`,
    type: 'website',
  },
};

export default function MeditationLayout({ children }: { children: React.ReactNode }) {
  return children;
}