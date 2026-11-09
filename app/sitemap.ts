import type { MetadataRoute } from 'next';
import { ALL_BOOKS } from '@/lib/classics';
import { getAllKnowledgeRoutes } from '@/lib/seo/knowledge';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date('2026-04-28');

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/chart`, priority: 0.95, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/heming`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/daily`, priority: 0.8, changeFrequency: 'daily', lastModified: lastmod },
    { url: `${BASE_URL}/cezi`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/chouqian`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/tongqian`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/mianxiang`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/shouxiang`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/fengshui`, priority: 0.7, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/library`, priority: 0.85, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/knowledge`, priority: 0.9, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/recitation`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/vegetarian`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/meditation`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/reflection`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/taichi`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/charity`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/prayer`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/wish`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/repent`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/lamp`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/incense`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/ritual`, priority: 0.6, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/ranking`, priority: 0.5, changeFrequency: 'daily', lastModified: lastmod },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: 'monthly', lastModified: lastmod },
    { url: `${BASE_URL}/privacy`, priority: 0.3, changeFrequency: 'monthly', lastModified: lastmod },
  ];

  const libraryPages: MetadataRoute.Sitemap = ALL_BOOKS.flatMap(book => {
    const bookHome: MetadataRoute.Sitemap[number] = {
      url: `${BASE_URL}/library/${book.slug}`,
      priority: 0.75,
      changeFrequency: 'monthly',
      lastModified: lastmod,
    };
    const chapters: MetadataRoute.Sitemap = book.chapters.map((_, i) => ({
      url: `${BASE_URL}/library/${book.slug}/${i}`,
      priority: 0.7,
      changeFrequency: 'monthly',
      lastModified: lastmod,
    }));
    return [bookHome, ...chapters];
  });

  const knowledgePages: MetadataRoute.Sitemap = getAllKnowledgeRoutes().map(({ slug, topic }) => ({
    url: `${BASE_URL}/knowledge/${slug}/${topic}`,
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: lastmod,
  }));

  return [...staticPages, ...libraryPages, ...knowledgePages];
}
