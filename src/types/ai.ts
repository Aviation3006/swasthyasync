import { BiomarkerResult } from './records';

export interface SimplifiedReportOutput {
  title: string;
  testCategory: string;
  reportDate: string;
  overallSummary: string;
  overallSummaryHindi?: string;
  overallSummaryMarathi: string;
  keyFindings: {
    title: string;
    status: 'Good' | 'Attention' | 'Urgent';
    explanation: string;
    explanationMarathi: string;
  }[];
  biomarkers: BiomarkerResult[];
  recommendedDoctorQuestions: string[];
  disclaimer: string;
  isRealAiResponse: boolean;
}

export interface SymptomAnalysisOutput {
  summary: string;
  summaryMarathi?: string;
  generalInsights: string[];
  doctorQuestions: string[];
  safetyAdvisory: string;
  urgencyLevel: 'Routine' | 'Prompt Attention' | 'Emergency 108';
  disclaimer: string;
  isRealAiResponse: boolean;
}

export interface StructuredSymptomItem {
  name: string;
  description: string;
  duration: string; // e.g. "Since yesterday" or "Not mentioned"
  severity: string; // e.g. "Mild", "Moderate", "Severe" or "Not mentioned"
  onset: string; // e.g. "Sudden", "Gradual" or "Not mentioned"
  associatedSymptoms: string[];
}

export interface VoiceSymptomAnalysisOutput {
  clinicalOverview: string;
  clinicalOverviewMarathi?: string;
  clinicalOverviewHindi?: string;
  symptoms: StructuredSymptomItem[];
  relevantContext: string[];
  suggestedQuestions: string[];
  missingInformation: string[];
  urgencyLevel: 'Routine' | 'Prompt Attention' | 'Emergency 108';
  disclaimer: string;
  isRealAiResponse: boolean;
}

