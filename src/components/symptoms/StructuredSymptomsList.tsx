import React from 'react';
import { Card, CardHeader, CardContent } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Stethoscope, Clock } from 'lucide-react';
import { StructuredSymptomItem } from '../../types/ai';
import { useTranslation } from '../../i18n/useTranslation';

interface StructuredSymptomsListProps {
  symptoms: StructuredSymptomItem[];
}

export const StructuredSymptomsList: React.FC<StructuredSymptomsListProps> = ({ symptoms }) => {
  const { t } = useTranslation();

  if (!symptoms || symptoms.length === 0) return null;

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader
        icon={<Stethoscope className="w-5 h-5 text-theme-primary" />}
        title={t.loggedSymptomsHistory || 'Logged Symptoms'}
        subtitle={t.symptomLogSubtitle || 'Identified symptoms, onset duration, and severity markers'}
      />
      <CardContent className="pt-2">
        <div className="divide-y divide-slate-100">
          {symptoms.map((sym, index) => (
            <div key={index} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-slate-900">{sym.name}</span>
                <StatusBadge 
                  variant={
                    sym.severity === 'Severe' || sym.severity === 'Critical' 
                      ? 'error' 
                      : sym.severity === 'Moderate' 
                      ? 'warning' 
                      : 'info'
                  }
                  size="sm"
                >
                  {sym.severity}
                </StatusBadge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                {sym.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{t.duration || 'Duration'}:</strong> {sym.duration}
                  </span>
                )}
                {sym.onset && (
                  <span>
                    <strong>{t.time || 'Onset'}:</strong> {sym.onset}
                  </span>
                )}
              </div>

              {sym.associatedSymptoms && sym.associatedSymptoms.length > 0 && (
                <div className="pt-1 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">{t.associatedSymptoms || 'Associated Symptoms'}: </span>
                  <span>{sym.associatedSymptoms.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
