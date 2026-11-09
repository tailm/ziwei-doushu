import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '铜钱占卜',
  description: '在线铜钱占卜（六爻占卜），模拟三枚铜钱摇卦过程，AI结合紫微斗数为您解读卦象吉凶',
  alternates: { canonical: '/tongqian' },
  openGraph: {
    title: '铜钱占卜 - 六爻占卜与AI解卦',
    description: '模拟三枚铜钱摇卦过程，AI结合紫微斗数为您解读卦象吉凶',
    url: `${SITE_URL}/tongqian`,
    type: 'website',
  },
};

export default function TongqianLayout({ children }: { children: React.ReactNode }) {
  return children;
}