import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '许愿',
  description: '在线许愿，向天地神明许下心愿，虔诚许愿祈求实现，记录您的许愿历程',
  alternates: { canonical: '/wish' },
  openGraph: {
    title: '许愿 - 在线许愿祈求心愿实现',
    description: '在线许愿，向天地神明许下心愿，虔诚许愿祈求实现',
    url: `${SITE_URL}/wish`,
    type: 'website',
  },
};

export default function WishLayout({ children }: { children: React.ReactNode }) {
  return children;
}