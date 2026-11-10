import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '每日三省修行',
  description: '每日三省修行修持，曾子曰吾日三省吾身，坚持每日反省自身言行，修身养性提升品德',
  alternates: { canonical: '/reflection' },
  openGraph: {
    title: '每日三省修行 - 每日反省修身修持',
    description: '每日三省修行修持，坚持每日反省自身言行，修身养性提升品德',
    url: `${SITE_URL}/reflection`,
    type: 'website',
  },
};

export default function ReflectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}