import React from 'react';
import { Mic, Square, AlertCircle, Volume2, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface SpeechRecognitionButtonProps {
  isSupported: boolean;
  isListening: boolean;
  isProcessing?: boolean;
  errorMessage?: string | null;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const SpeechRecognitionButton: React.FC<SpeechRecognitionButtonProps> = ({
  isSupported,
  isListening,
  isProcessing = false,
  errorMessage,
  selectedLanguage,
  onLanguageChange,
  onStartListening,
  onStopListening
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-card space-y-5 min-w-0">
      {/* Header & Language Selector */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Voice Speech Recognition
          </span>
        </div>

        {/* Multi-Language Selector */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 self-start xs:self-auto">
          {[
            { code: 'en-IN', label: 'English (India)' },
            { code: 'hi-IN', label: 'हिन्दी' },
            { code: 'mr-IN', label: 'मराठी' }
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange(lang.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Microphone Action Area */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
        {/* Large Prominent Mic Button */}
        {isListening ? (
          <button
            type="button"
            onClick={onStopListening}
            aria-label="Stop Speaking"
            className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-900/50 transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-500/40"
          >
            {/* Animated Pulsing Wave Rings */}
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-30" />
            <span className="absolute -inset-2 rounded-full border-2 border-rose-400/60 animate-pulse" />
            <Square className="w-8 h-8 sm:w-10 sm:h-10 fill-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onStartListening}
            aria-label="Start Speaking"
            className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-900/50 transition-all transform active:scale-95 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/40"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-400/20 group-hover:scale-110 transition-transform" />
            <Mic className="w-9 h-9 sm:w-11 sm:h-11 group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* State Label & Guidance */}
        <div className="space-y-1 max-w-md mx-auto">
          {isListening ? (
            <>
              <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-base sm:text-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                Listening to your voice...
              </div>
              <p className="text-xs text-slate-300">
                Tap the red button when you are finished speaking.
              </p>
            </>
          ) : isProcessing ? (
            <>
              <div className="text-emerald-400 font-bold text-base sm:text-lg animate-pulse">
                Transcribing your speech...
              </div>
              <p className="text-xs text-slate-400">Formatting spoken words into transcript...</p>
            </>
          ) : (
            <>
              <div className="text-white font-bold text-base sm:text-lg">
                Tap to describe your symptoms
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Speak naturally — for example: <em>"I have had a headache since yesterday and I've also been feeling dizzy."</em>
              </p>
            </>
          )}
        </div>

        {/* Audio Waveform Graphic when listening */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 h-6">
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-5 [animation-delay:0.15s]" />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-6 [animation-delay:0.3s]" />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 [animation-delay:0.45s]" />
            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2 [animation-delay:0.6s]" />
          </div>
        )}
      </div>

      {/* Unsupported or Error Notice */}
      {!isSupported && (
        <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-800 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold leading-relaxed">
              Voice input isn't supported on this device. You can type your symptoms below.
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Microphone Note</p>
            <p className="text-rose-300 leading-relaxed">{errorMessage}</p>
            <p className="text-[11px] text-rose-400/80 pt-1">
              You can continue by typing your symptoms manually in the text area below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
