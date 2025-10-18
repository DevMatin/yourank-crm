import type { Metadata } from 'next';
import { Inter, Rubik } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  
  return {
    title: messages.metadata?.title || 'yourank.ai - SEO Analysis Platform',
    description: messages.metadata?.description || 'All-in-One SEO Analysis Platform with AI-powered insights',
    keywords: messages.metadata?.keywords || ['SEO', 'Analysis', 'Keywords', 'SERP', 'AI', 'Marketing'],
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
      locale: locale,
      url: `https://yourank.ai/${locale}`,
      title: messages.metadata?.title || 'yourank.ai - SEO Analysis Platform',
      description: messages.metadata?.description || 'All-in-One SEO Analysis Platform with AI-powered insights',
      siteName: 'yourank.ai',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.metadata?.title || 'yourank.ai - SEO Analysis Platform',
      description: messages.metadata?.description || 'All-in-One SEO Analysis Platform with AI-powered insights',
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
    alternates: {
      canonical: `https://yourank.ai/${locale}`,
      languages: {
        'de': 'https://yourank.ai/de',
        'en': 'https://yourank.ai/en',
        'es': 'https://yourank.ai/es',
        'fr': 'https://yourank.ai/fr',
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${rubik.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ClientOnly>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </NextIntlClientProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
