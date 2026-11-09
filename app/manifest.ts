import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '紫微研究 - AI紫微斗数排盘与命理解读',
    short_name: '紫微研究',
    description: '基于倪海厦正宗紫微斗数体系的AI命理平台',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a2e',
    theme_color: '#c9a84c',
    lang: 'zh-CN',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}