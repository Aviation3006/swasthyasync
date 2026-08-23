import React, { useState, useEffect } from 'react';
import { symptomService } from '../../services/symptomService';
import { patientService } from '../../services/patientService';
import { aiService } from '../../services/aiService';
import { SymptomEntry, BodyArea, SymptomSeverity } from '../../types/symptoms';
import { SymptomAnalysisOutput } from '../../types/ai';
import { useToast } from '../../context/ToastContext';
import { 
  Stethoscope, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Activity, 
  ShieldAlert,
  Info,
  ChevronRight,
  Sparkles,
  Edit3,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../i18n/useTranslation';
import { useAuth } from '../../context/AuthContext';

export const PatientSymptoms: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess, showInfo, showError } = useToast();
  const primaryPatient = patientService.getPatientForUser(user);

  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea>('Muscles & Joints');
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState<SymptomSeverity>('Mild');
  const [duration, setDuration] = useState('3 days');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [associatedTag, setAssociatedTag] = useState('');
  const [associatedList, setAssociatedList] = useState<string[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  // AI Analysis state
  const [analyzingSymptom, setAnalyzingSymptom] = useState<SymptomEntry | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<SymptomAnalysisOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Edit State
  const [editingSymptom, setEditingSymptom] = useState<SymptomEntry | null>(null);

  useEffect(() => {
    setSymptoms(symptomService.getSymptomsByPatient(primaryPatient.id));
    const unsub = symptomService.subscribe((list) => {
      setSymptoms(list.filter((s) => s.patientId === primaryPatient.id));
    });
    return unsub;
  }, [primaryPatient.id]);

  const bodyAreas: { name: BodyArea; label: string; icon: string; desc: string }[] = [
    { name: 'Head & Neck', label: t.headNeck, icon: '🧠', desc: 'Headache, vision, throat, dizziness' },
    { name: 'Chest & Respiratory', label: t.chestRespiratory, icon: '🫁', desc: 'Cough, wheezing, shortness of breath' },
    { name: 'Abdomen & Digestion', label: t.abdomenDigestion, icon: '🫄', desc: 'Stomach ache, nausea, acidity' },
    { name: 'Muscles & Joints', label: t.musclesJoints, icon: '🦴', desc: 'Joint pain, stiffness, muscle cramps' },
    { name: 'Skin & Allergies', label: t.skinAllergies, icon: '🩹', desc: 'Rashes, itching, swelling, hives' },
    { name: 'General & Whole Body', label: t.generalWholeBody, icon: '🌡️', desc: 'Fever, fatigue, weakness, chills' }
  ];

  const handleAddAssociated = () => {
    if (!associatedTag.trim()) return;
    if (!associatedList.includes(associatedTag.trim())) {
      setAssociatedList([...associatedList, associatedTag.trim()]);
    }
    setAssociatedTag('');
  };

  const handleRemoveAssociated = (tag: string) => {
    setAssociatedList(associatedList.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomName.trim()) {
      showInfo('Required Field', 'Please enter the name or description of your symptom.');
      return;
    }

    const newEntry = symptomService.logSymptom({
      patientId: primaryPatient.id,
      bodyArea: selectedBodyArea,
      symptomName: symptomName.trim(),
      severity,
      duration,
      startDate,
      triggersOrNotes: notes.trim() || undefined,
      associatedSymptoms: associatedList,
      status: 'Active'
    });

    // Reset form
    setSymptomName('');
    setNotes('');
    setAssociatedList([]);
    showSuccess('Symptom Logged', 'Your symptom entry has been saved to your health diary.');

    // Auto trigger AI review prompt for severe symptoms
    if (severity === 'Severe' || severity === 'Critical') {
      handleRequestAiAnalysis(newEntry);
    }
  };

  const handleRequestAiAnalysis = async (entry: SymptomEntry) => {
    setAnalyzingSymptom(entry);
    setIsAiLoading(true);
    try {
      const result = await aiService.analyzeSymptom({
        bodyArea: entry.bodyArea,
        symptomName: entry.symptomName,
        severity: entry.severity,
        duration: entry.duration,
        startDate: entry.startDate,
        associatedSymptoms: entry.associatedSymptoms,
        triggersOrNotes: entry.triggersOrNotes
      });
      setAiAnalysisResult(result);
    } catch (err: any) {
      showError('AI Review Error', err.message || 'Could not complete symptom review.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Improving' : currentStatus === 'Improving' ? 'Resolved' : 'Active';
    symptomService.updateSymptomStatus(id, nextStatus as any);
    showInfo('Status Updated', `Symptom status changed to ${nextStatus}.`);
  };

  const handleDelete = (id: string) => {
    symptomService.deleteSymptom(id);
    showInfo('Entry Deleted', 'The symptom record was removed.');
  };

  const handleSaveEdit = () => {
    if (!editingSymptom) return;
    symptomService.updateSymptomStatus(editingSymptom.id, editingSymptom.status);
    setEditingSymptom(null);
    showSuccess('Entry Updated', 'Symptom details were saved.');
  };

  const filteredList = symptoms.filter((s) => {
    if (filterSeverity === 'All') return true;
    return s.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.symptomCheckerTitle}
        subtitle={t.symptomCheckerSubtitle}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navSymptoms }
        ]}
      />

      {/* Strict Non-Diagnostic Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-subtle">
        <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">{t.disclaimerNotice ? t.triageAssessment : 'Important Clinical Safety Disclaimer'}</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            {t.emergencyWarning} {t.consultPhysicianNotice}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title={t.symptomLogTitle}
              subtitle={t.symptomLogSubtitle}
              icon={<Stethoscope className="w-5 h-5 text-health-600" />}
            />
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Body Area Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">
                    1. {t.selectBodyArea} <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {bodyAreas.map((area) => (
                      <button
                        key={area.name}
                        type="button"
                        onClick={() => setSelectedBodyArea(area.name)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedBodyArea === area.name
                            ? 'bg-health-50/80 border-health-500 ring-2 ring-health-400/30'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-lg block mb-1">{area.icon}</span>
                        <span className="text-xs font-bold text-slate-900 block">{area.label}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{area.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptom Name & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={t.symptomNameLabel} required>
                    <Input
                      placeholder="e.g. Throbbing front headache, knee stiffness..."
                      value={symptomName}
                      onChange={(e) => setSymptomName(e.target.value)}
                    />
                  </FormField>

                  <FormField label={t.severityLevelLabel} required>
                    <Select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      options={[
                        { value: 'Mild', label: `${t.low} (Mild)` },
                        { value: 'Moderate', label: `${t.moderate} (Moderate)` },
                        { value: 'Severe', label: `${t.high} (Severe)` },
                        { value: 'Critical', label: `${t.urgent} (Critical)` }
                      ]}
                    />
                  </FormField>
                </div>

                {/* Duration & Start Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={t.howLongExperiencingLabel} required>
                    <Select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      options={[
                        { value: 'Few hours', label: 'A few hours' },
                        { value: '1 day', label: '1 day' },
                        { value: '2-3 days', label: '2 to 3 days' },
                        { value: '1 week', label: 'About 1 week' },
                        { value: '2-3 weeks', label: '2 to 3 weeks' },
                        { value: '1 month+', label: '1 month or longer' }
                      ]}
                    />
                  </FormField>

                  <FormField label={t.date}>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Associated Symptoms Tags */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    {t.associatedSymptomsLabel}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Type a related symptom and click Add"
                      value={associatedTag}
                      onChange={(e) => setAssociatedTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAssociated();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddAssociated}>
                      {t.confirm}
                    </Button>
                  </div>

                  {associatedList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {associatedList.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-800 border border-slate-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveAssociated(tag)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes & Triggers */}
                <FormField label={t.additionalNotesLabel}>
                  <textarea
                    rows={3}
                    placeholder="e.g. Pain worsens when climbing stairs; improved after resting with hot water bag..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-health-600 focus:outline-none focus:ring-2 focus:ring-health-100"
                  />
                </FormField>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="submit" variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                    {t.logSymptomBtn}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History Log & Filter (1 span) */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={t.loggedSymptomsHistory}
              subtitle={`${symptoms.length} ${t.recorded}`}
              icon={<Activity className="w-5 h-5 text-health-600" />}
              action={
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg p-1 text-slate-600 bg-slate-50"
                >
                  <option value="All">{t.all}</option>
                  <option value="Mild">{t.low}</option>
                  <option value="Moderate">{t.moderate}</option>
                  <option value="Severe">{t.high}</option>
                </select>
              }
            />
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredList.length > 0 ? (
                  filteredList.map((symp) => (
                    <div
                      key={symp.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-subtle space-y-2 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          {symp.bodyArea}
                        </span>
                        <StatusBadge
                          variant={
                            symp.severity === 'Mild'
                              ? 'success'
                              : symp.severity === 'Moderate'
                              ? 'warning'
                              : 'error'
                          }
                          size="sm"
                        >
                          {symp.severity}
                        </StatusBadge>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{symp.symptomName}</h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{t.howLongExperiencingLabel}: {symp.duration} • {symp.startDate}</span>
                      </div>

                      {symp.triggersOrNotes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100 leading-relaxed">
                          {symp.triggersOrNotes}
                        </p>
                      )}

                      {symp.associatedSymptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {symp.associatedSymptoms.map((tTag, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              +{tTag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(symp.id, symp.status)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                            symp.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : symp.status === 'Improving'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {symp.status}
                        </button>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRequestAiAnalysis(symp)}
                            leftIcon={<Sparkles className="w-3 h-3 text-health-600" />}
                            className="text-xs text-health-700 py-0.5 px-2"
                          >
                            AI Review
                          </Button>

                          <button
                            type="button"
                            onClick={() => handleDelete(symp.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            aria-label="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    {t.noSymptomsLogged}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Symptom Review Modal */}
      {analyzingSymptom && (
        <Modal
          isOpen={!!analyzingSymptom}
          onClose={() => setAnalyzingSymptom(null)}
          title={`${t.triageAnalysisModal}: ${analyzingSymptom.symptomName}`}
          subtitle="Non-diagnostic pattern summary to assist with your next doctor consultation"
          maxWidth="lg"
          footer={
            <Button variant="outline" size="sm" onClick={() => setAnalyzingSymptom(null)}>
              {t.close}
            </Button>
          }
        >
          {isAiLoading ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-health-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-medium">{t.aiAnalyzingSymptom}</p>
            </div>
          ) : aiAnalysisResult ? (
            <div className="space-y-4 text-xs">
              {aiAnalysisResult.urgencyLevel === 'Emergency 108' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1 flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-600 animate-bounce flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">{t.emergencyWarning}</h5>
                    <p>{aiAnalysisResult.safetyAdvisory}</p>
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">{t.clinicalOverview}:</span>
                <p className="text-slate-800 leading-relaxed">{aiAnalysisResult.summary}</p>
              </div>

              {aiAnalysisResult.generalInsights.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-800 uppercase text-[10px]">{t.detailedFindings}:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
                    {aiAnalysisResult.generalInsights.map((insight: string, idx: number) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysisResult.doctorQuestions.length > 0 && (
                <div className="p-3 rounded-xl bg-health-50 border border-health-200 space-y-1.5">
                  <h5 className="font-bold text-health-900 uppercase text-[10px] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-health-700" />
                    {t.questionsForDoctor}:
                  </h5>
                  <ul className="list-disc pl-5 space-y-1 text-health-800">
                    {aiAnalysisResult.doctorQuestions.map((q: string, idx: number) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 text-[11px]">
                {t.consultPhysicianNotice}
              </div>
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  );
};
