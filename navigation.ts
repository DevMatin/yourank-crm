import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './i18n';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  pathnames: {
    // Auth routes
    '/auth/login': {
      de: '/auth/anmelden',
      en: '/auth/login',
      es: '/auth/iniciar-sesion',
      fr: '/auth/connexion'
    },
    '/auth/signup': {
      de: '/auth/registrieren',
      en: '/auth/signup',
      es: '/auth/registro',
      fr: '/auth/inscription'
    },
    
    // Dashboard routes
    '/dashboard': {
      de: '/dashboard',
      en: '/dashboard',
      es: '/dashboard',
      fr: '/dashboard'
    },
    
    // Keywords routes
    '/dashboard/keywords': {
      de: '/dashboard/keywords',
      en: '/dashboard/keywords',
      es: '/dashboard/palabras-clave',
      fr: '/dashboard/mots-cles'
    },
    '/dashboard/keywords/overview-v2': {
      de: '/dashboard/keywords/uebersicht-v2',
      en: '/dashboard/keywords/overview-v2',
      es: '/dashboard/palabras-clave/resumen-v2',
      fr: '/dashboard/mots-cles/apercu-v2'
    },
    '/dashboard/keywords/research': {
      de: '/dashboard/keywords/recherche',
      en: '/dashboard/keywords/research',
      es: '/dashboard/palabras-clave/investigacion',
      fr: '/dashboard/mots-cles/recherche'
    },
    '/dashboard/keywords/competition': {
      de: '/dashboard/keywords/wettbewerb',
      en: '/dashboard/keywords/competition',
      es: '/dashboard/palabras-clave/competencia',
      fr: '/dashboard/mots-cles/concurrence'
    },
    '/dashboard/keywords/performance': {
      de: '/dashboard/keywords/leistung',
      en: '/dashboard/keywords/performance',
      es: '/dashboard/palabras-clave/rendimiento',
      fr: '/dashboard/mots-cles/performance'
    },
    '/dashboard/keywords/trends': {
      de: '/dashboard/keywords/trends',
      en: '/dashboard/keywords/trends',
      es: '/dashboard/palabras-clave/tendencias',
      fr: '/dashboard/mots-cles/tendances'
    },
    '/dashboard/keywords/audience': {
      de: '/dashboard/keywords/zielgruppe',
      en: '/dashboard/keywords/audience',
      es: '/dashboard/palabras-clave/audiencia',
      fr: '/dashboard/mots-cles/audience'
    },
    
    // Other modules
    '/dashboard/backlinks': {
      de: '/dashboard/backlinks',
      en: '/dashboard/backlinks',
      es: '/dashboard/enlaces-retro',
      fr: '/dashboard/liens-retour'
    },
    '/dashboard/serp': {
      de: '/dashboard/serp',
      en: '/dashboard/serp',
      es: '/dashboard/serp',
      fr: '/dashboard/serp'
    },
    '/dashboard/onpage': {
      de: '/dashboard/onpage',
      en: '/dashboard/onpage',
      es: '/dashboard/en-pagina',
      fr: '/dashboard/sur-page'
    },
    '/dashboard/content': {
      de: '/dashboard/content',
      en: '/dashboard/content',
      es: '/dashboard/contenido',
      fr: '/dashboard/contenu'
    },
    '/dashboard/domain': {
      de: '/dashboard/domain',
      en: '/dashboard/domain',
      es: '/dashboard/dominio',
      fr: '/dashboard/domaine'
    },
    '/dashboard/business': {
      de: '/dashboard/business',
      en: '/dashboard/business',
      es: '/dashboard/negocio',
      fr: '/dashboard/entreprise'
    },
    '/dashboard/merchant': {
      de: '/dashboard/merchant',
      en: '/dashboard/merchant',
      es: '/dashboard/comerciante',
      fr: '/dashboard/marchand'
    },
    '/dashboard/labs': {
      de: '/dashboard/labs',
      en: '/dashboard/labs',
      es: '/dashboard/laboratorios',
      fr: '/dashboard/laboratoires'
    },
    '/dashboard/databases': {
      de: '/dashboard/datenbanken',
      en: '/dashboard/databases',
      es: '/dashboard/bases-de-datos',
      fr: '/dashboard/bases-de-donnees'
    },
    '/dashboard/appdata': {
      de: '/dashboard/appdata',
      en: '/dashboard/appdata',
      es: '/dashboard/datos-app',
      fr: '/dashboard/donnees-app'
    }
  }
});
