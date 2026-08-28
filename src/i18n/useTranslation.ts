import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { translations, Translations, TranslationKey } from './translations';
import { Language } from '../types/common';

// Dot-notation and semantic aliases mapping to canonical translation keys
const KEY_ALIASES: Record<string, keyof Translations> = {
  'symptoms.title': 'symptomCheckerTitle',
  'symptoms.subtitle': 'symptomCheckerSubtitle',
  'symptoms.overview': 'clinicalOverview',
  'symptoms.logged': 'loggedSymptomsHistory',
  'profile.title': 'profile',
  'profile.subtitle': 'profileSubtitle',
  'records.title': 'medicalRecordsTitle',
  'records.subtitle': 'medicalRecordsSubtitle',
  'appointments.title': 'appointmentsTitle',
  'appointments.subtitle': 'appointmentsSubtitle',
  'dashboard.title': 'citizenPortal',
  'settings.title': 'settings',
  'notifications.title': 'notificationsTitle',
  'notifications.subtitle': 'notificationsSubtitle',
  'caresetu.title': 'careSetuCard',
  'caresetu.subtitle': 'careSetuSubtitle',
  'doctor.performance': 'doctorBreakdownTitle',
  'admin.audit': 'qualityAuditConsole'
};

/**
 * Humanize a raw key into a readable label as a safety fallback
 * Example: 'symptomCheckerTitle' -> 'Symptom Checker'
 * Example: 'patient.records.view' -> 'Patient Records View'
 */
function humanizeKey(key: string): string {
  if (!key) return '';
  const clean = key.includes('.') ? key.split('.').pop()! : key;
  const words = clean.replace(/([A-Z])/g, ' $1').replace(/[_.-]/g, ' ').trim();
  // Strip trailing internal markers
  const stripped = words.replace(/\b(Title|Subtitle|Desc|Label|Btn|Col|Tab|Placeholder)\b/gi, '').trim();
  const finalStr = stripped || words;
  return finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
}

export function useTranslation() {
  const { language, setLanguage } = useAuth();
  const currentLang: Language = language || 'en';
  const currentDict: Translations = translations[currentLang] || translations.en;

  // Automate RTL for Urdu and LTR for other 22 languages
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRtl = currentLang === 'ur';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
      if (isRtl) {
        document.body.classList.add('font-urdu');
      } else {
        document.body.classList.remove('font-urdu');
      }
    }
  }, [currentLang]);

  /**
   * String interpolation / template formatter
   * Example: format('You have {count} appointments with Dr. {doctor}', { count: 3, doctor: 'Sharma' })
   */
  const format = (template: string, params: Record<string, string | number>): string => {
    let result = template;
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{\\s*${k}\\s*\\}`, 'g'), String(v));
    }
    return result;
  };

  /**
   * Locale-aware Date Formatter
   */
  const formatDate = (dateInput: string | Date | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
      const localeMap: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        gu: 'gu-IN',
        ur: 'ur-IN',
        kn: 'kn-IN',
        or: 'or-IN',
        ml: 'ml-IN',
        pa: 'pa-IN',
        as: 'as-IN',
        mai: 'mai-IN',
        sa: 'sa-IN',
        kok: 'kok-IN',
        ne: 'ne-NP',
        sd: 'sd-IN',
        ks: 'ks-IN',
        doi: 'doi-IN',
        mni: 'mni-IN',
        brx: 'brx-IN',
        sat: 'sat-IN'
      };
      const loc = localeMap[currentLang] || 'en-IN';
      return new Intl.DateTimeFormat(loc, options || { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
    } catch {
      return String(dateInput);
    }
  };

  /**
   * Translate controlled status codes
   */
  const translateStatus = (statusCode: string): string => {
    const keyMap: Record<string, keyof Translations> = {
      Upcoming: 'statusUpcoming',
      upcoming: 'statusUpcoming',
      'In Consultation': 'statusInConsultation',
      in_consultation: 'statusInConsultation',
      Completed: 'statusCompleted',
      completed: 'statusCompleted',
      Cancelled: 'statusCancelled',
      cancelled: 'statusCancelled',
      Urgent: 'statusUrgent',
      urgent: 'statusUrgent',
      Normal: 'statusNormal',
      normal: 'statusNormal',
      'Critical Load': 'statusCritical',
      critical: 'statusCritical'
    };
    const mappedKey = keyMap[statusCode];
    if (mappedKey && (currentDict[mappedKey] || translations.en[mappedKey])) {
      return currentDict[mappedKey] || translations.en[mappedKey];
    }
    return statusCode;
  };

  /**
   * Functional translator with parameter interpolation, dot-notation & fallback safety
   */
  const translateFn = (key: TranslationKey | string, params?: Record<string, string | number>): string => {
    const aliasKey = KEY_ALIASES[key];
    const normalizedKey = key.includes('.') ? key.split('.').pop()! : key;
    
    let val: string | undefined = 
      (aliasKey && currentDict[aliasKey]) ||
      currentDict[key as keyof Translations] || 
      currentDict[normalizedKey as keyof Translations] || 
      (aliasKey && translations.en[aliasKey]) ||
      translations.en[key as keyof Translations] || 
      translations.en[normalizedKey as keyof Translations];
      
    if (!val || val === key) {
      val = humanizeKey(key);
    }
              
    if (params) {
      val = format(val, params);
    }
    return val;
  };

  // Attach helpers to translateFn
  (translateFn as any).format = format;
  (translateFn as any).formatDate = formatDate;
  (translateFn as any).status = translateStatus;

  // Create unified proxy allowing both t.key and t('key', params)
  const t = new Proxy(translateFn, {
    get(target, prop: string) {
      if (prop === 'format') return format;
      if (prop === 'formatDate') return formatDate;
      if (prop === 'status') return translateStatus;
      if (prop in target) return (target as any)[prop];
      if (prop in currentDict && currentDict[prop as keyof Translations]) {
        return currentDict[prop as keyof Translations];
      }
      if (prop in KEY_ALIASES) {
        const mapped = KEY_ALIASES[prop];
        return currentDict[mapped] || translations.en[mapped];
      }
      if (prop in translations.en && translations.en[prop as keyof Translations]) {
        return translations.en[prop as keyof Translations];
      }
      return humanizeKey(prop);
    }
  }) as unknown as Translations & {
    (key: TranslationKey | string, params?: Record<string, string | number>): string;
    format: (template: string, params: Record<string, string | number>) => string;
    formatDate: (dateInput: string | Date | number, options?: Intl.DateTimeFormatOptions) => string;
    status: (statusCode: string) => string;
  };

  return {
    t,
    translate: translateFn,
    format,
    formatDate,
    status: translateStatus,
    language: currentLang,
    isRtl: currentLang === 'ur',
    setLanguage
  };
}
