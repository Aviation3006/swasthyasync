import { BiomarkerResult } from './records';

export interface SimplifiedReportOutput {
  title: string;
  testCategory: string;
  reportDate: string;
  overallSummary: string;
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
