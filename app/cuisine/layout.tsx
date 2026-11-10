import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '中餐菜谱',
  description: '中华美食家常菜谱与制作方法 — 番茄炒蛋、宫保鸡丁、红烧肉、清蒸鲈鱼等经典中餐菜谱',
  alternates: { canonical: '/cuisine' },
  openGraph: {
    title: '中餐菜谱 - 紫微研究',
    description: '从家常小炒到经典名菜，简单易学的制作方法，让每个人都能做出地道中餐。',
    url: `${SITE_URL}/cuisine`,
    type: 'website',
  },
};

export default function CuisineLayout({ children }: { children: React.ReactNode }) {
  return children;
}