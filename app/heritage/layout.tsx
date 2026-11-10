import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '非物质文化遗产',
  description: '中国非物质文化遗产展示 — 昆曲、古琴、书法、剪纸、制茶技艺、太极拳等联合国教科文组织人类非遗名录项目',
  alternates: { canonical: '/heritage' },
  openGraph: {
    title: '中国非物质文化遗产 - 紫微研究',
    description: '五千余年文明积淀，中华民族世代传承的智慧结晶。从昆曲到书法，从节气到茶道，每一项非遗都是活着的历史。',
    url: `${SITE_URL}/heritage`,
    type: 'website',
  },
};

export default function HeritageLayout({ children }: { children: React.ReactNode }) {
  return children;
}