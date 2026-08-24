import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { recordService } from '../../services/recordService';
import { patientService } from '../../services/patientService';
import { aiService } from '../../services/aiService';
import { SimplifiedReport, BiomarkerResult } from '../../types/records';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileCheck2, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Languages, 
  ArrowRight, 
  RotateCcw,
  Printer,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Columns,
  Maximize2,
  BookmarkPlus,
  Save,
  Check,
  Building2,
  User,
  Calendar,
  Layers,
  Eye,
  FileBadge
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTranslation } from '../../i18n/useTranslation';
import { ReportAudioPlayer } from '../../components/common/ReportAudioPlayer';

export const PatientReports: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToast();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const patient = patientService.getPatientForUser(user);

  const isDemoAccount = user?.email === 'patient.test@swasthasync.com';
  const [reports, setReports] = useState<SimplifiedReport[]>(() => isDemoAccount ? reportService.getAllReports() : []);
  const [activeReport, setActiveReport] = useState<SimplifiedReport | null>(() => isDemoAccount ? (reportService.getAllReports()[0] || null) : null);
  const [isSampleReport, setIsSampleReport] = useState<boolean>(false);

  // Upload & processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type?: string } | null>(null);
  const [isRealAi, setIsRealAi] = useState<boolean>(false);

  // View Layout Mode: 'side-by-side' | 'original' | 'summary'
  const [viewMode, setViewMode] = useState<'side-by-side' | 'original' | 'summary'>('side-by-side');

  // Digital Record Saving State
  const [savedRecords, setSavedRecords] = useState<{ [reportId: string]: boolean }>({});
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [isDismissedSavePrompt, setIsDismissedSavePrompt] = useState(false);

  // Local report language toggle
  const [reportLang, setReportLang] = useState<'en' | 'mr'>(language === 'mr' ? 'mr' : 'en');

  useEffect(() => {
    if (language === 'mr') {
      setReportLang('mr');
    }
  }, [language]);

  useEffect(() => {
    const unsub = reportService.subscribe((list) => {
      setReports(list);
    });
    return unsub;
  }, []);

  const samplePresets = [
    { 
      name: 'Comprehensive_Glycemic_Lipid_Panel_Aug2026.pdf', 
      size: '1.4 MB', 
      type: 'Diabetes & Lipids',
      labName: 'National Diagnostics & Clinical Biochemistry Laboratory'
    },
    { 
      name: 'Complete_Blood_Count_Hemogram_Report.pdf', 
      size: '920 KB', 
      type: 'Hematology (CBC)',
      labName: 'Apex Diagnostic Pathology Services'
    },
    { 
      name: 'Liver_Function_Test_LFT_Panel.pdf', 
      size: '780 KB', 
      type: 'Liver Profile',
      labName: 'Metropolis Healthcare & Clinical Reference Lab'
    }
  ];

  const handleProcessFile = async (fileObj: File | { name: string; size: string; base64?: string; type?: string; labName?: string }, isSample = false) => {
    setIsSampleReport(isSample);
    setSelectedFile({ 
      name: fileObj.name, 
      size: fileObj.size ? `${fileObj.size}` : '1.2 MB',
      type: fileObj.type || 'application/pdf'
    });
    setIsProcessing(true);
    setProgressPercent(20);
    setProcessingStage(t.aiAnalyzingDocument || 'Analyzing medical document...');
    setIsDismissedSavePrompt(false);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setProgressPercent(60);
      setProcessingStage('Consulting Gemini AI clinical translation model...');

      const result = await aiService.simplifyDocument(fileObj);
      setProgressPercent(90);
      setProcessingStage('Synthesizing plain-language summary & doctor questions...');

      await new Promise((r) => setTimeout(r, 300));
      setProgressPercent(100);

      const newReport: SimplifiedReport = {
        id: `simp-rep-${Date.now()}`,
        title: result.title,
        testCategory: result.testCategory,
        reportDate: result.reportDate,
        overallSummary: result.overallSummary,
        overallSummaryMarathi: result.overallSummaryMarathi,
        keyFindings: result.keyFindings,
        biomarkers: result.biomarkers as BiomarkerResult[],
        recommendedDoctorQuestions: result.recommendedDoctorQuestions,
        disclaimer: result.disclaimer
      };

      setActiveReport(newReport);
      setIsRealAi(result.isRealAiResponse);
      setIsProcessing(false);

      if (result.isRealAiResponse) {
        showSuccess('AI Analysis Complete', `Report parsed via Google Gemini API.`);
      } else {
        showInfo('Analysis Generated', isSample ? 'Sample hospital demonstration report analyzed.' : 'Document processed using clinical templates.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      showError('Processing Error', err.message || 'Could not parse document.');
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showError('File Too Large', 'Please select a file smaller than 10 MB.');
        return;
      }
      handleProcessFile(file);
    }
  };

  const handleSaveToMedicalRecords = () => {
    if (!activeReport) return;
    setIsSavingRecord(true);

    try {
      const newRec = recordService.addRecord({
        patientId: patient.id || user?.id || 'pat-01',
        recordType: 'Lab Report',
        title: activeReport.title,
        date: activeReport.reportDate || new Date().toISOString().split('T')[0],
        hospitalId: 'fac-diag-01',
        hospitalName: activeReport.testCategory || 'Clinical Diagnostic Services',
        department: 'Diagnostic Pathology & Laboratory',
        doctorName: 'Dr. Diagnostic Pathologist',
        doctorRegistrationNo: 'MCI-LAB-9921',
        summary: activeReport.overallSummary,
        biomarkers: activeReport.biomarkers,
        findings: activeReport.keyFindings.map(k => `${k.title}: ${k.explanation}`).join('\n'),
        attachments: selectedFile ? [
          {
            name: selectedFile.name,
            type: selectedFile.name.endsWith('.pdf') ? 'pdf' : 'image',
            size: selectedFile.size
          }
        ] : []
      });

      setSavedRecords(prev => ({ ...prev, [activeReport.id]: true }));
      setIsSavingRecord(false);
      showSuccess('Saved to Medical Records', 'This report has been saved to your digital health locker.');
    } catch (e) {
      setIsSavingRecord(false);
      showError('Save Error', 'Could not save record to digital locker.');
    }
  };

  const isCurrentReportSaved = activeReport ? !!savedRecords[activeReport.id] : false;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.recordExplainerTitle}
        subtitle={t.recordExplainerDesc}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navReports }
        ]}
      />

      {/* Upload & Sample Selector */}
      <Card>
        <CardHeader
          title={t.uploadNewRecord}
          subtitle="Supports PDF, JPEG, PNG lab test documents"
          icon={<UploadCloud className="w-5 h-5 text-health-600" />}
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom file drag/drop dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-health-500 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/60 hover:bg-slate-50 transition-colors">
              <UploadCloud className="w-10 h-10 text-health-600 mb-2" />
              <p className="text-sm font-semibold text-slate-800">{t.uploadNewRecord}</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Select PDF, JPG or PNG (Max 10MB)</p>
              
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-health-700 hover:bg-health-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-block">
                  {t.uploadNewRecord}
                </span>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-700 block">
                {t.orTrySampleReports}
              </span>
              {samplePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleProcessFile({ name: preset.name, size: preset.size, type: 'application/pdf', labName: preset.labName }, true)}
                  className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-health-50/70 hover:border-health-300 cursor-pointer transition-all flex items-center justify-between group shadow-subtle"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-health-50 text-health-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</h4>
                      <p className="text-[10px] text-slate-500">{preset.type} • {preset.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-health-700">
                    {t.view} →
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="mt-6 p-4 rounded-xl bg-health-50 border border-health-200 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-health-900">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-health-600 animate-spin" />
                  {processingStage}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-health-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-health-700 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clean Empty State when no report is selected */}
      {!activeReport && !isProcessing && (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">{t.noReportAnalyzedYet}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {t.noReportAnalyzedDesc}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Active Analyzed Report Presentation */}
      {activeReport && !isProcessing && (
        <div className="space-y-6">
          {/* Sample dataset banner if demo */}
          {isSampleReport && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><strong>{t.sampleDatasetBadge}:</strong> {t.sampleHospitalDemoNotice}</span>
            </div>
          )}

          {/* Top Report Toolbar & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{activeReport.title}</h2>
                {isRealAi ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> {t.geminiVerified}
                  </span>
                ) : isSampleReport ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    {t.sampleDatasetBadge}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                    {t.extractedSummaryBadge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeReport.testCategory} • {t.date}: {activeReport.reportDate}
              </p>
            </div>

            {/* View Layout Mode & Action Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Layout Switcher (Side-by-Side vs Focused) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === 'side-by-side' ? 'bg-white text-health-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View Report and Summary Side by Side"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Side by Side</span>
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === 'original' ? 'bg-white text-health-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View Original Lab Report Only"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Original Report</span>
                </button>
                <button
                  onClick={() => setViewMode('summary')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewMode === 'summary' ? 'bg-white text-health-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="View AI Simplifier Summary Only"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Summary</span>
                </button>
              </div>

              {/* Language toggle for summary */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setReportLang('en')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    reportLang === 'en' ? 'bg-white text-health-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setReportLang('mr')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    reportLang === 'mr' ? 'bg-white text-health-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मराठी
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                {t.print}
              </Button>
            </div>
          </div>

          {/* DIGITAL RECORD SAVING PROMPT (OPTIONAL BUT RECOMMENDED) */}
          {!isCurrentReportSaved && !isDismissedSavePrompt && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-health-900 to-navy-950 text-white border-2 border-emerald-500/50 shadow-elevated animate-scale-up flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-emerald-950">
                    Recommended
                  </span>
                  <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                    <BookmarkPlus className="w-5 h-5 text-emerald-400" />
                    Save this Report Digitally to your Medical Records Locker?
                  </h4>
                </div>
                <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
                  Saving this report is <strong>optional but recommended</strong>. Digitally saving attaches this laboratory document and AI summary to your longitudinal medical profile for doctor OPD visits and emergency triage.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto flex-shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Save className="w-4 h-4" />}
                  onClick={handleSaveToMedicalRecords}
                  isLoading={isSavingRecord}
                  className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold border-none shadow-md w-full md:w-auto"
                >
                  Save to My Digital Records (Recommended)
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setIsDismissedSavePrompt(true)}
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-xs"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          )}

          {/* SAVED CONFIRMATION BADGE */}
          {isCurrentReportSaved && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between flex-wrap gap-3 shadow-subtle">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Saved to Digital Health Records Locker</h4>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    This lab report and AI simplification are safely archived in your longitudinal medical profile.
                  </p>
                </div>
              </div>

              <Link to="/patient/records">
                <Button variant="outline" size="sm" className="bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-semibold text-xs">
                  View in Medical Records →
                </Button>
              </Link>
            </div>
          )}

          {/* SIDE-BY-SIDE MAIN VIEW */}
          <div className={`grid grid-cols-1 ${viewMode === 'side-by-side' ? 'lg:grid-cols-12 gap-6' : 'gap-6'}`}>
            
            {/* LEFT COLUMN: ORIGINAL LAB REPORT & PARAMETERS (Visible in 'side-by-side' or 'original') */}
            {(viewMode === 'side-by-side' || viewMode === 'original') && (
              <div className={`space-y-6 ${viewMode === 'side-by-side' ? 'lg:col-span-5' : 'w-full'}`}>
                <Card className="border-slate-300 shadow-md">
                  <CardHeader
                    title="Original Laboratory Test Document"
                    subtitle="Clinical diagnostics report & raw parameter table"
                    icon={<FileText className="w-5 h-5 text-slate-700" />}
                  />
                  <CardContent className="space-y-5">
                    {/* Simulated Formal Lab Header */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnostic Testing Facility</span>
                          <h4 className="text-xs font-bold text-slate-900">
                            {selectedFile?.name.includes('Metropolis') ? 'Metropolis Clinical Reference Lab' : 'National Diagnostics & Clinical Biochemistry Laboratory'}
                          </h4>
                          <p className="text-[10px] text-slate-500">ISO 15189 Certified • Lab Accr #NABL-2026-9081</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            ID: LAB-{activeReport.id.substring(activeReport.id.length - 6).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Patient metadata on report */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                        <div>Patient: <strong>{patient.name || user?.name || 'Citizen Patient'}</strong></div>
                        <div>Date: <strong>{activeReport.reportDate}</strong></div>
                        <div>Age/Gender: <strong>{patient.age > 0 ? `${patient.age} Y / ${patient.gender}` : 'Adult'}</strong></div>
                        <div>Specimen: <strong>Serum / Whole Blood</strong></div>
                      </div>

                      {/* File details info bar */}
                      {selectedFile && (
                        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Attached: <strong className="text-slate-700">{selectedFile.name}</strong></span>
                          <span>{selectedFile.size}</span>
                        </div>
                      )}
                    </div>

                    {/* Raw Observed Parameters Table */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                          Reported Test Parameters ({activeReport.biomarkers.length})
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">Lab Reference Standard</span>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-subtle">
                        <div className="overflow-x-auto w-full"><table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                          <thead className="bg-slate-100/80 text-slate-700 font-semibold">
                            <tr>
                              <th className="px-3 py-2.5">Investigation</th>
                              <th className="px-3 py-2.5">Result</th>
                              <th className="px-3 py-2.5">Reference Range</th>
                              <th className="px-3 py-2.5">Flag</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {activeReport.biomarkers.map((b, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-3 py-2.5 font-medium text-slate-900">
                                  {b.name}
                                </td>
                                <td className="px-3 py-2.5 font-bold font-mono text-slate-800">
                                  {b.value} <span className="text-[10px] text-slate-500 font-normal">{b.unit}</span>
                                </td>
                                <td className="px-3 py-2.5 text-slate-500 font-mono text-[11px]">{b.referenceRange}</td>
                                <td className="px-3 py-2.5">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                    b.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : b.status === 'High' ? 'bg-amber-100 text-amber-800 font-black' : 'bg-rose-100 text-rose-800 font-black'
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table></div>
                      </div>
                    </div>

                    {/* Laboratory Signature & Disclaimer */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-700">
                        <span>Verified by: Dr. V. K. Ramanathan, MD (Pathology)</span>
                        <span className="text-emerald-700">✓ Digitally Signed</span>
                      </div>
                      <p>Results relate only to the specimen tested. End of clinical laboratory report.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* RIGHT COLUMN: AI PLAIN-LANGUAGE SUMMARY & ACTIONABLE INSIGHTS (Visible in 'side-by-side' or 'summary') */}
            {(viewMode === 'side-by-side' || viewMode === 'summary') && (
              <div className={`space-y-6 ${viewMode === 'side-by-side' ? 'lg:col-span-7' : 'w-full'}`}>
                {/* Plain-Language Summary Box with Integrated Text-to-Speech Accessibility Player */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-health-900 to-navy-950 text-white shadow-elevated border border-health-800 space-y-3.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs tracking-wider uppercase">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" /> {t.plainLanguageExplanation}
                    </div>
                    <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full text-slate-300 font-medium">
                      AI Simplified Report
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-100 font-normal">
                    {reportLang === 'mr' ? activeReport.overallSummaryMarathi : activeReport.overallSummary}
                  </p>

                  {/* Accessible Multilingual Text-to-Speech Player */}
                  <ReportAudioPlayer
                    report={activeReport}
                    englishText={activeReport.overallSummary}
                    hindiText={activeReport.overallSummaryHindi || activeReport.overallSummary}
                    marathiText={activeReport.overallSummaryMarathi}
                    text={reportLang === 'mr' ? activeReport.overallSummaryMarathi : activeReport.overallSummary}
                    language={reportLang}
                    title={reportLang === 'mr' ? "सोप्या भाषेतील सारांश ऐका" : (t.audioExplanation || "Listen to Report Summary")}
                    className="mt-2"
                  />
                </div>

                {/* Key Findings Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {activeReport.keyFindings.map((finding, idx) => (
                    <Card key={idx} className="border-slate-200">
                      <div className="flex items-start justify-between gap-2 pb-2">
                        <h4 className="text-xs font-bold text-slate-900">{finding.title}</h4>
                        <StatusBadge
                          variant={finding.status === 'Good' ? 'success' : finding.status === 'Attention' ? 'warning' : 'error'}
                          size="sm"
                        >
                          {finding.status === 'Good' ? t.optimal : finding.status === 'Attention' ? t.warning : t.urgent}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {reportLang === 'mr' ? finding.explanationMarathi : finding.explanation}
                      </p>
                    </Card>
                  ))}
                </div>

                {/* Plain Language Biomarkers Table */}
                <Card>
                  <CardHeader
                    title={t.biomarkers}
                    subtitle="Plain-language clinical translation of each measured parameter"
                    icon={<FileCheck className="w-5 h-5 text-health-600" />}
                  />
                  <CardContent>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto w-full"><table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold">
                          <tr>
                            <th className="px-3 py-3">Parameter</th>
                            <th className="px-3 py-3">Value</th>
                            <th className="px-3 py-3">{t.status}</th>
                            <th className="px-3 py-3">{t.plainLanguageExplanation}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {activeReport.biomarkers.map((b, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70">
                              <td className="px-3 py-3 font-semibold text-slate-900">
                                {reportLang === 'mr' && b.nameMarathi ? b.nameMarathi : b.name}
                              </td>
                              <td className="px-3 py-3 font-bold text-slate-800">
                                {b.value} {b.unit}
                              </td>
                              <td className="px-3 py-3">
                                <StatusBadge
                                  variant={b.status === 'Normal' ? 'success' : b.status === 'High' ? 'warning' : 'error'}
                                  size="sm"
                                >
                                  {b.status === 'Normal' ? t.normal : b.status}
                                </StatusBadge>
                              </td>
                              <td className="px-3 py-3 text-slate-600 text-[11px] leading-relaxed">
                                {reportLang === 'mr' && b.plainExplanationMarathi
                                  ? b.plainExplanationMarathi
                                  : b.plainExplanation}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Questions to Ask Doctor */}
                <Card>
                  <CardHeader
                    title={t.questionsForDoctorTitle}
                    subtitle="Suggested discussion prompts for your upcoming doctor consultation"
                    icon={<HelpCircle className="w-5 h-5 text-health-600" />}
                  />
                  <CardContent>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {activeReport.recommendedDoctorQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-health-50/70 border border-health-100">
                          <span className="w-5 h-5 rounded-full bg-health-700 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Clinical Disclaimer Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-health-600" />
                    Clinical Safety & Educational Notice
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    {activeReport.disclaimer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
