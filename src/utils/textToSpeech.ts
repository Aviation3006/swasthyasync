import { Language } from '../types/common';
import { fetchCloudTTSAudio, cleanTextForCloudTTS } from '../services/cloudTtsService';

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

export interface TTSLanguageOption {
  code: 'en' | 'hi' | 'mr';
  languageCode: 'en-IN' | 'hi-IN' | 'mr-IN';
  label: string;
  nativeLabel: string;
  flag: string;
  cloudVoiceName: string;
}

export const CLOUD_TTS_LANGUAGES: TTSLanguageOption[] = [
  {
    code: 'en',
    languageCode: 'en-IN',
    label: 'English (India)',
    nativeLabel: 'English (India)',
    flag: '🇮🇳',
    cloudVoiceName: 'Gemini Cloud TTS — English (India)'
  },
  {
    code: 'hi',
    languageCode: 'hi-IN',
    label: 'हिन्दी',
    nativeLabel: 'हिन्दी',
    flag: '🇮🇳',
    cloudVoiceName: 'Gemini Cloud TTS — हिन्दी'
  },
  {
    code: 'mr',
    languageCode: 'mr-IN',
    label: 'मराठी',
    nativeLabel: 'मराठी',
    flag: '🇮🇳',
    cloudVoiceName: 'Gemini Cloud TTS — मराठी'
  }
];

export const CORE_TTS_LANGUAGES = CLOUD_TTS_LANGUAGES;

export { cleanTextForCloudTTS };

export function cleanTextForSpeech(rawText: string): string {
  return cleanTextForCloudTTS(rawText);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function scoreVoiceForLanguage(voice: SpeechSynthesisVoice, lang: Language): number {
  const voiceLang = (voice.lang || '').replace('_', '-').toLowerCase();
  const voiceName = (voice.name || '').toLowerCase();
  let score = 0;

  if (lang === 'en') {
    if (voiceLang === 'en-in') {
      score += 1000;
    } else if (voiceName.includes('india') || voiceName.includes('indian') || voiceName.includes('heera') || voiceName.includes('neerja') || voiceName.includes('prabhat')) {
      score += 800;
    } else if (voiceLang.startsWith('en-gb') || voiceLang === 'en-gb') {
      score += 150;
    } else if (voiceLang.startsWith('en-us') || voiceLang === 'en-us') {
      score += 100;
    } else {
      return -100;
    }
  } else if (lang === 'hi') {
    if (voiceLang === 'hi-in' || voiceLang === 'hi') {
      score += 1000;
    } else if (voiceName.includes('hindi') || voiceName.includes('हिन्दी') || voiceName.includes('hemant') || voiceName.includes('kalpana')) {
      score += 800;
    } else if (voiceLang.startsWith('hi')) {
      score += 500;
    } else {
      score += 10;
    }
  } else if (lang === 'mr') {
    if (voiceLang === 'mr-in' || voiceLang === 'mr') {
      score += 1000;
    } else if (voiceName.includes('marathi') || voiceName.includes('मराठी') || voiceName.includes('aarohi')) {
      score += 800;
    } else if (voiceLang === 'hi-in' || voiceLang === 'hi' || voiceName.includes('hindi') || voiceName.includes('हिन्दी')) {
      score += 350;
    } else {
      score += 10;
    }
  }

  return score;
}

export interface TTSVoiceInfo {
  voice?: SpeechSynthesisVoice;
  isExactLocale?: boolean;
  displayName: string;
  languageLabel: string;
  isFallback?: boolean;
  hasNativeVoice?: boolean;
  statusNotice?: string;
}

export function getBestVoiceForLanguage(lang: Language): TTSVoiceInfo | null {
  const opt = CLOUD_TTS_LANGUAGES.find(l => l.code === lang) || CLOUD_TTS_LANGUAGES[0];
  return {
    displayName: opt.cloudVoiceName,
    languageLabel: opt.nativeLabel,
    hasNativeVoice: true
  };
}

/**
 * Controller for Native HTML5 Cloud Audio Playback
 */
export class CloudAudioPlayerController {
  private audioElement: HTMLAudioElement | null = null;
  private currentSpeed: number = 0.95;
  private onStateChange: ((state: { isPlaying: boolean; isPaused: boolean; isLoading: boolean; error: string | null }) => void) | null = null;

  constructor(onStateChange?: (state: { isPlaying: boolean; isPaused: boolean; isLoading: boolean; error: string | null }) => void) {
    this.onStateChange = onStateChange || null;
  }

  public async playCloudSpeech(params: {
    text: string;
    languageCode: 'en-IN' | 'hi-IN' | 'mr-IN' | string;
    speed?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (errorMsg: string) => void;
  }): Promise<void> {
    this.stop();

    if (params.speed) {
      this.currentSpeed = params.speed;
    }

    this.notifyState({ isPlaying: false, isPaused: false, isLoading: true, error: null });

    try {
      const audioDataUri = await fetchCloudTTSAudio({
        text: params.text,
        languageCode: params.languageCode
      });

      const audio = new Audio(audioDataUri);
      this.audioElement = audio;
      audio.playbackRate = this.currentSpeed;

      audio.onplay = () => {
        this.notifyState({ isPlaying: true, isPaused: false, isLoading: false, error: null });
        if (params.onStart) params.onStart();
      };

      audio.onpause = () => {
        if (!audio.ended && audio.currentTime > 0) {
          this.notifyState({ isPlaying: false, isPaused: true, isLoading: false, error: null });
        }
      };

      audio.onended = () => {
        this.notifyState({ isPlaying: false, isPaused: false, isLoading: false, error: null });
        if (params.onEnd) params.onEnd();
      };

      audio.onerror = (e) => {
        console.error('Audio element playback error:', e);
        const errMsg = 'Cloud voice playback encountered an issue.';
        this.notifyState({ isPlaying: false, isPaused: false, isLoading: false, error: errMsg });
        if (params.onError) params.onError(errMsg);
      };

      await audio.play();
    } catch (err: any) {
      console.error('Cloud TTS generation failed:', err);
      const userFacingError = 'Cloud voice is temporarily unavailable. Please try again.';
      this.notifyState({ isPlaying: false, isPaused: false, isLoading: false, error: userFacingError });
      if (params.onError) params.onError(userFacingError);
    }
  }

  public pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.notifyState({ isPlaying: false, isPaused: true, isLoading: false, error: null });
    }
  }

  public resume(): void {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play().then(() => {
        this.notifyState({ isPlaying: true, isPaused: false, isLoading: false, error: null });
      }).catch(e => {
        console.warn('Audio resume error:', e);
      });
    }
  }

  public stop(): void {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement = null;
      } catch (e) {
        // ignore
      }
      this.notifyState({ isPlaying: false, isPaused: false, isLoading: false, error: null });
    }
  }

  public setSpeed(speed: number): void {
    this.currentSpeed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
  }

  private notifyState(state: { isPlaying: boolean; isPaused: boolean; isLoading: boolean; error: string | null }) {
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }
}

export class TextToSpeechController extends CloudAudioPlayerController {}
