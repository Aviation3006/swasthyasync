import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  AlertCircle,
  Globe,
  Loader2
} from 'lucide-react';
import { 
  CloudAudioPlayerController, 
  CLOUD_TTS_LANGUAGES, 
  TTSLanguageOption 
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
  const { t } = useTranslation();
  
  // Selected cloud TTS language code ('en-IN', 'hi-IN', 'mr-IN')
  const defaultOption: TTSLanguageOption = 
    initialLanguage === 'mr' ? CLOUD_TTS_LANGUAGES[2] : 
    initialLanguage === 'hi' ? CLOUD_TTS_LANGUAGES[1] : 
    CLOUD_TTS_LANGUAGES[0];

  const [selectedLanguage, setSelectedLanguage] = useState<TTSLanguageOption>(defaultOption);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  const playerRef = useRef<CloudAudioPlayerController | null>(null);

  // Sync selected TTS language when parent report language changes
  useEffect(() => {
    if (initialLanguage === 'mr') {
      setSelectedLanguage(CLOUD_TTS_LANGUAGES[2]);
    } else if (initialLanguage === 'hi') {
      setSelectedLanguage(CLOUD_TTS_LANGUAGES[1]);
    } else if (initialLanguage === 'en') {
      setSelectedLanguage(CLOUD_TTS_LANGUAGES[0]);
    }
  }, [initialLanguage]);

  useEffect(() => {
    const controller = new CloudAudioPlayerController(({ isPlaying: playing, isPaused: paused, isLoading: loading, error }) => {
      setIsPlaying(playing);
      setIsPaused(paused);
      setIsLoading(loading);
      if (error) {
        setErrorMessage(error);
      }
    });

    playerRef.current = controller;

    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, []);

  // Stop active speech when text or selected language changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
    setErrorMessage(null);
  }, [text, selectedLanguage]);

  const handlePlay = () => {
    setErrorMessage(null);
    if (!playerRef.current || !text) return;

    playerRef.current.playCloudSpeech({
      text,
      languageCode: selectedLanguage.languageCode,
      speed: speechRate,
      onError: (err) => {
        setErrorMessage(err);
      }
    });
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const handleResume = () => {
    if (playerRef.current) {
      playerRef.current.resume();
    }
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
  };

  const handleSpeedChange = (speed: number) => {
    setSpeechRate(speed);
    if (playerRef.current) {
      playerRef.current.setSpeed(speed);
    }
  };

  return (
    <div 
      role="region" 
      aria-label="Medical Report Cloud Audio Reader"
      className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 text-white shadow-md transition-all space-y-3 ${className}`}
    >
      {/* 1. Top Bar: Header, Cloud Voice Label & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Header / Active Status */}
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isPlaying 
              ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50' 
              : isPaused
              ? 'bg-amber-500 text-amber-950'
              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
          }`}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            ) : isPlaying ? (
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

              {/* Real-time Status Badges */}
              {isLoading && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-400 text-sky-950 animate-pulse">
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  Generating Cloud Voice...
                </span>
              )}

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

            {/* Cloud Voice Display Label */}
            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400">Voice:</span>
              <span className="text-emerald-400 font-semibold truncate max-w-[220px] sm:max-w-[280px]">
                {selectedLanguage.cloudVoiceName}
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
              onClick={() => handleSpeedChange(0.85)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                speechRate === 0.85 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Clear & Slower for Clarity"
            >
              0.85x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedChange(0.95)}
              className={`px-2 py-1 rounded-md font-bold transition-colors ${
                speechRate === 0.95 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standard Speed"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedChange(1.15)}
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
                disabled={isLoading}
                onClick={handlePlay}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:opacity-50 text-emerald-950 font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                aria-label="Listen to Plain-Language Summary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{(t as any).readAloud || 'Listen'}</span>
                  </>
                )}
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

      {/* 2. VISIBLE CLOUD TTS LANGUAGE SELECTOR (English India | हिन्दी | मराठी) */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
          <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Cloud Voice Language:</span>
        </div>

        {/* 3 Core Indian Voice Language Options */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700 w-full xs:w-auto justify-center">
          {CLOUD_TTS_LANGUAGES.map((item) => {
            const isSelected = selectedLanguage.code === item.code;
            return (
              <button
                key={item.code}
                type="button"
                disabled={isLoading}
                onClick={() => setSelectedLanguage(item)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 disabled:opacity-50'
                }`}
                title={`Synthesize with ${item.cloudVoiceName}`}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Error Banner if Cloud TTS is temporarily unavailable */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-[11px] text-rose-200 flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-100 block">Voice Generation Notice</span>
            <span>{errorMessage}</span>
          </div>
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
            <span className="ml-1.5 font-medium">Streaming Cloud Audio ({selectedLanguage.nativeLabel})...</span>
          </div>
          <span className="font-mono text-emerald-400/80">{speechRate}x</span>
        </div>
      )}
    </div>
  );
};
