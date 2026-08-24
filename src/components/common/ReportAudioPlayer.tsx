import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  AlertCircle,
  Globe,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  TextToSpeechController, 
  isSpeechSynthesisSupported, 
  getBestVoiceForLanguage, 
  TTSVoiceInfo,
  CORE_TTS_LANGUAGES
} from '../../utils/textToSpeech';
import { Language } from '../../types/common';
import { useTranslation } from '../../i18n/useTranslation';

interface ReportAudioPlayerProps {
  text: string;
  language?: Language;
  title?: string;
  className?: string;
}

export const ReportAudioPlayer: React.FC<ReportAudioPlayerProps> = ({
  text,
  language: initialLanguage,
  title,
  className = ''
}) => {
  const { t, language: appLanguage } = useTranslation();
  
  // Interactive Voice/Language selection (defaults to report/app language: en / mr / hi)
  const defaultLang: Language = (initialLanguage === 'mr' ? 'mr' : initialLanguage === 'hi' ? 'hi' : 'en');
  const [selectedTtsLang, setSelectedTtsLang] = useState<Language>(defaultLang);

  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [voiceInfo, setVoiceInfo] = useState<TTSVoiceInfo | null>(null);

  const ttsRef = useRef<TextToSpeechController | null>(null);

  // Sync selectedTtsLang if parent report language changes
  useEffect(() => {
    if (initialLanguage) {
      const valid: Language = initialLanguage === 'mr' ? 'mr' : initialLanguage === 'hi' ? 'hi' : 'en';
      setSelectedTtsLang(valid);
    }
  }, [initialLanguage]);

  useEffect(() => {
    const supported = isSpeechSynthesisSupported();
    setIsSupported(supported);

    if (supported) {
      const controller = new TextToSpeechController(({ isPlaying: playing, isPaused: paused }) => {
        setIsPlaying(playing);
        setIsPaused(paused);
      });
      ttsRef.current = controller;

      const updateVoice = () => {
        const best = getBestVoiceForLanguage(selectedTtsLang);
        setVoiceInfo(best);
      };

      updateVoice();

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = updateVoice;
      }
    }

    return () => {
      if (ttsRef.current) {
        ttsRef.current.stop();
      }
    };
  }, [selectedTtsLang]);

  // If text or selected language changes, stop active speech
  useEffect(() => {
    if (ttsRef.current) {
      ttsRef.current.stop();
    }
  }, [text, selectedTtsLang]);

  const handlePlay = () => {
    if (!ttsRef.current || !text) return;
    ttsRef.current.speak({
      text,
      language: selectedTtsLang,
      rate: speechRate,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      }
    });
  };

  const handlePause = () => {
    if (ttsRef.current) {
      ttsRef.current.pause();
    }
  };

  const handleResume = () => {
    if (ttsRef.current) {
      ttsRef.current.resume();
    }
  };

  const handleStop = () => {
    if (ttsRef.current) {
      ttsRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-400 flex items-center gap-2 ${className}`}>
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
        <span>Web Speech API is not available on this browser.</span>
      </div>
    );
  }

  return (
    <div 
      role="region" 
      aria-label="Medical Report Audio Reader"
      className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 text-white shadow-md transition-all space-y-3 ${className}`}
    >
      {/* 1. Top Bar: Header, Speaking State & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Header / Active Speaking Status */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isPlaying 
              ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50' 
              : isPaused
              ? 'bg-amber-500 text-amber-950'
              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
          }`}>
            {isPlaying ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : isPaused ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
                {title || (t as any).readAloud || 'Read Aloud'}
              </span>

              {/* Status Badge */}
              {isPlaying && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                  {(t as any).speakingStatus || 'Speaking...'}
                </span>
              )}

              {isPaused && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950">
                  {(t as any).pausedStatus || 'Paused'}
                </span>
              )}
            </div>

            {/* Detected / Active Voice Name */}
            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Voice:</span>
              <span className="text-emerald-400 font-semibold truncate max-w-[180px] sm:max-w-[240px]" title={voiceInfo?.displayName}>
                {voiceInfo?.displayName?.split('(')[0]?.trim() || 'System Default'}
              </span>
            </p>
          </div>
        </div>

        {/* Playback Controls & Speed */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700 text-[11px]">
            <button
              type="button"
              onClick={() => setSpeechRate(0.85)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                speechRate === 0.85 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Clear & Slower for Clarity"
            >
              0.85x
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(0.95)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                speechRate === 0.95 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standard Speed"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(1.15)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                speechRate === 1.15 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Brisk Speed"
            >
              1.15x
            </button>
          </div>

          {/* Action Buttons with Mobile-Friendly Touch Targets (>= 44px min tap area) */}
          <div className="flex items-center gap-1.5">
            {!isPlaying && !isPaused && (
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-emerald-950 font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                aria-label="Listen to Plain-Language Summary"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{(t as any).readAloud || 'Listen'}</span>
              </button>
            )}

            {isPlaying && (
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                aria-label="Pause Speech"
              >
                <Pause className="w-4 h-4" />
                <span className="hidden xs:inline">{(t as any).pauseReading || 'Pause'}</span>
              </button>
            )}

            {isPaused && (
              <button
                type="button"
                onClick={handleResume}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-emerald-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
                aria-label="Resume Speech"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{(t as any).resumeReading || 'Resume'}</span>
              </button>
            )}

            {(isPlaying || isPaused) && (
              <button
                type="button"
                onClick={handleStop}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                aria-label="Stop Speech"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{(t as any).stopReading || 'Stop'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. VISIBLE TTS LANGUAGE / VOICE SELECTOR (English India | हिन्दी | मराठी) */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Voice Language:</span>
        </div>

        {/* 3 Core Indian Voice Language Options */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 w-full xs:w-auto justify-center">
          {CORE_TTS_LANGUAGES.map((item) => {
            const isSelected = selectedTtsLang === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setSelectedTtsLang(item.code)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`Synthesize in ${item.label} (${item.locale})`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fallback / Voice Availability Notice */}
      {voiceInfo?.statusNotice && (
        <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/70 text-[11px] text-amber-200 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>{voiceInfo.statusNotice}</span>
        </div>
      )}

      {/* Audio Wave Visualizer while playing */}
      {isPlaying && (
        <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[10px] text-emerald-300">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.45s]" />
            <span className="w-1.5 h-4.5 bg-emerald-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="ml-1.5 font-medium">Synthesizing audio ({voiceInfo?.languageLabel})...</span>
          </div>
          <span className="font-mono text-emerald-400/80">{speechRate}x</span>
        </div>
      )}
    </div>
  );
};
