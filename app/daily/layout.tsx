import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '每日运势',
  description: '紫微斗数每日运势解读，根据您的命盘推演今日流日运势，涵盖事业、感情、财运、健康各方面指引',
  alternates: { canonical: '/daily' },
  openGraph: {
    title: '每日运势 - 紫微斗数流日运势解读',
    description: '根据您的命盘推演今日流日运势，涵盖事业、感情、财运、健康各方面指引',
    url: `${SITE_URL}/daily`,
    type: 'website',
  },
};

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children;
}