import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '紫微合盘',
  description: '紫微斗数合盘分析，双人命盘对比解读，分析感情匹配度、事业合作关系、性格互补性，AI深度解读两人缘分',
  alternates: { canonical: '/heming' },
  openGraph: {
    title: '紫微合盘 - 双人命盘对比与缘分解读',
    description: '紫微斗数合盘分析，双人命盘对比解读感情匹配度与事业合作关系',
    url: `${SITE_URL}/heming`,
    type: 'website',
  },
};

export default function HemingLayout({ children }: { children: React.ReactNode }) {
  return children;
}