import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../common/Card';

interface ClinicalOverviewCardProps {
  overview: string;
  urgencyLevel: 'Routine' | 'Prompt Attention' | 'Emergency 108';
  disclaimer: string;
}

export const ClinicalOverviewCard: React.FC<ClinicalOverviewCardProps> = ({
  overview,
  urgencyLevel,
  disclaimer
}) => {
  const isEmergency = urgencyLevel === 'Emergency 108';
  const isPrompt = urgencyLevel === 'Prompt Attention';

  return (
    <Card className="border-health-200 bg-gradient-to-br from-white to-slate-50/50 shadow-card min-w-0">
      <CardHeader
        title="Clinical Overview"
        subtitle="Objective structured summary of reported sensations"
        icon={<Activity className="w-5 h-5 text-health-600" />}
        action={
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${
              isEmergency
                ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
                : isPrompt
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {isEmergency ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            Priority: {urgencyLevel}
          </span>
        }
      />
      <CardContent className="space-y-4">
        {/* Urgent Emergency Callout if detected */}
        {isEmergency && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-900 rounded-xl text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Urgent Medical Notice</p>
              <p className="leading-relaxed">
                Your description contains potentially serious symptoms. Please consult a doctor immediately or dial <strong>108 (National Ambulance Service)</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Overview Body */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
          {overview}
        </div>

        {/* Clinical Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-100">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{disclaimer}</p>
        </div>
      </CardContent>
    </Card>
  );
};
