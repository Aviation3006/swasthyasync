import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Sparkles, 
  BookmarkCheck, 
  ArrowLeft, 
  Stethoscope, 
  FileText, 
  Save, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { SpeechRecognitionButton } from '../../components/symptoms/SpeechRecognitionButton';
import { SymptomTranscriptEditor } from '../../components/symptoms/SymptomTranscriptEditor';
import { ClinicalOverviewCard } from '../../components/symptoms/ClinicalOverviewCard';
import { StructuredSymptomsList } from '../../components/symptoms/StructuredSymptomsList';
import { SuggestedQuestionsCard } from '../../components/symptoms/SuggestedQuestionsCard';
import { MissingInformationCard } from '../../components/symptoms/MissingInformationCard';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../i18n/useTranslation';
import { aiService } from '../../services/aiService';
import { symptomService } from '../../services/symptomService';
import { recordService } from '../../services/recordService';
import { patientService } from '../../services/patientService';
import { 
  SpeechRecognitionController, 
  isSpeechRecognitionSupported 
} from '../../utils/speechRecognition';
import { VoiceSymptomAnalysisOutput } from '../../types/ai';

export const VoiceSymptomDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const { t, language: appLanguage } = useTranslation();
  const navigate = useNavigate();
  const primaryPatient = patientService.getPatientForUser(user);

  // Selected Voice Language
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (appLanguage === 'mr') return 'mr-IN';
    if (appLanguage === 'hi') return 'hi-IN';
    return 'en-IN';
  });

  // Speech Recognition States
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');

  // Gemini Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceSymptomAnalysisOutput | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const controllerRef = useRef<SpeechRecognitionController | null>(null);

  useEffect(() => {
    const supported = isSpeechRecognitionSupported();
    setIsSupported(supported);
    if (supported) {
      controllerRef.current = new SpeechRecognitionController();
    }
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Update speech controller language if user toggles selector
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (isListening && controllerRef.current) {
      controllerRef.current.stop();
      setIsListening(false);
    }
  };

  const handleStartListening = () => {
    setErrorMessage(null);
    if (!controllerRef.current) {
      setErrorMessage('Speech recognition is unavailable on this device. Please type below.');
      return;
    }

    const started = controllerRef.current.start({
      language: selectedLanguage,
      onStart: () => {
        setIsListening(true);
      },
      onInterim: (interim) => {
        // Show interim text dynamically
        setTranscript((prev) => {
          // If previous was clean, append
          return prev ? `${prev} ${interim}` : interim;
        });
      },
      onResult: (finalText) => {
        setTranscript(finalText);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(err);
      }
    });

    if (!started && !errorMessage) {
      setErrorMessage('Could not initialize microphone. Please check permissions.');
    }
  };

  const handleStopListening = () => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
    setIsListening(false);
  };

  const handleClearTranscript = () => {
    setTranscript('');
    setAnalysisResult(null);
    setIsSaved(false);
    showInfo('Transcript Cleared', 'You can speak or type a new symptom description.');
  };

  const handleAnalyzeSymptoms = async () => {
    const clean = transcript.trim();
    if (!clean) {
      showError('Empty Transcript', 'Please speak or type your symptoms first.');
      return;
    }

    setIsAnalyzing(true);
    setIsSaved(false);

    try {
      const result = await aiService.analyzeVoiceTranscript({
        transcript: clean,
        language: selectedLanguage
      });
      setAnalysisResult(result);
      showSuccess('Analysis Complete', 'Gemini structured your symptom description.');
    } catch (err: any) {
      console.error(err);
      showError('Analysis Failed', err.message || 'Could not analyze symptoms.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToRecords = () => {
    if (!analysisResult) return;

    try {
      // 1. Save extracted symptoms to symptomService diary
      if (analysisResult.symptoms && analysisResult.symptoms.length > 0) {
        analysisResult.symptoms.forEach((s) => {
          symptomService.logSymptom({
            patientId: primaryPatient.id,
            bodyArea: 'General & Whole Body',
            symptomName: s.name,
            severity: s.severity === 'Severe' || s.severity === 'Critical' ? s.severity : 'Moderate',
            duration: s.duration !== 'Not mentioned' ? s.duration : 'Recent onset',
            startDate: new Date().toISOString().split('T')[0],
            triggersOrNotes: s.description || transcript,
            associatedSymptoms: s.associatedSymptoms || [],
            status: 'Active'
          });
        });
      }

      // 2. Add an ABDM clinical note to recordService
      recordService.addRecord({
        patientId: primaryPatient.id,
        recordType: 'Medical Visit',
        title: `Voice Symptom Note: ${analysisResult.symptoms[0]?.name || 'Clinical Summary'}`,
        hospitalName: 'SwasthyaSync Voice Health AI',
        hospitalId: 'facility-ai-voice',
        doctorName: 'Citizen Voice Assessment',
        doctorRegistrationNo: 'AI-PREP-2026',
        department: 'Outpatient Triage Preparation',
        date: new Date().toISOString().split('T')[0],
        summary: analysisResult.clinicalOverview,
        attachments: [],
        biomarkers: []
      });

      setIsSaved(true);
      showSuccess(
        'Saved to My Health Records',
        'Your structured voice symptom log has been saved to your health locker.'
      );
    } catch (err: any) {
      showError('Save Error', err.message || 'Could not save symptom record.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 min-w-0">
      {/* Page Header */}
      <PageHeader
        title="Voice Symptom Logger"
        subtitle="Describe how you're feeling naturally. We'll turn your description into an organized symptom summary."
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navSymptoms, path: '/patient/symptoms' },
          { label: 'Voice Logger' }
        ]}
        actions={
          <Link to="/patient/symptoms">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Diary
            </Button>
          </Link>
        }
      />

      {/* Safety Notice Ribbon */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-subtle min-w-0">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-amber-950">Informational Health Organization Tool</h4>
          <p className="text-amber-800 leading-relaxed">
            This voice assistant structures your notes for your doctor visit. It does not provide medical diagnoses or prescriptions. In emergencies, call <strong>108</strong>.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        
        {/* Left Column: Speak & Transcript Editor (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 min-w-0">
          {/* Section 1: Speak Your Symptoms */}
          <SpeechRecognitionButton
            isSupported={isSupported}
            isListening={isListening}
            errorMessage={errorMessage}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
          />

          {/* Section 2: Transcript Editor */}
          <SymptomTranscriptEditor
            transcript={transcript}
            isAnalyzing={isAnalyzing}
            onTranscriptChange={setTranscript}
            onClear={handleClearTranscript}
            onAnalyze={handleAnalyzeSymptoms}
          />
        </div>

        {/* Right Column: Structured AI Output & Records (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {analysisResult ? (
            <div className="space-y-6 animate-fade-in min-w-0">
              
              {/* Save To Records Action Header Bar */}
              <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-card border border-emerald-700 flex flex-col xs:flex-row xs:items-center justify-between gap-3 min-w-0">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span className="font-bold text-sm text-emerald-100">Structured AI Analysis Ready</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Verified for non-diagnostic clinical accuracy.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveToRecords}
                  disabled={isSaved}
                  leftIcon={isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4 text-slate-900" />}
                  className={
                    isSaved
                      ? 'bg-emerald-700 text-emerald-200 cursor-default'
                      : 'bg-white hover:bg-emerald-50 text-slate-950 font-black shadow-md'
                  }
                >
                  {isSaved ? 'Saved to Health Records' : 'Save to My Health Records'}
                </Button>
              </div>

              {/* 1. Clinical Overview */}
              <ClinicalOverviewCard
                overview={analysisResult.clinicalOverview}
                urgencyLevel={analysisResult.urgencyLevel}
                disclaimer={analysisResult.disclaimer}
              />

              {/* 2. Logged Symptoms */}
              <StructuredSymptomsList symptoms={analysisResult.symptoms} />

              {/* 3. Questions to Ask Doctor */}
              <SuggestedQuestionsCard questions={analysisResult.suggestedQuestions} />

              {/* 4. Missing Information */}
              <MissingInformationCard missingInformation={analysisResult.missingInformation} />
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center space-y-4 text-slate-500 shadow-subtle min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-base font-bold text-slate-800">No Symptoms Analyzed Yet</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tap the microphone on the left or type your symptoms, then click <strong>"Analyze Symptoms"</strong> to generate an organized summary.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
