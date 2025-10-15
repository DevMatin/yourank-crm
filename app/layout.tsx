import type { Metadata } from 'next';
import { Inter, Rubik } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ClientOnly } from '@/components/client-only';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const rubik = Rubik({ 
  subsets: ['latin'],
  variable: '--font-rubik',
});

export const metadata: Metadata = {
  title: 'yourank.ai - SEO Analysis Platform',
  description: 'All-in-One SEO Analysis Platform with AI-powered insights',
  keywords: ['SEO', 'Analysis', 'Keywords', 'SERP', 'AI', 'Marketing'],
  authors: [{ name: 'yourank.ai Team' }],
  creator: 'yourank.ai',
  publisher: 'yourank.ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourank.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourank.ai',
    title: 'yourank.ai - SEO Analysis Platform',
    description: 'All-in-One SEO Analysis Platform with AI-powered insights',
    siteName: 'yourank.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'yourank.ai - SEO Analysis Platform',
    description: 'All-in-One SEO Analysis Platform with AI-powered insights',
    creator: '@yourankai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${rubik.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
