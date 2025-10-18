import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['de', 'en', 'es', 'fr'] as const;
export const defaultLocale = 'de';
export type Locale = typeof locales[number];

// Locale configuration
export const localeConfig = {
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    nativeName: 'Deutsch'
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    nativeName: 'Español'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    nativeName: 'Français'
  }
} as const;

// Next-intl configuration
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
