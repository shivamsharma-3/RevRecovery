import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revrecovery.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The dashboard is behind auth and the API routes are not content.
        disallow: ['/dashboard', '/dashboard/', '/api/', '/auth'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
