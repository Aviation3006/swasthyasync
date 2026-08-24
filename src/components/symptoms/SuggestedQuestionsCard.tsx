import React from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

interface SuggestedQuestionsCardProps {
  questions: string[];
}

export const SuggestedQuestionsCard: React.FC<SuggestedQuestionsCardProps> = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <Card className="border-sky-200 bg-sky-50/40 shadow-card min-w-0">
      <CardHeader
        title="Questions You May Want to Ask Your Doctor"
        subtitle="Helpful questions generated based only on your reported symptoms"
        icon={<HelpCircle className="w-5 h-5 text-sky-600" />}
      />
      <CardContent>
        <ul className="space-y-2.5">
          {questions.map((q, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-white p-3 rounded-xl border border-sky-100 shadow-subtle leading-relaxed"
            >
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="break-words">{q}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
