import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const isGeminiConfigured = Boolean(
  apiKey &&
  apiKey !== 'your-gemini-api-key-here' &&
  apiKey.length > 10
);

const ai = isGeminiConfigured ? new GoogleGenAI({ apiKey }) : null;

import { SimplifiedReportOutput, SymptomAnalysisOutput } from '../src/types/ai';

export type { SimplifiedReportOutput, SymptomAnalysisOutput };

/**
 * Multimodal document / image report simplification with Gemini
 */
export async function simplifyMedicalReport(
  base64Data?: string,
  mimeType?: string,
  fileName?: string
): Promise<SimplifiedReportOutput> {
  if (!isGeminiConfigured || !ai) {
    // Return clearly labeled demo response if Gemini API key is not configured
    return {
      title: fileName ? `Simulated Analysis: ${fileName}` : 'Complete Metabolic & Glycemic Panel (Demo Mode)',
      testCategory: 'Pathology / Biochemistry',
      reportDate: new Date().toISOString().split('T')[0],
      overallSummary: '[DEMO MODE - GEMINI_API_KEY NOT CONFIGURED] Your test indicates stable biological parameters with mild blood sugar elevation (Fasting glucose 118 mg/dL, HbA1c 6.7%). Kidney and liver parameters are in healthy ranges.',
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
Provide bilingual explanations (English and Marathi).

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
      "name": "Parameter name",
      "nameMarathi": "मराठी नाव",
      "value": "Observed value",
      "unit": "Unit of measurement",
      "referenceRange": "Reference interval",
      "status": "Normal" | "High" | "Low" | "Critical",
      "plainExplanation": "What this number means in simple English",
      "plainExplanationMarathi": "What this number means in simple Marathi"
    }
  ],
  "recommendedDoctorQuestions": [
    "Question 1 for doctor",
    "Question 2 for doctor"
  ],
  "disclaimer": "DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician or visiting medical officer before changing any medication or treatment."
}`;

    const contents: any[] = [];
    if (base64Data && mimeType) {
      contents.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

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
 * Non-diagnostic symptom pattern analysis with Gemini
 */
export async function analyzeSymptomPattern(symptomData: {
  bodyArea: string;
  symptomName: string;
  severity: string;
  duration: string;
  startDate: string;
  associatedSymptoms?: string[];
  triggersOrNotes?: string;
}): Promise<SymptomAnalysisOutput> {
  if (!isGeminiConfigured || !ai) {
    return {
      summary: `[DEMO MODE] You recorded ${symptomData.symptomName} in the ${symptomData.bodyArea} region (${symptomData.severity} severity, lasting ${symptomData.duration}).`,
      summaryMarathi: `[डेमो मोड] तुम्ही ${symptomData.bodyArea} भागातील ${symptomData.symptomName} (${symptomData.severity}) नोंदवले आहे.`,
      generalInsights: [
        'Symptoms lasting multiple days are best evaluated in context with your medical history.',
        'Tracking aggravating activities (e.g. movement, meals, posture) provides valuable diagnostic context for your physician.'
      ],
      doctorQuestions: [
        `How long has this ${symptomData.symptomName} been occurring?`,
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
- Body Region: ${symptomData.bodyArea}
- Symptom Name: ${symptomData.symptomName}
- Severity: ${symptomData.severity}
- Duration: ${symptomData.duration}
- First Started: ${symptomData.startDate}
- Associated Symptoms: ${(symptomData.associatedSymptoms || []).join(', ') || 'None'}
- Notes/Triggers: ${symptomData.triggersOrNotes || 'None'}

CRITICAL SAFETY DIRECTIVES:
1. DO NOT DIAGNOSE a specific illness.
2. DO NOT PRESCRIBE medications.
3. Suggest thoughtful questions for the patient to ask their doctor.
4. If severe red flags are present (e.g. chest pressure, sudden numbness, acute breathlessness, high fever in infants), mark urgencyLevel as "Emergency 108" and emphasize seeking immediate care.
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
