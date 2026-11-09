import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '祭祀',
  description: '在线祭祀供奉，缅怀先祖敬奉神明，祭祀祈福传承孝道文化，祈求祖先庇佑后代',
  alternates: { canonical: '/ritual' },
  openGraph: {
    title: '祭祀 - 在线祭祀缅怀先祖祈福',
    description: '在线祭祀供奉，缅怀先祖敬奉神明，祭祀祈福传承孝道文化',
    url: `${SITE_URL}/ritual`,
    type: 'website',
  },
};

export default function RitualLayout({ children }: { children: React.ReactNode }) {
  return children;
}