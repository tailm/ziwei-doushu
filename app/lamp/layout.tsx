import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '长明灯',
  description: '在线点亮长明灯，供奉长明灯祈求光明永驻、消灾延寿，为亲友点燃智慧之光',
  alternates: { canonical: '/lamp' },
  openGraph: {
    title: '长明灯 - 在线供灯祈求光明永驻',
    description: '在线点亮长明灯，供奉长明灯祈求光明永驻、消灾延寿',
    url: `${SITE_URL}/lamp`,
    type: 'website',
  },
};

export default function LampLayout({ children }: { children: React.ReactNode }) {
  return children;
}