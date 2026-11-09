import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '紫微排盘',
  description: '免费在线紫微斗数排盘，基于倪海厦正宗紫微斗数体系，自动生成命盘12宫位、14主星、大限流年，AI深度解读命盘格局',
  alternates: { canonical: '/chart' },
  openGraph: {
    title: '紫微排盘 - 在线紫微斗数排盘与AI解读',
    description: '基于倪海厦正宗紫微斗数体系，自动生成命盘12宫位、14主星、大限流年，AI深度解读命盘格局',
    url: `${SITE_URL}/chart`,
    type: 'website',
  },
};

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  return children;
}