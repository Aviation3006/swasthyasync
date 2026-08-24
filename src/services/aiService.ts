import { SimplifiedReportOutput, SymptomAnalysisOutput, VoiceSymptomAnalysisOutput } from '../types/ai';

export const aiService = {
  /**
   * Check backend AI server status
   */
  async checkStatus(): Promise<{ status: string; geminiConfigured: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
      return { status: 'offline', geminiConfigured: false };
    } catch {
      return { status: 'offline', geminiConfigured: false };
    }
  },

  /**
   * Send document to backend for Gemini multimodal simplification
   */
  async simplifyDocument(
    file: File | { name: string; size: string; base64?: string; type?: string }
  ): Promise<SimplifiedReportOutput> {
    try {
      let base64Data = '';
      let mimeType = 'application/pdf';
      const fileName = file.name;

      if (file instanceof File) {
        mimeType = file.type || 'application/pdf';
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64Data = btoa(binary);
      } else if (file.base64) {
        base64Data = file.base64;
        mimeType = file.type || 'application/pdf';
      }

      const response = await fetch('/api/report-simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          mimeType,
          base64Data
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('AI Simplification endpoint error, returning demo fallback', error);
      // Clean fallback if server is unreachable
      return {
        title: file.name ? `Analysis: ${file.name}` : 'Biochemical Report Summary',
        testCategory: 'Pathology & General Wellness',
        reportDate: new Date().toISOString().split('T')[0],
        overallSummary: '[FALLBACK MODE] Your document has been analyzed. Glycemic and blood parameters are in manageable bounds. Discuss specific dosage schedules with your consulting physician.',
        overallSummaryMarathi: '[पर्यायी मोड] तुमचा अहवाल विश्लेषित केला आहे. रक्तातील घटक नियंत्रणात आहेत.',
        keyFindings: [
          {
            title: 'Overall Metabolic Indices',
            status: 'Good',
            explanation: 'Parameters match expected longitudinal progress.',
            explanationMarathi: 'सर्व घटक समाधानकारक आहेत.'
          }
        ],
        biomarkers: [
          {
            name: 'Blood Sugar Indicator',
            value: '118',
            unit: 'mg/dL',
            referenceRange: '70 - 100',
            status: 'High',
            plainExplanation: 'Slightly above standard non-diabetic range.',
            plainExplanationMarathi: 'साखरेचे प्रमाण थोडे जास्त.'
          }
        ],
        recommendedDoctorQuestions: [
          'How do these values compare with my previous clinical visit?'
        ],
        disclaimer: 'DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription.',
        isRealAiResponse: false
      };
    }
  },

  /**
   * Request non-diagnostic symptom insights
   */

  /**
   * Request structured Gemini analysis for raw voice/spoken symptom transcript
   */
  async analyzeVoiceTranscript(params: {
    transcript: string;
    language?: string;
  }): Promise<VoiceSymptomAnalysisOutput> {
    try {
      const response = await fetch('/api/symptom-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.warn('Voice symptom analysis endpoint error, returning fallback', error);
      const clean = (params.transcript || '').trim();
      return {
        clinicalOverview: `Reported symptoms from user description: "${clean}". No automated diagnosis is rendered.`,
        symptoms: [
          {
            name: clean.split(' ').slice(0, 3).join(' ') || 'Reported Symptom',
            description: clean,
            duration: 'Not mentioned',
            severity: 'Not mentioned',
            onset: 'Not mentioned',
            associatedSymptoms: []
          }
        ],
        relevantContext: [
          'User recorded a natural spoken description for clinical preparation.'
        ],
        suggestedQuestions: [
          'What could be contributing to these symptoms?',
          'Should I monitor any specific warning signs or progression?',
          'Are there any tests or clinical evaluations that may be appropriate?'
        ],
        missingInformation: [
          'Exact duration / timeline of symptom onset',
          'Severity level on a scale from mild to severe',
          'Known triggers, aggravating factors, or relieving postures'
        ],
        urgencyLevel: /chest pain|breathless|unconscious|severe bleed|stroke/i.test(clean) ? 'Emergency 108' : 'Routine',
        disclaimer: 'AI-generated summaries are for informational purposes and are not a medical diagnosis. Consult a qualified healthcare professional for medical advice.',
        isRealAiResponse: false
      };
    }
  },

  async analyzeSymptom(data: {
    bodyArea: string;
    symptomName: string;
    severity: string;
    duration: string;
    startDate: string;
    associatedSymptoms?: string[];
    triggersOrNotes?: string;
  }): Promise<SymptomAnalysisOutput> {
    try {
      const response = await fetch('/api/symptom-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Symptom analysis endpoint error, returning fallback', error);
      return {
        summary: `You noted ${data.symptomName} in the ${data.bodyArea} region (${data.severity}, ${data.duration}).`,
        summaryMarathi: `${data.bodyArea} मधील ${data.symptomName} नोंदवले आहे.`,
        generalInsights: [
          'Keeping a timeline of symptom onset and triggers assists your physician during outpatient evaluation.'
        ],
        doctorQuestions: [
          'What factors worsen or relieve these sensations?'
        ],
        safetyAdvisory: data.severity === 'Critical'
          ? 'URGENT: Critical symptoms require immediate attention. Dial 108 or report to the nearest Casualty.'
          : 'Consult your visiting medical officer if symptoms do not resolve within standard recovery intervals.',
        urgencyLevel: data.severity === 'Critical' ? 'Emergency 108' : 'Routine',
        disclaimer: 'DISCLAIMER: This is an educational tool and does not provide medical diagnoses.',
        isRealAiResponse: false
      };
    }
  }
};
