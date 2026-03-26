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

export const metadata: Metadata = {
  title: 'RevRecover AI',
  description: 'Clinical Precision in Revenue Recovery',
};

import { AuthProvider } from '@/components/AuthProvider';
import { CookieConsent } from '@/components/CookieConsent';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-surface text-on-surface font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <CookieConsent />
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
