import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '祈福',
  description: '在线祈福，向天地神明祈求福报，为自身或亲友祈福消灾，虔诚祈愿积累功德',
  alternates: { canonical: '/prayer' },
  openGraph: {
    title: '祈福 - 在线祈福消灾祈愿',
    description: '在线祈福，向天地神明祈求福报，为自身或亲友祈福消灾',
    url: `${SITE_URL}/prayer`,
    type: 'website',
  },
};

export default function PrayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}