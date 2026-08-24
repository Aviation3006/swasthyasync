import { Language } from '../types/common';

/**
 * Standard BCP-47 Locale mapping for India's 22 official languages + English
 */
export const LANGUAGE_LOCALE_MAP: Record<Language, { primary: string; aliases: string[]; nameEn: string; nameNative: string }> = {
  en: { primary: 'en-IN', aliases: ['en_IN', 'en-GB', 'en-US', 'en'], nameEn: 'Indian English', nameNative: 'English (India)' },
  hi: { primary: 'hi-IN', aliases: ['hi_IN', 'hi'], nameEn: 'Hindi', nameNative: 'हिन्दी' },
  mr: { primary: 'mr-IN', aliases: ['mr_IN', 'mr', 'hi-IN', 'hi_IN', 'hi'], nameEn: 'Marathi', nameNative: 'मराठी' },
  bn: { primary: 'bn-IN', aliases: ['bn_IN', 'bn-BD', 'bn'], nameEn: 'Bengali', nameNative: 'বাংলা' },
  te: { primary: 'te-IN', aliases: ['te_IN', 'te'], nameEn: 'Telugu', nameNative: 'తెలుగు' },
  ta: { primary: 'ta-IN', aliases: ['ta_IN', 'ta-LK', 'ta-SG', 'ta'], nameEn: 'Tamil', nameNative: 'தமிழ்' },
  gu: { primary: 'gu-IN', aliases: ['gu_IN', 'gu'], nameEn: 'Gujarati', nameNative: 'ગુજરાતી' },
  ur: { primary: 'ur-IN', aliases: ['ur_IN', 'ur-PK', 'ur'], nameEn: 'Urdu', nameNative: 'اُردُو' },
  kn: { primary: 'kn-IN', aliases: ['kn_IN', 'kn'], nameEn: 'Kannada', nameNative: 'ಕನ್ನಡ' },
  or: { primary: 'or-IN', aliases: ['or_IN', 'od-IN', 'or'], nameEn: 'Odia', nameNative: 'ଓଡ଼ିଆ' },
  ml: { primary: 'ml-IN', aliases: ['ml_IN', 'ml'], nameEn: 'Malayalam', nameNative: 'മലയാളം' },
  pa: { primary: 'pa-IN', aliases: ['pa_IN', 'pa-PK', 'pa'], nameEn: 'Punjabi', nameNative: 'ਪੰਜਾਬੀ' },
  as: { primary: 'as-IN', aliases: ['as_IN', 'as', 'bn-IN'], nameEn: 'Assamese', nameNative: 'অসমীয়া' },
  mai: { primary: 'mai-IN', aliases: ['mai_IN', 'hi-IN', 'hi'], nameEn: 'Maithili', nameNative: 'मैथिली' },
  sa: { primary: 'sa-IN', aliases: ['sa_IN', 'sa', 'hi-IN'], nameEn: 'Sanskrit', nameNative: 'संस्कृतम्' },
  kok: { primary: 'kok-IN', aliases: ['kok_IN', 'kok', 'mr-IN', 'hi-IN'], nameEn: 'Konkani', nameNative: 'कोंकणी' },
  ne: { primary: 'ne-NP', aliases: ['ne-IN', 'ne_NP', 'ne'], nameEn: 'Nepali', nameNative: 'नेपाली' },
  sd: { primary: 'sd-IN', aliases: ['sd_IN', 'sd', 'hi-IN'], nameEn: 'Sindhi', nameNative: 'सिन्धी' },
  ks: { primary: 'ks-IN', aliases: ['ks_IN', 'ks', 'ur-IN'], nameEn: 'Kashmiri', nameNative: 'कॉशुर' },
  doi: { primary: 'doi-IN', aliases: ['doi_IN', 'hi-IN'], nameEn: 'Dogri', nameNative: 'डोगरी' },
  mni: { primary: 'mni-IN', aliases: ['mni_IN', 'as-IN', 'bn-IN'], nameEn: 'Manipuri', nameNative: 'মৈতৈলোন্' },
  brx: { primary: 'brx-IN', aliases: ['brx_IN', 'as-IN'], nameEn: 'Bodo', nameNative: 'बड़ो' },
  sat: { primary: 'sat-IN', aliases: ['sat_IN', 'or-IN', 'hi-IN'], nameEn: 'Santali', nameNative: 'ᱥᱟᱱᱛᱟᱲᱤ' }
};

export const CORE_TTS_LANGUAGES: { code: Language; label: string; locale: string; flag: string }[] = [
  { code: 'en', label: 'English (India)', locale: 'en-IN', flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी', locale: 'hi-IN', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', locale: 'mr-IN', flag: '🇮🇳' }
];

export interface TTSVoiceInfo {
  voice: SpeechSynthesisVoice;
  isExactLocale: boolean;
  displayName: string;
  languageLabel: string;
  isFallback: boolean;
  hasNativeVoice: boolean;
  statusNotice?: string;
}

/**
 * Strip Markdown & Clean medical text for natural speech pronunciation
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/[#*_~`]/g, '') // remove markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // convert markdown links to text
    .replace(/•|\*|-/g, ' ') // convert bullets to spaces
    .replace(/\s+/g, ' ') // normalize whitespace
    .replace(/(\d+)\/(\d+)\s*mmHg/gi, '$1 over $2 millimeters of mercury') // BP pronunciation
    .replace(/mg\/dL/gi, 'milligrams per deciliter')
    .replace(/g\/dL/gi, 'grams per deciliter')
    .replace(/°F/g, 'degrees Fahrenheit')
    .replace(/°C/g, 'degrees Celsius')
    .replace(/%\s*/g, ' percent ')
    .trim();
}

/**
 * Check if Web Speech Synthesis API is supported by the browser
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Calculate match ranking score for a browser voice against a target language.
 */
export function scoreVoiceForLanguage(voice: SpeechSynthesisVoice, lang: Language): number {
  const voiceLang = (voice.lang || '').replace('_', '-').toLowerCase();
  const voiceName = (voice.name || '').toLowerCase();
  let score = 0;

  if (lang === 'en') {
    // ENGLISH: Strictly prefer en-IN over en-US / en-GB
    if (voiceLang === 'en-in') {
      score += 1000;
    } else if (voiceName.includes('india') || voiceName.includes('indian') || voiceName.includes('heera') || voiceName.includes('neerja') || voiceName.includes('prabhat') || voiceName.includes('rishi') || voiceName.includes('veena') || voiceName.includes('isha')) {
      score += 800;
    } else if (voiceLang.startsWith('en-gb') || voiceLang === 'en-gb') {
      score += 150;
    } else if (voiceLang.startsWith('en-us') || voiceLang === 'en-us') {
      score += 100;
    } else if (voiceLang.startsWith('en')) {
      score += 80;
    } else {
      return -100;
    }
  } else if (lang === 'hi') {
    // HINDI: Strictly prefer hi-IN
    if (voiceLang === 'hi-in' || voiceLang === 'hi') {
      score += 1000;
    } else if (voiceName.includes('hindi') || voiceName.includes('हिन्दी') || voiceName.includes('hemant') || voiceName.includes('kalpana') || voiceName.includes('swara') || voiceName.includes('madhur') || voiceName.includes('lekha') || voiceName.includes('neel')) {
      score += 800;
    } else if (voiceLang.startsWith('hi')) {
      score += 500;
    } else if (voiceLang === 'mr-in' || voiceLang.startsWith('mr')) {
      score += 200;
    } else if (voiceLang === 'en-in') {
      score += 50;
    } else {
      score += 10;
    }
  } else if (lang === 'mr') {
    // MARATHI: Strictly prefer mr-IN, fallback gracefully to hi-IN
    if (voiceLang === 'mr-in' || voiceLang === 'mr') {
      score += 1000;
    } else if (voiceName.includes('marathi') || voiceName.includes('मराठी') || voiceName.includes('aarohi') || voiceName.includes('manohar')) {
      score += 800;
    } else if (voiceLang.startsWith('mr')) {
      score += 500;
    } else if (voiceLang === 'hi-in' || voiceLang === 'hi' || voiceName.includes('hindi') || voiceName.includes('हिन्दी')) {
      score += 350;
    } else if (voiceLang === 'en-in') {
      score += 50;
    } else {
      score += 10;
    }
  } else {
    const meta = LANGUAGE_LOCALE_MAP[lang];
    const primary = meta?.primary.toLowerCase();
    const aliases = (meta?.aliases || []).map(a => a.toLowerCase());

    if (primary && voiceLang === primary) {
      score += 1000;
    } else if (aliases.includes(voiceLang)) {
      score += 600;
    } else if (voiceName.includes(meta?.nameEn.toLowerCase() || '')) {
      score += 500;
    } else if (primary && voiceLang.startsWith(primary.split('-')[0])) {
      score += 300;
    } else if (voiceLang.endsWith('-in')) {
      score += 50;
    } else {
      score += 10;
    }
  }

  if (voiceName.includes('natural') || voiceName.includes('online') || voiceName.includes('neural') || voiceName.includes('google')) {
    score += 40;
  }

  if (voice.default) {
    score += 10;
  }

  return score;
}

/**
 * Get the best matching available browser voice for a given language code.
 */
export function getBestVoiceForLanguage(lang: Language): TTSVoiceInfo | null {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const langMeta = LANGUAGE_LOCALE_MAP[lang] || LANGUAGE_LOCALE_MAP.en;

  // Rank all available voices
  const rankedVoices = voices
    .map(v => ({ voice: v, score: scoreVoiceForLanguage(v, lang) }))
    .sort((a, b) => b.score - a.score);

  const best = rankedVoices[0]?.voice || voices[0];
  const bestScore = rankedVoices[0]?.score || 0;

  const voiceLang = (best.lang || '').replace('_', '-').toLowerCase();
  const primaryLocale = langMeta.primary.toLowerCase();

  // Check if a native voice actually exists for this specific language
  const hasNative = rankedVoices.some(rv => {
    const l = (rv.voice.lang || '').replace('_', '-').toLowerCase();
    return l === primaryLocale || (lang === 'en' && l === 'en-in') || (lang === 'hi' && l.startsWith('hi')) || (lang === 'mr' && l.startsWith('mr'));
  });

  const isExact = voiceLang === primaryLocale || (lang === 'en' && voiceLang === 'en-in') || (lang === 'hi' && voiceLang.startsWith('hi')) || (lang === 'mr' && voiceLang.startsWith('mr'));
  const isFallback = !isExact;

  let languageLabel = `${langMeta.nameNative} (${langMeta.primary})`;
  let statusNotice: string | undefined = undefined;

  if (lang === 'en') {
    languageLabel = isExact ? 'English (India) — en-IN' : 'English (System Fallback)';
    if (isFallback) {
      statusNotice = 'Native en-IN voice not installed on device — using system voice.';
    }
  } else if (lang === 'hi') {
    languageLabel = isExact ? 'हिन्दी — hi-IN' : 'हिन्दी (सहायक आवाज)';
    if (isFallback) {
      statusNotice = 'Native hi-IN voice not installed on device — using fallback.';
    }
  } else if (lang === 'mr') {
    languageLabel = isExact ? 'मराठी — mr-IN' : 'मराठी (हिन्दी/System Fallback)';
    if (isFallback) {
      statusNotice = 'Native Marathi (mr-IN) voice not on device — using Hindi/System fallback.';
    }
  }

  return {
    voice: best,
    isExactLocale: isExact,
    displayName: `${best.name} (${best.lang || 'default'})`,
    languageLabel,
    isFallback,
    hasNativeVoice: hasNative,
    statusNotice
  };
}

/**
 * Controller for Web Speech Synthesis
 */
export class TextToSpeechController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((state: { isPlaying: boolean; isPaused: boolean }) => void) | null = null;

  constructor(onStateChange?: (state: { isPlaying: boolean; isPaused: boolean }) => void) {
    this.onStateChangeCallback = onStateChange || null;
  }

  public speak(params: {
    text: string;
    language: Language;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }): boolean {
    if (!isSpeechSynthesisSupported()) return false;

    // Cancel any previous speech
    this.stop();

    const cleanedText = cleanTextForSpeech(params.text);
    if (!cleanedText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voiceInfo = getBestVoiceForLanguage(params.language);

    if (voiceInfo?.voice) {
      utterance.voice = voiceInfo.voice;
      utterance.lang = voiceInfo.voice.lang;
    } else {
      const meta = LANGUAGE_LOCALE_MAP[params.language] || LANGUAGE_LOCALE_MAP.en;
      utterance.lang = meta.primary;
    }

    utterance.rate = params.rate || 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.notifyState(true, false);
      if (params.onStart) params.onStart();
    };

    utterance.onpause = () => {
      this.notifyState(false, true);
    };

    utterance.onresume = () => {
      this.notifyState(true, false);
    };

    utterance.onend = () => {
      this.notifyState(false, false);
      this.currentUtterance = null;
      if (params.onEnd) params.onEnd();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e);
      }
      this.notifyState(false, false);
      this.currentUtterance = null;
      if (params.onError) params.onError(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public pause(): void {
    if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      this.notifyState(false, true);
    }
  }

  public resume(): void {
    if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.notifyState(true, false);
    }
  }

  public stop(): void {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.notifyState(false, false);
    }
  }

  private notifyState(isPlaying: boolean, isPaused: boolean) {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ isPlaying, isPaused });
    }
  }
}
