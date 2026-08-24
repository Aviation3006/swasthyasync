import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import type { 
  SimplifiedReportOutput, 
  SymptomAnalysisOutput, 
  VoiceSymptomAnalysisOutput,
  StructuredSymptomItem
} from '../src/types/ai';

dotenv.config();

export type { 
  SimplifiedReportOutput, 
  SymptomAnalysisOutput, 
  VoiceSymptomAnalysisOutput,
  StructuredSymptomItem
};

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.length < 10) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const isGeminiConfigured = Boolean(
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here' &&
  process.env.GEMINI_API_KEY.length > 10
);

/**
 * Multimodal document / image report simplification with Gemini
 */
export async function simplifyMedicalReport(
  base64Data?: string,
  mimeType?: string,
  fileName?: string
): Promise<SimplifiedReportOutput> {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      title: fileName ? `Simulated Analysis: ${fileName}` : 'Complete Metabolic & Glycemic Panel (Demo Mode)',
      testCategory: 'Pathology / Biochemistry',
      reportDate: new Date().toISOString().split('T')[0],
      overallSummary: '[DEMO MODE - GEMINI_API_KEY NOT CONFIGURED] Your test indicates stable biological parameters with mild blood sugar elevation (Fasting glucose 118 mg/dL, HbA1c 6.7%). Kidney and liver parameters are in healthy ranges.',
      overallSummaryHindi: '[डेमो मोड] आपकी जांच रिपोर्ट में ब्लड शुगर में हल्की वृद्धि है (Fasting glucose 118 mg/dL, HbA1c 6.7%), जबकि किडनी और लिवर के पैरामीटर सामान्य हैं।',
      overallSummaryMarathi: '[डेमो मोड] तुमच्या चाचणीत रक्तातील साखर नियंत्रणात असून किडनी व लिव्हरचे कार्य निरोगी असल्याचे दिसून येत आहे.',
      keyFindings: [
        {
          title: '3-Month Blood Sugar Target',
          status: 'Good',
          explanation: 'HbA1c of 6.7% shows that long-term glycemic control is on track for managed type 2 diabetes.',
          explanationMarathi: 'गेल्या ३ महिन्यांमधील रक्तातील साखरेची सरासरी समाधानकारक आहे.'
        },
        {
          title: 'Kidney Filtration (Creatinine & eGFR)',
          status: 'Good',
          explanation: 'Optimal waste clearance and normal hydration.',
          explanationMarathi: 'किडनीचे कार्य पूर्णपणे सामान्य व निरोगी आहे.'
        }
      ],
      biomarkers: [
        {
          name: 'HbA1c (Glycated Hemoglobin)',
          nameMarathi: 'एचबीए१सी',
          value: 6.7,
          unit: '%',
          referenceRange: '< 5.7 (Normal) | 5.7 - 6.4 (Pre-diabetic) | >= 6.5 (Diabetic)',
          status: 'High',
          plainExplanation: 'In range for managed diabetes target (< 7.0%).',
          plainExplanationMarathi: 'मधुमेहाच्या नियंत्रणासाठी समाधानकारक.'
        },
        {
          name: 'Fasting Blood Glucose',
          nameMarathi: 'उपाशीपोटी साखर',
          value: 118,
          unit: 'mg/dL',
          referenceRange: '70 - 100 mg/dL',
          status: 'High',
          plainExplanation: 'Slightly higher than non-diabetic baseline.',
          plainExplanationMarathi: 'सकाळची साखर किंचित जास्त.'
        },
        {
          name: 'Serum Creatinine',
          nameMarathi: 'सिरम क्रिएटीनिन',
          value: 0.95,
          unit: 'mg/dL',
          referenceRange: '0.7 - 1.3 mg/dL',
          status: 'Normal',
          plainExplanation: 'Normal kidney filtration integrity.',
          plainExplanationMarathi: 'किडनीचे फिल्टरेशन उत्तम आहे.'
        }
      ],
      recommendedDoctorQuestions: [
        'Should I continue my existing medication timing with meals?',
        'When should I schedule the next routine lipid and kidney screening?'
      ],
      disclaimer: 'DEMO NOTICE: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician before altering treatment.',
      isRealAiResponse: false
    };
  }

  try {
    const prompt = `You are a clinical report interpreter for SwasthyaSync (Maharashtra Public Health Portal).
Analyze the provided medical laboratory or imaging document.
Translate medical terminology into simple, compassionate, plain-language patient explanations.
Provide multilingual explanations (English, Hindi, and Marathi).

CRITICAL MEDICAL SAFETY RULES:
1. DO NOT DIAGNOSE the patient.
2. DO NOT PRESCRIBE any medication or suggest dosage changes.
3. State observed numerical values and compare against standard reference intervals.
4. If the document is blurry, unreadable, or not a medical document, state so clearly.
5. Always include a clear disclaimer stating this is educational and must be discussed with their doctor.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Title of the test / report",
  "testCategory": "Pathology / Hematology / Biochemistry / Radiology etc",
  "reportDate": "YYYY-MM-DD or Unknown",
  "overallSummary": "Clear 2-3 sentence explanation in simple English",
  "overallSummaryHindi": "Clear 2-3 sentence explanation in simple Hindi (हिन्दी)",
  "overallSummaryMarathi": "Clear 2-3 sentence explanation in simple Marathi (मराठी)",
  "keyFindings": [
    {
      "title": "Short title",
      "status": "Good" | "Attention" | "Urgent",
      "explanation": "Simple explanation in English",
      "explanationMarathi": "Simple explanation in Marathi"
    }
  ],
  "biomarkers": [
    {
      "name": "Parameter Name (e.g. Hemoglobin, Fasting Blood Sugar)",
      "nameMarathi": "नाव (मराठी)",
      "value": "Observed numerical or textual value",
      "unit": "Measurement Unit (e.g. mg/dL, %)",
      "referenceRange": "Standard Clinical Range",
      "status": "Normal" | "Low" | "High" | "Critical",
      "plainExplanation": "Simple 1-sentence patient takeaway",
      "plainExplanationMarathi": "सोप्या मराठीतील स्पष्टीकरण"
    }
  ],
  "recommendedDoctorQuestions": [
    "Practical question 1 for doctor visit",
    "Practical question 2"
  ],
  "disclaimer": "DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician or visiting medical officer before changing any medication or treatment."
}`;

    const parts: any[] = [{ text: prompt }];

    if (base64Data && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return {
      ...parsed,
      isRealAiResponse: true
    };
  } catch (error) {
    console.error('Error executing Gemini report simplification:', error);
    throw error;
  }
}

/**
 * Analyze Natural Spoken or Typed Voice Symptom Transcript with Gemini
 * Follows strict truthfulness, no hallucinations, and "Not mentioned" defaults.
 */
export async function analyzeVoiceSymptomTranscript(params: {
  transcript: string;
  language?: string;
}): Promise<VoiceSymptomAnalysisOutput> {
  const { transcript, language = 'en-IN' } = params;
  const cleanTranscript = (transcript || '').trim();

  if (!cleanTranscript) {
    throw new Error('Transcript is required for voice symptom analysis.');
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Intelligent non-hallucinating local fallback
    return {
      clinicalOverview: `Reported symptoms from user description: "${cleanTranscript}". No automated diagnosis is rendered.`,
      symptoms: [
        {
          name: cleanTranscript.split(' ')[0] || 'Reported Symptom',
          description: cleanTranscript,
          duration: 'Not mentioned',
          severity: 'Not mentioned',
          onset: 'Not mentioned',
          associatedSymptoms: []
        }
      ],
      relevantContext: [
        'User provided a natural spoken symptom description without diagnostic claims.'
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
      urgencyLevel: /chest pain|breathless|unconscious|severe bleed|stroke/i.test(cleanTranscript) ? 'Emergency 108' : 'Routine',
      disclaimer: 'AI-generated summaries are for informational purposes and are not a medical diagnosis. Consult a qualified healthcare professional for medical advice.',
      isRealAiResponse: false
    };
  }

  try {
    const prompt = `You are a clinical preparation assistant for SwasthyaSync (National Digital Health Mission / Public Health Network).
A citizen provided the following natural description of their symptoms (spoken via voice or typed):
"${cleanTranscript}"

Language Context: ${language}

CRITICAL MEDICAL SAFETY & EXTRACTION DIRECTIVES:
1. STRICT TRUTHFULNESS: Extract ONLY what the user explicitly stated. DO NOT invent, assume, or hallucinate symptoms, durations, medications, measurements, diagnoses, or medical history.
2. MISSING INFORMATION: If duration, severity, onset, triggers, or specific details are not mentioned in the transcript, you MUST set them to "Not mentioned". NEVER guess or fabricate.
3. NO MEDICAL DIAGNOSIS: You are an organizational and preparation tool, NOT a diagnostic system. Never claim or diagnose a disease.
4. CLINICAL OVERVIEW: Write a concise 2-3 sentence objective overview summarizing ONLY what the user reported (e.g. "Reported symptoms include headache and dizziness beginning approximately one day ago. The user did not mention the severity or any known trigger.").
5. LOGGED SYMPTOMS: Extract each distinct symptom as an item in the symptoms array.
6. QUESTIONS FOR DOCTOR: Generate 3-4 thoughtful, relevant questions the user can ask their consulting physician based on what was described.
7. MISSING INFORMATION: List 2-4 key clinical details that were absent from the user's description (e.g., timeline, pain scale, triggers, medications) as reminders for their doctor appointment.
8. MULTI-LANGUAGE PRESERVATION: If input is in Hindi or Marathi, understand the spoken idioms accurately and reflect the meaning properly.
9. EMERGENCY FLAGS: If description contains life-threatening red flags (e.g. acute crushing chest pain, sudden numbness/paralysis, acute breathlessness, sudden speech loss), set urgencyLevel to "Emergency 108". Otherwise set to "Routine" or "Prompt Attention".

Return ONLY a valid JSON object matching this schema:
{
  "clinicalOverview": "...",
  "symptoms": [
    {
      "name": "Symptom Name (e.g. Headache)",
      "description": "Short description of what the user described",
      "duration": "Mentioned duration or 'Not mentioned'",
      "severity": "Mentioned severity or 'Not mentioned'",
      "onset": "Mentioned onset timing or 'Not mentioned'",
      "associatedSymptoms": ["..."]
    }
  ],
  "relevantContext": ["..."],
  "suggestedQuestions": [
    "Question 1 to ask physician",
    "Question 2 to ask physician",
    "Question 3 to ask physician"
  ],
  "missingInformation": [
    "Detail 1 not mentioned that doctor may ask",
    "Detail 2 not mentioned"
  ],
  "urgencyLevel": "Routine" | "Prompt Attention" | "Emergency 108",
  "disclaimer": "AI-generated summaries are for informational purposes and are not a medical diagnosis. Consult a qualified healthcare professional for medical advice."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      ...parsed,
      isRealAiResponse: true
    };
  } catch (err) {
    console.error('Error executing Gemini voice symptom analysis:', err);
    throw err;
  }
}

/**
 * Non-diagnostic symptom pattern analysis with Gemini (General / Form Entry)
 */
export async function analyzeSymptomPattern(data: any): Promise<any> {
  // If voice transcript payload is provided, route to analyzeVoiceSymptomTranscript
  if (data.transcript) {
    return analyzeVoiceSymptomTranscript({
      transcript: data.transcript,
      language: data.language
    });
  }

  const symptomData = data;
  const ai = getGeminiClient();

  if (!ai) {
    return {
      summary: `[DEMO MODE] You recorded ${symptomData.symptomName || 'symptom'} in the ${symptomData.bodyArea || 'body'} region (${symptomData.severity || 'Mild'} severity, lasting ${symptomData.duration || 'Not mentioned'}).`,
      summaryMarathi: `[डेमो मोड] तुम्ही ${symptomData.bodyArea || 'शरीर'} भागातील ${symptomData.symptomName || 'लक्षण'} नोंदवले आहे.`,
      generalInsights: [
        'Symptoms lasting multiple days are best evaluated in context with your medical history.',
        'Tracking aggravating activities provides valuable diagnostic context for your physician.'
      ],
      doctorQuestions: [
        `How long has this ${symptomData.symptomName || 'symptom'} been occurring?`,
        'Are there specific home remedies or resting positions that ease the discomfort?'
      ],
      safetyAdvisory: symptomData.severity === 'Critical' || symptomData.severity === 'Severe'
        ? 'URGENT: Severe or rapidly worsening symptoms warrant immediate evaluation at the nearest hospital emergency casualty or calling 108.'
        : 'If symptoms persist or worsen, schedule an outpatient OPD consultation.',
      urgencyLevel: symptomData.severity === 'Critical' ? 'Emergency 108' : symptomData.severity === 'Severe' ? 'Prompt Attention' : 'Routine',
      disclaimer: 'DEMO NOTICE: SwasthyaSync Symptom Logger is for personal health tracking only and does not provide automated diagnoses. Dial 108 in emergencies.',
      isRealAiResponse: false
    };
  }

  try {
    const prompt = `You are a clinical preparation assistant for SwasthyaSync (Maharashtra Public Health Portal).
The user recorded a symptom entry in their diary:
- Body Region: ${symptomData.bodyArea || 'General'}
- Symptom Name: ${symptomData.symptomName || 'Symptom'}
- Severity: ${symptomData.severity || 'Not mentioned'}
- Duration: ${symptomData.duration || 'Not mentioned'}
- First Started: ${symptomData.startDate || 'Not mentioned'}
- Associated Symptoms: ${(symptomData.associatedSymptoms || []).join(', ') || 'None'}
- Notes/Triggers: ${symptomData.triggersOrNotes || 'None'}

CRITICAL SAFETY DIRECTIVES:
1. DO NOT DIAGNOSE a specific illness.
2. DO NOT PRESCRIBE medications.
3. Suggest thoughtful questions for the patient to ask their doctor.
4. If severe red flags are present (e.g. chest pressure, sudden numbness, acute breathlessness), mark urgencyLevel as "Emergency 108".
5. Provide a brief Marathi summary as well.

Return ONLY a JSON object:
{
  "summary": "Objective summary of the user entry in English",
  "summaryMarathi": "Objective summary of the user entry in Marathi",
  "generalInsights": [
    "Insight 1 (educational, non-diagnostic)",
    "Insight 2"
  ],
  "doctorQuestions": [
    "Question 1 to ask physician",
    "Question 2 to ask physician"
  ],
  "safetyAdvisory": "Clear guidance on when to seek urgent care",
  "urgencyLevel": "Routine" | "Prompt Attention" | "Emergency 108",
  "disclaimer": "SwasthyaSync Symptom Logger is an educational tool. It does not diagnose disease or replace professional medical consultation."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      ...parsed,
      isRealAiResponse: true
    };
  } catch (error) {
    console.error('Error executing Gemini symptom analysis:', error);
    throw error;
  }
}
