import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AI手相分析',
  description: 'AI手相分析，上传手掌照片，AI结合紫微斗数与传统手相学为您解读掌纹特征，分析性格命运',
  alternates: { canonical: '/shouxiang' },
  openGraph: {
    title: 'AI手相分析 - 手掌照片智能解读',
    description: '上传手掌照片，AI结合紫微斗数与传统手相学为您解读掌纹特征',
    url: `${SITE_URL}/shouxiang`,
    type: 'website',
  },
};

export default function ShouxiangLayout({ children }: { children: React.ReactNode }) {
  return children;
}