import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '上香',
  description: '在线上香供奉，虔诚上香敬奉天地神明，祈求平安吉祥、福报绵延',
  alternates: { canonical: '/incense' },
  openGraph: {
    title: '上香 - 在线上香供奉祈求平安',
    description: '在线上香供奉，虔诚上香敬奉天地神明，祈求平安吉祥',
    url: `${SITE_URL}/incense`,
    type: 'website',
  },
};

export default function IncenseLayout({ children }: { children: React.ReactNode }) {
  return children;
}