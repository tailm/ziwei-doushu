import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '仪表盘',
  description: '用户仪表盘，查看您的命盘收藏、修行统计、积分记录与运势追踪',
  alternates: { canonical: '/dashboard' },
  openGraph: {
    title: '仪表盘 - 紫微研究',
    description: '查看您的命盘收藏、修行统计、积分记录与运势追踪',
    url: `${SITE_URL}/dashboard`,
    type: 'website',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}