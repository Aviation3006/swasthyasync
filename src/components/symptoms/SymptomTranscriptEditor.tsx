import React from 'react';
import { FileText, Sparkles, Trash2, Edit3, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

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
  onAnalyze
}) => {
  const charCount = transcript.length;
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  const samplePrompts = [
    "I have had a headache since yesterday and I've also been feeling dizzy.",
    "Mild fever and persistent dry cough for the last 3 days with body pain.",
    "Sharp knee stiffness in the morning for 2 weeks, worsens when climbing stairs."
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 sm:p-6 space-y-4 min-w-0">
      {/* Title Bar */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-slate-100 pb-3 min-w-0">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-health-600 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Symptom Description</h3>
            <p className="text-xs text-slate-500">Review and edit your spoken or typed description before analysis.</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 self-start xs:self-auto font-mono shrink-0">
          {wordCount} words • {charCount} chars
        </div>
      </div>

      {/* Editable Large Textarea */}
      <div className="relative">
        <textarea
          rows={5}
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Your spoken symptoms will appear here. You can edit them before analysis..."
          className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-health-600 focus:ring-2 focus:ring-health-200 outline-none leading-relaxed transition-all resize-y min-h-[120px]"
        />
      </div>

      {/* Quick Example Prompt Chips */}
      {!transcript.trim() && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Or try an example description:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onTranscriptChange(prompt)}
                className="text-left text-xs bg-slate-50 hover:bg-health-50 text-slate-700 hover:text-health-800 border border-slate-200 hover:border-health-300 rounded-xl px-2.5 py-1.5 transition-all"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={!transcript.trim() || isAnalyzing}
          leftIcon={<Trash2 className="w-4 h-4" />}
          className="text-slate-600 hover:text-rose-600 hover:border-rose-300"
        >
          Clear
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onAnalyze}
          disabled={!transcript.trim() || isAnalyzing}
          isLoading={isAnalyzing}
          leftIcon={<Sparkles className="w-4 h-4 text-emerald-300" />}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md px-5"
        >
          {isAnalyzing ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
        </Button>
      </div>
    </div>
  );
};
