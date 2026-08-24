import { Language } from '../types/common';

/**
 * Standard BCP-47 Locale mapping for India's 22 official languages + English
 */
export const LANGUAGE_LOCALE_MAP: Record<Language, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  hi: ['hi-IN', 'hi', 'hi_IN'],
  mr: ['mr-IN', 'mr', 'hi-IN', 'hi'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  te: ['te-IN', 'te'],
  ta: ['ta-IN', 'ta-LK', 'ta-SG', 'ta'],
  gu: ['gu-IN', 'gu'],
  ur: ['ur-IN', 'ur-PK', 'ur'],
  kn: ['kn-IN', 'kn'],
  or: ['or-IN', 'or', 'od-IN'],
  ml: ['ml-IN', 'ml'],
  pa: ['pa-IN', 'pa-PK', 'pa'],
  as: ['as-IN', 'as', 'bn-IN'],
  mai: ['mai-IN', 'hi-IN', 'hi'],
  sa: ['sa-IN', 'sa', 'hi-IN'],
  kok: ['kok-IN', 'kok', 'mr-IN', 'hi-IN'],
  ne: ['ne-NP', 'ne-IN', 'ne'],
  sd: ['sd-IN', 'sd', 'hi-IN'],
  ks: ['ks-IN', 'ks', 'ur-IN'],
  doi: ['doi-IN', 'hi-IN', 'hi'],
  mni: ['mni-IN', 'as-IN', 'bn-IN'],
  brx: ['brx-IN', 'as-IN'],
  sat: ['sat-IN', 'or-IN', 'hi-IN']
};

export interface TTSVoiceInfo {
  voice: SpeechSynthesisVoice;
  isExactLocale: boolean;
  displayName: string;
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
 * Get the best matching available browser voice for a given language code
 */
export function getBestVoiceForLanguage(lang: Language): TTSVoiceInfo | null {
  if (!isSpeechSynthesisSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const candidateLocales = LANGUAGE_LOCALE_MAP[lang] || ['en-IN', 'en-US', 'en'];

  // 1. Try exact matching from candidate list
  for (const locale of candidateLocales) {
    const exactVoice = voices.find(
      (v) => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === locale.toLowerCase()
    );
    if (exactVoice) {
      return {
        voice: exactVoice,
        isExactLocale: true,
        displayName: `${exactVoice.name} (${exactVoice.lang})`
      };
    }
  }

  // 2. Try prefix matching (e.g. 'hi' matches 'hi-IN' or 'hi_IN')
  for (const locale of candidateLocales) {
    const prefix = locale.split(/[-_]/)[0].toLowerCase();
    const prefixVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (prefixVoice) {
      return {
        voice: prefixVoice,
        isExactLocale: true,
        displayName: `${prefixVoice.name} (${prefixVoice.lang})`
      };
    }
  }

  // 3. Fallback to default system voice or first available voice
  const defaultVoice = voices.find((v) => v.default) || voices[0];
  return {
    voice: defaultVoice,
    isExactLocale: false,
    displayName: `${defaultVoice.name} (Default)`
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
      utterance.lang = LANGUAGE_LOCALE_MAP[params.language]?.[0] || 'en-IN';
    }

    utterance.rate = params.rate || 0.95; // Slightly slower for crisp healthcare clarity
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
      // 'interrupted' is normal when user clicks Stop or switches report
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
