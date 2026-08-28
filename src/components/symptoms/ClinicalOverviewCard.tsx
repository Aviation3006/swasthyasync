import React from 'react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { AlertCircle, Activity, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface ClinicalOverviewCardProps {
  overview: string;
  urgencyLevel: 'Routine' | 'Prompt Attention' | 'Emergency 108';
  disclaimer: string;
}

export const ClinicalOverviewCard: React.FC<ClinicalOverviewCardProps> = ({
  overview,
  urgencyLevel,
  disclaimer,
}) => {
  const { t } = useTranslation();

  if (!overview) return null;

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader
        icon={<Activity className="w-5 h-5 text-theme-primary" />}
        title={t.clinicalOverview || 'Clinical Overview'}
        subtitle={t.plainLanguageExplanation || 'Objective structured summary of reported sensations'}
      />
      <CardContent className="space-y-4 pt-2">
        {urgencyLevel === 'Emergency 108' && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">{t.urgent || 'Urgent Medical Notice'}</span>
              <span>
                {t.consultPhysicianNotice || 'Your description contains potentially serious symptoms. Please consult a doctor immediately or dial 108.'}
              </span>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-theme-primary mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.extractedSummaryBadge || 'Structured Clinical Summary'}</span>
          </div>
          <p className="whitespace-pre-line">{overview}</p>
        </div>

        {disclaimer && (
          <p className="text-[11px] text-slate-400 italic">
            {disclaimer}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
