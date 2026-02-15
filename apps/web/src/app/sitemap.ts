import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const BASE_URL = 'https://menonmobility.com';

async function fetchSitemapData(path: string) {
  try {
    const res = await fetch(`${API_URL}/sitemap/${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    '',
    '/search',
    '/trucks',
    '/trailers',
    '/construction',
    '/vans',
    '/cars',
    '/containers',
    '/parts',
    '/about',
    '/contact',
    '/pricing',
    '/faq',
    '/how-it-works',
    '/terms',
    '/privacy',
    '/compare',
    '/login',
    '/register',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/search' ? 0.9 : 0.7,
  }));

  // Dynamic pages from API
  const [listings, sellers] = await Promise.all([
    fetchSitemapData('listings'),
    fetchSitemapData('sellers'),
  ]);

  const listingEntries: MetadataRoute.Sitemap = listings.map(
    (l: { slug: string; updatedAt: string }) => ({
      url: `${BASE_URL}/listings/${l.slug}`,
      lastModified: new Date(l.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  const sellerEntries: MetadataRoute.Sitemap = sellers.map(
    (s: { slug: string; updatedAt: string }) => ({
      url: `${BASE_URL}/sellers/${s.slug}`,
      lastModified: new Date(s.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })
  );

  return [...staticEntries, ...listingEntries, ...sellerEntries];
}
