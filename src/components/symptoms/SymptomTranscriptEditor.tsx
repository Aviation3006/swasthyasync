import React from 'react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Button } from '../common/Button';
import { Edit3, RotateCcw, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface SymptomTranscriptEditorProps {
  transcript: string;
  isAnalyzing: boolean;
  onTranscriptChange: (text: string) => void;
  onClear: () => void;
  onAnalyze: () => void;
}

export const SymptomTranscriptEditor: React.FC<SymptomTranscriptEditorProps> = ({
  transcript,
  isAnalyzing,
  onTranscriptChange,
  onClear,
  onAnalyze,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader
        icon={<Edit3 className="w-5 h-5 text-theme-primary" />}
        title={t.symptomCheckerTitle || 'Your Symptom Description'}
        subtitle={t.symptomCheckerSubtitle || 'Review and edit your spoken or typed description before analysis.'}
        action={
          transcript ? (
            <button
              onClick={onClear}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.cancel || 'Clear'}</span>
            </button>
          ) : undefined
        }
      />
      <CardContent className="space-y-4 pt-2">
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder={t.symptomCheckerSubtitle || "Describe what you're experiencing in your own words, including when it started and how severe it feels..."}
            rows={5}
            className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-theme-ring focus:border-theme-primary text-sm text-slate-800 leading-relaxed placeholder:text-slate-400 resize-y"
          />
          <div className="flex justify-between items-center text-xs text-slate-400 mt-1 px-1">
            <span>{(t as any).symptomNotesOptional || "Type or speak clearly"}</span>
            <span id="charCount">{transcript.length} characters</span>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            onClick={onAnalyze}
            disabled={!transcript.trim() || isAnalyzing}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="px-6 py-2.5 shadow-sm font-bold"
          >
            {isAnalyzing ? (t.aiAnalyzingSymptom || "Structuring Symptoms...") : (t.checkSymptomsNow || "Analyze Symptoms")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
