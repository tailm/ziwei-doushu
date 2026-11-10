import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '太极修行',
  description: '每日太极修行修持，坚持每日练习太极拳，强身健体修身养性，推荐太极学习视频资源',
  alternates: { canonical: '/taichi' },
  openGraph: {
    title: '太极修行 - 每日太极练习修持',
    description: '每日太极修行修持，坚持每日练习太极拳，强身健体修身养性',
    url: `${SITE_URL}/taichi`,
    type: 'website',
  },
};

export default function TaichiLayout({ children }: { children: React.ReactNode }) {
  return children;
}