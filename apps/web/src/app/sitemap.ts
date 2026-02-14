import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://menonmobility.com';

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

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/search' ? 0.9 : 0.7,
  }));
}
