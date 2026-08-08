import type {Metadata} from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://revrecovery.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RevRecover AI — Recover revenue lost to denials and no-shows',
    template: '%s | RevRecover AI',
  },
  description:
    'RevRecover AI helps dental and medical practices triage denied claims, draft payer appeals, and flag appointments at risk of no-showing.',
  applicationName: 'RevRecover AI',
  keywords: [
    'revenue cycle management',
    'dental billing',
    'claim denial management',
    'patient no-show prediction',
    'accounts receivable recovery',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'RevRecover AI',
    url: siteUrl,
    title: 'RevRecover AI — Recover revenue lost to denials and no-shows',
    description:
      'Triage denied claims, draft payer appeals, and flag at-risk appointments — built for dental and medical practices.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RevRecover AI',
    description:
      'Triage denied claims, draft payer appeals, and flag at-risk appointments.',
  },
  robots: { index: true, follow: true },
};

import { AuthProvider } from '@/components/AuthProvider';
import { CookieConsent } from '@/components/CookieConsent';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'sonner';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-surface text-on-surface font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
          <CookieConsent />
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
