import { Language } from '../types/common';

/**
 * Standard BCP-47 Speech Recognition Locale Mapping
 */
export const SPEECH_REC_LOCALE_MAP: Record<string, string> = {
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
  as: 'as-IN'
};

export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

/**
 * Check if the browser supports SpeechRecognition (Web Speech API)
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Speech Recognition Controller using native Web Speech API
 */
export class SpeechRecognitionController {
  private recognition: any = null;
  private isListening = false;
  private activeLang = 'en-IN';

  constructor() {
    if (isSpeechRecognitionSupported()) {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  public getSupported(): boolean {
    return this.recognition !== null;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public start(params: {
    language?: string;
    onInterim?: (text: string) => void;
    onResult?: (finalText: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }): boolean {
    if (!this.recognition) {
      if (params.onError) {
        params.onError('Speech recognition is not supported on this browser.');
      }
      return false;
    }

    // If already listening, stop first
    if (this.isListening) {
      this.stop();
    }

    const langCode = params.language || 'en-IN';
    this.recognition.lang = SPEECH_REC_LOCALE_MAP[langCode] || langCode;
    this.activeLang = this.recognition.lang;

    let finalAccumulated = '';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (params.onStart) params.onStart();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const transcriptText = item[0]?.transcript || '';
        if (item.isFinal) {
          finalAccumulated += (finalAccumulated ? ' ' : '') + transcriptText.trim();
          if (params.onResult) {
            params.onResult(finalAccumulated);
          }
        } else {
          interim += transcriptText;
        }
      }

      if (params.onInterim) {
        params.onInterim(interim);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      this.isListening = false;
      let userFriendlyMsg = 'Microphone or speech input encountered an issue.';
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        userFriendlyMsg = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        userFriendlyMsg = 'No speech was detected. Please try speaking again.';
      } else if (event.error === 'network') {
        userFriendlyMsg = 'Network issue with speech recognition service.';
      }

      if (params.onError) {
        params.onError(userFriendlyMsg);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (params.onEnd) params.onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('SpeechRecognition start failed:', e);
      if (params.onError) {
        params.onError(e.message || 'Could not start speech recognition.');
      }
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}
