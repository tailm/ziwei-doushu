import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '测字占卜',
  description: '在线测字占卜，输入一个汉字，AI结合紫微斗数与传统测字术为您解读字中玄机，预测吉凶祸福',
  alternates: { canonical: '/cezi' },
  openGraph: {
    title: '测字占卜 - AI测字解读字中玄机',
    description: '输入一个汉字，AI结合紫微斗数与传统测字术为您解读字中玄机',
    url: `${SITE_URL}/cezi`,
    type: 'website',
  },
};

export default function CeziLayout({ children }: { children: React.ReactNode }) {
  return children;
}