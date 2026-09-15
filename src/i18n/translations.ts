import { Language } from "../types/common";
import enLocale from "../locales/en.json";

export type TranslationKey = keyof typeof enLocale;
export type Translations = typeof enLocale;

// Lazy loaders for non-English locales to prevent eager bundling of all 23 catalogs
const localeLoaders: Partial<Record<Language, () => Promise<{ default: Translations }>>> = {
  hi: () => import("../locales/hi.json"),
  mr: () => import("../locales/mr.json"),
  bn: () => import("../locales/bn.json"),
  te: () => import("../locales/te.json"),
  ta: () => import("../locales/ta.json"),
  gu: () => import("../locales/gu.json"),
  ur: () => import("../locales/ur.json"),
  kn: () => import("../locales/kn.json"),
  or: () => import("../locales/or.json"),
  ml: () => import("../locales/ml.json"),
  pa: () => import("../locales/pa.json"),
  as: () => import("../locales/as.json"),
  mai: () => import("../locales/mai.json"),
  sa: () => import("../locales/sa.json"),
  kok: () => import("../locales/kok.json"),
  ne: () => import("../locales/ne.json"),
  sd: () => import("../locales/sd.json"),
  ks: () => import("../locales/ks.json"),
  doi: () => import("../locales/doi.json"),
  mni: () => import("../locales/mni.json"),
  brx: () => import("../locales/brx.json"),
  sat: () => import("../locales/sat.json"),
};

// Initialized with enLocale to guarantee immediate synchronous fallback without key leaks
export const translations: Record<Language, Translations> = {
  en: enLocale,
  hi: enLocale,
  mr: enLocale,
  bn: enLocale,
  te: enLocale,
  ta: enLocale,
  gu: enLocale,
  ur: enLocale,
  kn: enLocale,
  or: enLocale,
  ml: enLocale,
  pa: enLocale,
  as: enLocale,
  mai: enLocale,
  sa: enLocale,
  kok: enLocale,
  ne: enLocale,
  sd: enLocale,
  ks: enLocale,
  doi: enLocale,
  mni: enLocale,
  brx: enLocale,
  sat: enLocale,
};

const loadedLocales = new Set<Language>(['en']);
const pendingLoads = new Map<Language, Promise<Translations>>();

export const isLocaleLoaded = (lang: Language): boolean => loadedLocales.has(lang);

export const loadLocale = async (lang: Language): Promise<Translations> => {
  if (loadedLocales.has(lang)) {
    return translations[lang];
  }
  if (pendingLoads.has(lang)) {
    return pendingLoads.get(lang)!;
  }
  const loader = localeLoaders[lang];
  if (!loader) {
    return translations.en;
  }
  const loadPromise = loader()
    .then((mod) => {
      const data = mod.default || (mod as any);
      translations[lang] = data;
      loadedLocales.add(lang);
      pendingLoads.delete(lang);
      return data;
    })
    .catch((err) => {
      console.warn(`[i18n] Failed to load locale "${lang}":`, err);
      pendingLoads.delete(lang);
      return translations.en;
    });

  pendingLoads.set(lang, loadPromise);
  return loadPromise;
};

// Immediate background warm-up if user previously selected a non-English language
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('swasthyasync_language') as Language;
    if (saved && saved !== 'en' && localeLoaders[saved]) {
      loadLocale(saved);
    }
  } catch {
    // Ignore storage access errors
  }
}
