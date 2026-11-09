import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '登录',
  description: '登录紫微研究，使用Web3钱包安全登录，管理您的命盘数据与修持记录',
  alternates: { canonical: '/login' },
  openGraph: {
    title: '登录 - 紫微研究',
    description: '使用Web3钱包安全登录紫微研究平台',
    url: `${SITE_URL}/login`,
    type: 'website',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}