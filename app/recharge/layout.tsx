import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '充值',
  description: '积分充值，通过Web3钱包充值积分，用于解锁高级命理解读与AI分析功能',
  alternates: { canonical: '/recharge' },
  openGraph: {
    title: '充值 - 紫微研究积分充值',
    description: '通过Web3钱包充值积分，用于解锁高级命理解读与AI分析功能',
    url: `${SITE_URL}/recharge`,
    type: 'website',
  },
};

export default function RechargeLayout({ children }: { children: React.ReactNode }) {
  return children;
}