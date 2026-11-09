import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '抽签占卜',
  description: '在线抽签占卜，传统签筒模拟，抽取签诗后AI结合紫微斗数为您解签，指引人生方向',
  alternates: { canonical: '/chouqian' },
  openGraph: {
    title: '抽签占卜 - 在线抽签与AI解签',
    description: '传统签筒模拟，抽取签诗后AI结合紫微斗数为您解签',
    url: `${SITE_URL}/chouqian`,
    type: 'website',
  },
};

export default function ChouqianLayout({ children }: { children: React.ReactNode }) {
  return children;
}