import { Language } from '../types/common';

/**
 * Standard BCP-47 Speech Recognition Locale Mapping
 * Maps application locale keys to browser-compatible speech recognition tags.
 */
export const SPEECH_REC_LOCALE_MAP: Record<string, string> = {
  en: 'en-IN',
  'en-IN': 'en-IN',
  hi: 'hi-IN',
  'hi-IN': 'hi-IN',
  mr: 'mr-IN',
  'mr-IN': 'mr-IN',
  bn: 'bn-IN',
  'bn-IN': 'bn-IN',
  te: 'te-IN',
  'te-IN': 'te-IN',
  ta: 'ta-IN',
  'ta-IN': 'ta-IN',
  gu: 'gu-IN',
  'gu-IN': 'gu-IN',
  ur: 'ur-IN',
  'ur-IN': 'ur-IN',
  kn: 'kn-IN',
  'kn-IN': 'kn-IN',
  or: 'or-IN',
  'or-IN': 'or-IN',
  ml: 'ml-IN',
  'ml-IN': 'ml-IN',
  pa: 'pa-IN',
  'pa-IN': 'pa-IN',
  as: 'as-IN',
  'as-IN': 'as-IN'
};

/**
 * List of speech-recognition languages supported across modern Chromium browsers
 */
export const SUPPORTED_SPEECH_LANGUAGES = [
  { code: 'en-IN', label: 'English (India)', native: 'English (India)' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ur-IN', label: 'Urdu', native: 'اُردُو' }
];

export type SpeechControllerStatus = 'idle' | 'starting' | 'listening' | 'stopping';

export interface SpeechRecognitionStartParams {
  language?: string;
  onInterim?: (text: string) => void;
  onResult?: (finalText: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string, code?: string) => void;
}

/**
 * Check if the browser supports SpeechRecognition (Web Speech API)
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

function getSpeechRecognitionConstructor(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

/**
 * Resolve BCP-47 locale tag from app language or recognition language code
 */
export function resolveSpeechLocale(langCode: string): string {
  if (SPEECH_REC_LOCALE_MAP[langCode]) {
    return SPEECH_REC_LOCALE_MAP[langCode];
  }
  const prefix = langCode.split('-')[0].toLowerCase();
  if (SPEECH_REC_LOCALE_MAP[prefix]) {
    return SPEECH_REC_LOCALE_MAP[prefix];
  }
  return 'en-IN';
}

/**
 * Robust Speech Recognition Controller using native browser Web Speech API
 * Handles:
 * - Fresh instance creation per session (prevents Chromium state corruption)
 * - Start/stop debouncing & rapid-click race condition prevention
 * - Continuous recognition with real-time interim results
 * - Clean unmount / navigation abortion
 * - Permission and unsupported-browser error handling
 */
export class SpeechRecognitionController {
  private recognition: any = null;
  private status: SpeechControllerStatus = 'idle';
  private accumulatedFinalText = '';
  private currentParams: SpeechRecognitionStartParams | null = null;
  private startTimeoutId: any = null;

  public getStatus(): SpeechControllerStatus {
    return this.status;
  }

  public getIsListening(): boolean {
    return this.status === 'listening';
  }

  public getIsStarting(): boolean {
    return this.status === 'starting';
  }

  private clearStartingTimeout(): void {
    if (this.startTimeoutId) {
      clearTimeout(this.startTimeoutId);
      this.startTimeoutId = null;
    }
  }

  public start(params: SpeechRecognitionStartParams): boolean {
    // Prevent duplicate calls if already listening or starting
    if (this.status === 'listening' || this.status === 'starting') {
      return true;
    }

    const SpeechRecConstructor = getSpeechRecognitionConstructor();
    if (!SpeechRecConstructor) {
      this.status = 'idle';
      this.clearStartingTimeout();
      if (params.onError) {
        params.onError(
          'Speech recognition is not supported on this browser. Please use Chrome, Edge, or type manually.',
          'not-supported'
        );
      }
      return false;
    }

    // Cleanly abort any stale instance before creating a new one
    this.clearStartingTimeout();
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }

    this.currentParams = params;
    this.accumulatedFinalText = '';
    this.status = 'starting';

    // Start a 6-second watchdog timeout: if the browser never fires onstart or onerror, revert cleanly to idle
    this.startTimeoutId = setTimeout(() => {
      if (this.status === 'starting') {
        console.warn('[SpeechRecognition] Start connection timed out after 6s');
        this.status = 'idle';
        this.clearStartingTimeout();
        if (this.recognition) {
          try {
            this.recognition.abort();
          } catch (e) {
            // ignore
          }
          this.recognition = null;
        }
        if (this.currentParams?.onError) {
          this.currentParams.onError(
            'Microphone connection timed out. Please verify your browser microphone permissions and try clicking again.',
            'timeout'
          );
        }
      }
    }, 6000);

    try {
      const rec = new SpeechRecConstructor();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      const resolvedLocale = resolveSpeechLocale(params.language || 'en-IN');
      rec.lang = resolvedLocale;

      rec.onstart = () => {
        this.clearStartingTimeout();
        this.status = 'listening';
        if (this.currentParams?.onStart) {
          this.currentParams.onStart();
        }
      };

      rec.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcriptFragment = item[0]?.transcript || '';
          if (item.isFinal) {
            this.accumulatedFinalText = this.accumulatedFinalText
              ? `${this.accumulatedFinalText} ${transcriptFragment.trim()}`
              : transcriptFragment.trim();
          } else {
            interimText += transcriptFragment;
          }
        }

        if (this.accumulatedFinalText && this.currentParams?.onResult) {
          this.currentParams.onResult(this.accumulatedFinalText);
        }

        if (this.currentParams?.onInterim) {
          this.currentParams.onInterim(interimText);
        }
      };

      rec.onerror = (event: any) => {
        this.clearStartingTimeout();
        const errCode = event.error;
        console.warn('SpeechRecognition error event:', errCode, event.message);

        // Aborted event: handle differently if it was aborted while starting vs intentional stop
        if (errCode === 'aborted') {
          const wasStarting = this.status === 'starting';
          this.status = 'idle';
          if (wasStarting && this.currentParams?.onError) {
            this.currentParams.onError(
              'Microphone access was cancelled or interrupted. Click the microphone to try again.',
              'aborted'
            );
          }
          return;
        }

        let userFriendlyMsg = 'Microphone or speech input encountered an issue.';
        if (errCode === 'not-allowed' || errCode === 'permission-denied') {
          userFriendlyMsg = 'Microphone permission was denied. Please allow microphone access in your browser settings to speak.';
        } else if (errCode === 'no-speech') {
          userFriendlyMsg = 'No speech detected. Please speak clearly into your microphone.';
        } else if (errCode === 'audio-capture') {
          userFriendlyMsg = 'No microphone was found or microphone is in use by another application.';
        } else if (errCode === 'network') {
          userFriendlyMsg = 'Network connection issue with speech service. You can type your symptoms below.';
        } else if (errCode === 'language-not-supported') {
          userFriendlyMsg = 'The selected voice language is not supported by your browser engine. You can type your symptoms below.';
        }

        this.status = 'idle';
        if (this.currentParams?.onError) {
          this.currentParams.onError(userFriendlyMsg, errCode);
        }
      };

      rec.onend = () => {
        this.clearStartingTimeout();
        this.status = 'idle';
        if (this.currentParams?.onEnd) {
          this.currentParams.onEnd();
        }
      };

      this.recognition = rec;
      rec.start();
      return true;
    } catch (e: any) {
      console.warn('Failed to start SpeechRecognition:', e);
      this.clearStartingTimeout();
      this.status = 'idle';
      let msg = 'Could not initialize microphone. Please check permissions.';
      if (e.name === 'NotAllowedError') {
        msg = 'Microphone permission was denied. Please allow microphone access in browser settings.';
      } else if (e.name === 'InvalidStateError') {
        msg = 'Speech recognition service is reinitializing. Please tap again in a moment.';
      } else if (e.name === 'NotSupportedError') {
        msg = 'Speech recognition is not supported on this device. You can type symptoms below.';
      }
      if (params.onError) {
        params.onError(msg, e.name);
      }
      return false;
    }
  }

  public stop(): void {
    this.clearStartingTimeout();
    if (this.recognition && (this.status === 'listening' || this.status === 'starting')) {
      this.status = 'stopping';
      try {
        this.recognition.stop();
      } catch (e) {
        this.status = 'idle';
      }
    } else {
      this.status = 'idle';
    }
  }

  public abort(): void {
    this.clearStartingTimeout();
    this.status = 'idle';
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
    this.currentParams = null;
  }
}
