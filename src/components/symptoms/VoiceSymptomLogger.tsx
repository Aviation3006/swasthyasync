import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { 
  SpeechRecognitionController, 
  isSpeechRecognitionSupported, 
  SPEECH_REC_LOCALE_MAP 
} from '../../utils/speechRecognition';
import { Language } from '../../types/common';
import { useTranslation } from '../../i18n/useTranslation';

interface VoiceSymptomLoggerProps {
  onConfirmTranscription: (text: string) => void;
  defaultLanguage?: Language;
  className?: string;
}

export const VoiceSymptomLogger: React.FC<VoiceSymptomLoggerProps> = ({
  onConfirmTranscription,
  defaultLanguage = 'en',
  className = ''
}) => {
  const { t, language: appLanguage } = useTranslation();

  const [selectedLang, setSelectedLang] = useState<string>(() => {
    if (defaultLanguage === 'mr' || appLanguage === 'mr') return 'mr-IN';
    if (defaultLanguage === 'hi' || appLanguage === 'hi') return 'hi-IN';
    return 'en-IN';
  });

  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const controllerRef = useRef<SpeechRecognitionController | null>(null);

  useEffect(() => {
    const supported = isSpeechRecognitionSupported();
    setIsSupported(supported);
    if (supported) {
      controllerRef.current = new SpeechRecognitionController();
    }
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Sync selected voice language if app language changes
  useEffect(() => {
    if (appLanguage === 'mr') setSelectedLang('mr-IN');
    else if (appLanguage === 'hi') setSelectedLang('hi-IN');
    else setSelectedLang('en-IN');
  }, [appLanguage]);

  const handleStartListening = () => {
    setErrorMessage(null);
    setLiveTranscript('');
    setFinalTranscript('');

    if (!controllerRef.current) return;

    const started = controllerRef.current.start({
      language: selectedLang,
      onStart: () => {
        setIsListening(true);
      },
      onInterim: (interim) => {
        setLiveTranscript(interim);
      },
      onResult: (finalText) => {
        setFinalTranscript(finalText);
        setLiveTranscript('');
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(err);
      }
    });

    if (!started && !errorMessage) {
      setErrorMessage('Could not initiate speech recognition.');
    }
  };

  const handleStopListening = () => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
    setIsListening(false);
  };

  const handleConfirm = () => {
    const textToUse = (finalTranscript || liveTranscript).trim();
    if (!textToUse) return;
    onConfirmTranscription(textToUse);
    setFinalTranscript('');
    setLiveTranscript('');
  };

  const activeDisplayTranscript = finalTranscript || liveTranscript;

  const recognitionLanguages = [
    { code: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr-IN', label: 'मराठी', flag: '🇮🇳' }
  ];

  return (
    <div 
      className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border-2 border-emerald-500/40 shadow-xl space-y-4 ${className}`}
      role="region"
      aria-label="Voice Symptom Logger"
    >
      {/* Header & Voice Language Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
              <span>Voice Symptom Logger</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-600/40">
                Speech-to-Text
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Speak your symptoms in your preferred language to record them instantly
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 w-full sm:w-auto justify-center">
          {recognitionLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              disabled={isListening}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLang === lang.code
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 disabled:opacity-50'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Speech Area */}
      {!isSupported ? (
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Voice recognition not supported</span>
            <span>Your current browser does not support the Web Speech API. You can still type your symptoms manually in the form below.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          
          {/* Status & Microphone CTA */}
          <div className="flex flex-col xs:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            
            <div className="flex items-center gap-3">
              {!isListening ? (
                <button
                  type="button"
                  onClick={handleStartListening}
                  className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer transition-transform active:scale-95 shrink-0"
                  aria-label="Start recording symptoms"
                  title="Click to speak symptoms"
                >
                  <Mic className="w-6 h-6" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopListening}
                  className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 cursor-pointer animate-pulse shrink-0 ring-4 ring-rose-500/40"
                  aria-label="Stop recording"
                  title="Click to stop listening"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              )}

              <div>
                <span className="text-xs font-bold text-white block">
                  {isListening ? 'Listening... Speak clearly now' : activeDisplayTranscript ? 'Transcription Ready' : 'Tap microphone to speak symptoms'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isListening 
                    ? `Active input language: ${recognitionLanguages.find(l => l.code === selectedLang)?.label}` 
                    : activeDisplayTranscript 
                    ? 'Review, edit or confirm the spoken description below'
                    : 'Example: "I have had a headache since yesterday and I feel dizzy"'}
                </span>
              </div>
            </div>

            {/* Listening Control Actions */}
            {isListening && (
              <button
                type="button"
                onClick={handleStopListening}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Done Speaking</span>
              </button>
            )}
          </div>

          {/* Real-Time Waveform while listening */}
          {isListening && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.45s]" />
                <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="ml-2 font-semibold">Capturing voice input...</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400/80 uppercase">{selectedLang}</span>
            </div>
          )}

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Transcribed Text Area & Confirmation Toolbar */}
          {activeDisplayTranscript && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Transcribed Patient Speech
                </span>
                <span className="text-[10px] text-slate-400">Review & Confirm</span>
              </div>

              {/* Editable Text Area for Transcription */}
              <textarea
                value={finalTranscript || liveTranscript}
                onChange={(e) => setFinalTranscript(e.target.value)}
                rows={2}
                placeholder="Transcribed symptoms will appear here..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600 resize-none leading-relaxed"
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleStartListening}
                  className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Speak Again</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-emerald-950 font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Use in Symptom Log →</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
