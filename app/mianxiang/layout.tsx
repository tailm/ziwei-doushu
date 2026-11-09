import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AI面相分析',
  description: 'AI面相分析，上传面部照片，AI结合紫微斗数与传统面相学为您解读面部特征，分析性格运势',
  alternates: { canonical: '/mianxiang' },
  openGraph: {
    title: 'AI面相分析 - 面相照片智能解读',
    description: '上传面部照片，AI结合紫微斗数与传统面相学为您解读面部特征',
    url: `${SITE_URL}/mianxiang`,
    type: 'website',
  },
};

export default function MianxiangLayout({ children }: { children: React.ReactNode }) {
  return children;
}