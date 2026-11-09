import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '风水分析',
  description: 'AI风水分析，结合紫微斗数命盘与传统风水学，为您分析居住环境、方位布局对运势的影响',
  alternates: { canonical: '/fengshui' },
  openGraph: {
    title: '风水分析 - AI风水布局与方位解读',
    description: '结合紫微斗数命盘与传统风水学，为您分析居住环境对运势的影响',
    url: `${SITE_URL}/fengshui`,
    type: 'website',
  },
};

export default function FengshuiLayout({ children }: { children: React.ReactNode }) {
  return children;
}