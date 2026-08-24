import React from 'react';
import { Stethoscope, Clock, AlertCircle, Calendar, Tag } from 'lucide-react';
import { StructuredSymptomItem } from '../../types/ai';

interface StructuredSymptomsListProps {
  symptoms: StructuredSymptomItem[];
}

export const StructuredSymptomsList: React.FC<StructuredSymptomsListProps> = ({ symptoms }) => {
  if (!symptoms || symptoms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 min-w-0">
      <div className="flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-health-600" />
        <h3 className="text-base font-bold text-slate-900">Logged Symptoms ({symptoms.length})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {symptoms.map((item, idx) => {
          const isSeverityMentioned = item.severity && item.severity !== 'Not mentioned';
          const isDurationMentioned = item.duration && item.duration !== 'Not mentioned';
          const isOnsetMentioned = item.onset && item.onset !== 'Not mentioned';

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-card p-4 sm:p-5 space-y-3 min-w-0 hover:border-health-300 transition-all"
            >
              {/* Symptom Name & Severity Tag */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 min-w-0">
                <h4 className="text-base font-bold text-slate-900 break-words">{item.name}</h4>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                    isSeverityMentioned
                      ? item.severity === 'Severe' || item.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-health-100 text-health-800 border border-health-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {item.severity || 'Not mentioned'}
                </span>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {item.description}
                </p>
              )}

              {/* Grid of Key Properties */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Duration</span>
                  <span className={`font-semibold text-xs flex items-center gap-1 ${isDurationMentioned ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                    <Clock className="w-3 h-3" />
                    {item.duration || 'Not mentioned'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Onset</span>
                  <span className={`font-semibold text-xs flex items-center gap-1 ${isOnsetMentioned ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                    <Calendar className="w-3 h-3" />
                    {item.onset || 'Not mentioned'}
                  </span>
                </div>
              </div>

              {/* Associated Symptoms Tags */}
              {item.associatedSymptoms && item.associatedSymptoms.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Associated Symptoms
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.associatedSymptoms.map((assoc, aIdx) => (
                      <span
                        key={aIdx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {assoc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
