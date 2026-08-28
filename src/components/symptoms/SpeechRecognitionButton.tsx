import React from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface SpeechRecognitionButtonProps {
  isSupported: boolean;
  isListening: boolean;
  errorMessage: string | null;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  className?: string;
}

export const SpeechRecognitionButton: React.FC<SpeechRecognitionButtonProps> = ({
  isSupported,
  isListening,
  errorMessage,
  selectedLanguage,
  onLanguageChange,
  onStartListening,
  onStopListening,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 text-center space-y-4 ${className}`}>
      
      {/* Voice Language Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-600">{t.voiceLanguage || 'Voice Language'}:</span>
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-theme-ring"
        >
          <option value="en-IN">English (India)</option>
          <option value="hi-IN">हिन्दी (Hindi)</option>
          <option value="mr-IN">मराठी (Marathi)</option>
          <option value="bn-IN">বাংলা (Bengali)</option>
          <option value="te-IN">తెలుగు (Telugu)</option>
          <option value="ta-IN">தமிழ் (Tamil)</option>
          <option value="gu-IN">ગુજરાતી (Gujarati)</option>
          <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
          <option value="ml-IN">മലയാളം (Malayalam)</option>
          <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
          <option value="ur-IN">اُردُو (Urdu)</option>
        </select>
      </div>

      <div className="relative">
        {/* Pulsing ring animation when active */}
        {isListening && (
          <span className="absolute -inset-2.5 rounded-full bg-rose-500/20 animate-ping" />
        )}
        <button
          onClick={isListening ? onStopListening : onStartListening}
          disabled={!isSupported}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-lg focus:outline-none focus:ring-4 ${
            isListening 
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30 focus:ring-rose-200' 
              : 'bg-theme-primary hover:bg-theme-primary-hover shadow-theme-primary/30 focus:ring-theme-primary-light'
          } ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
          aria-label={isListening ? (t.cancel || "Stop Listening") : (t.voiceLanguage || "Start Speaking")}
        >
          {isListening ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800">
          {isListening ? (t.voiceLanguage || 'Listening to your voice...') : (t.voiceLanguage || 'Tap Microphone to Speak')}
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {isListening 
            ? (t.cancel || 'Tap the red button when you are finished speaking.') 
            : (t.symptomCheckerSubtitle || 'Speak clearly in your preferred language to describe your symptoms.')}
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
