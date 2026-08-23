import { SimplifiedReport, BiomarkerResult } from '../types/records';
import { mockSimplifiedReports } from '../data/reports';
import { StorageStore } from '../utils/storage';

const reportStore = new StorageStore<SimplifiedReport[]>('simplified_reports', []);

export const reportService = {
  getAllReports(): SimplifiedReport[] {
    return reportStore.get();
  },

  getReportById(id: string): SimplifiedReport | undefined {
    return reportStore.get().find((r) => r.id === id);
  },

  /**
   * Simulates automated document extraction and simplification for uploaded lab reports
   */
  async processUploadedReport(fileName: string, fileSize: string): Promise<SimplifiedReport> {
    // Artificial realistic processing delay
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Determine category based on filename or fallback
    const lower = fileName.toLowerCase();
    let title = 'Complete Blood Count (CBC) & Metabolic Profile';
    let testCategory = 'Pathology / Biochemistry';
    let overallSummary = 'The uploaded lab document has been processed. Vitals and biological indices are within manageable ranges. Blood sugar indices show mild elevation, whereas renal, liver, and hematological markers are normal.';
    let overallSummaryMarathi = 'अपलोड केलेल्या लॅब अहवालाचे विश्लेषण पूर्ण झाले आहे. बहुतांश घटक सामान्य मर्यादेत आहेत, रक्तातील साखरेचे प्रमाण थोडे वाढलेले आहे.';
    let biomarkers: BiomarkerResult[] = [];

    if (lower.includes('lipid') || lower.includes('cholesterol')) {
      title = 'Lipid Profile & Cardiovascular Risk Screening';
      testCategory = 'Cardiovascular Biochemistry';
      overallSummary = 'Your total cholesterol is slightly elevated at 208 mg/dL. HDL (protective cholesterol) is 44 mg/dL. Reducing deep-fried foods and engaging in brisk cardio exercise will restore balance.';
      overallSummaryMarathi = 'एकूण कोलेस्टेरॉल २०८ mg/dL असून थोडे वाढलेले आहे. नियमित व्यायाम व तेलकट अन्न टाळण्याचा सल्ला.';
      biomarkers = [
        { name: 'Total Cholesterol', nameMarathi: 'एकूण कोलेस्टेरॉल', value: 208, unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'High', plainExplanation: 'Slightly above desirable baseline.', plainExplanationMarathi: 'सामान्य मर्यादेपेक्षा किंचित जास्त.' },
        { name: 'HDL (Good Cholesterol)', nameMarathi: 'चांगले कोलेस्टेरॉल', value: 44, unit: 'mg/dL', referenceRange: '> 40 mg/dL', status: 'Normal', plainExplanation: 'Healthy cardiovascular protection.', plainExplanationMarathi: 'हृदयासाठी आवश्यक चांगले कोलेस्टेरॉल.' },
        { name: 'LDL (Bad Cholesterol)', nameMarathi: 'वाईट कोलेस्टेरॉल', value: 132, unit: 'mg/dL', referenceRange: '< 100 mg/dL', status: 'High', plainExplanation: 'Borderline elevated LDL.', plainExplanationMarathi: 'धमन्यांमध्ये चरबी साठवणारे कोलेस्टेरॉल थोडे वाढले आहे.' },
        { name: 'Triglycerides', nameMarathi: 'ट्रायग्लिसराइड्स', value: 160, unit: 'mg/dL', referenceRange: '< 150 mg/dL', status: 'High', plainExplanation: 'Dietary fats in circulation.', plainExplanationMarathi: 'रक्तातील चरबीचे प्रमाण.' }
      ];
    } else if (lower.includes('liver') || lower.includes('lft')) {
      title = 'Liver Function Test (LFT Panel)';
      testCategory = 'Hepatic Biochemistry';
      overallSummary = 'All liver enzymes (SGOT, SGPT, Bilirubin) are in healthy normal ranges, indicating excellent liver metabolic health.';
      overallSummaryMarathi = 'लिव्हरची सर्व कार्यक्षमता आणि एन्झाईम्स पूर्णपणे सामान्य आहेत.';
      biomarkers = [
        { name: 'Total Bilirubin', nameMarathi: 'एकूण बिलीरुबिन', value: 0.8, unit: 'mg/dL', referenceRange: '0.2 - 1.2 mg/dL', status: 'Normal', plainExplanation: 'Normal bile breakdown.', plainExplanationMarathi: 'काविळीची कोणतीही लक्षणे नाहीत.' },
        { name: 'SGOT / AST', nameMarathi: 'एसजीओटी', value: 28, unit: 'U/L', referenceRange: '10 - 40 U/L', status: 'Normal', plainExplanation: 'Healthy liver tissue integrity.', plainExplanationMarathi: 'यकृताचे कार्य व्यवस्थित आहे.' },
        { name: 'SGPT / ALT', nameMarathi: 'एसजीपीटी', value: 32, unit: 'U/L', referenceRange: '10 - 45 U/L', status: 'Normal', plainExplanation: 'Optimal liver enzyme levels.', plainExplanationMarathi: 'सामान्य पातळी.' }
      ];
    } else {
      // Default CBC / Diabetes
      biomarkers = [
        { name: 'Hemoglobin', nameMarathi: 'हिमोग्लोबिन', value: 13.8, unit: 'g/dL', referenceRange: '13.0 - 17.0 g/dL', status: 'Normal', plainExplanation: 'Optimal oxygen carrying capacity.', plainExplanationMarathi: 'रक्तक्षय नाही, हिमोग्लोबिन उत्तम आहे.' },
        { name: 'Fasting Blood Sugar', nameMarathi: 'उपाशीपोटी साखर', value: 114, unit: 'mg/dL', referenceRange: '70 - 100 mg/dL', status: 'High', plainExplanation: 'Slightly high baseline glucose.', plainExplanationMarathi: 'सकाळची साखर किंचित जास्त.' },
        { name: 'WBC (Total Leukocytes)', nameMarathi: 'पांढऱ्या पेशी', value: 7200, unit: '/µL', referenceRange: '4000 - 11000 /µL', status: 'Normal', plainExplanation: 'Immune cell count is healthy.', plainExplanationMarathi: 'रोगप्रतिकारक पेशी सामान्य.' },
        { name: 'Platelets', nameMarathi: 'प्लेटलेट्स', value: 230000, unit: '/µL', referenceRange: '150000 - 450000 /µL', status: 'Normal', plainExplanation: 'Adequate clotting capacity.', plainExplanationMarathi: 'रक्त गोठण्याची क्षमता योग्य आहे.' }
      ];
    }

    const newReport: SimplifiedReport = {
      id: `simp-rep-${Date.now()}`,
      title,
      testCategory,
      reportDate: new Date().toISOString().split('T')[0],
      overallSummary,
      overallSummaryMarathi,
      keyFindings: [
        {
          title: 'Overall Impression',
          status: 'Good',
          explanation: 'No critical acute abnormalities were detected in this analysis.',
          explanationMarathi: 'चाचणीमध्ये कोणताही तात्काळ धोका नाही.'
        }
      ],
      biomarkers,
      recommendedDoctorQuestions: [
        'How do these results compare with my previous tests?',
        'Do I need to make any alterations to my diet or medication timetable?'
      ],
      disclaimer: 'DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician or visiting medical officer.'
    };

    reportStore.set((prev) => [newReport, ...prev]);
    return newReport;
  },

  subscribe(listener: (reports: SimplifiedReport[]) => void): () => void {
    return reportStore.subscribe(listener);
  }
};
