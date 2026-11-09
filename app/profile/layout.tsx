import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '个人中心',
  description: '个人中心，管理您的账户信息、命盘数据、修持记录与积分余额',
  alternates: { canonical: '/profile' },
  openGraph: {
    title: '个人中心 - 紫微研究',
    description: '管理您的账户信息、命盘数据、修持记录与积分余额',
    url: `${SITE_URL}/profile`,
    type: 'website',
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}