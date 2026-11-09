'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PATH_TO_FEATURE: Record<string, string> = {
  '/chart': 'chart',
  '/heming': 'heming',
  '/daily': 'daily',
  '/cezi': 'cezi',
  '/chouqian': 'chouqian',
  '/tongqian': 'tongqian',
  '/mianxiang': 'mianxiang',
  '/shouxiang': 'shouxiang',
  '/fengshui': 'fengshui',
  '/library': 'library',
  '/knowledge': 'knowledge',
  '/recitation': 'recitation',
  '/vegetarian': 'vegetarian',
  '/meditation': 'meditation',
  '/reflection': 'reflection',
  '/taichi': 'taichi',
  '/charity': 'charity',
  '/prayer': 'prayer',
  '/wish': 'wish',
  '/repent': 'repent',
  '/lamp': 'lamp',
  '/incense': 'incense',
  '/ritual': 'ritual',
};

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const feature = PATH_TO_FEATURE[pathname];
    if (feature) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature }),
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}