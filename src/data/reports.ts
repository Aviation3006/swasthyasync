import { SimplifiedReport } from '../types/records';

export const mockSimplifiedReports: SimplifiedReport[] = [
  {
    id: 'simp-rep-01',
    recordId: 'rec-001',
    title: 'Comprehensive Glycemic & Lipid Health Evaluation',
    testCategory: 'Pathology / Biochemistry',
    reportDate: '2026-08-20',
    overallSummary: 'Your test shows reasonably steady blood sugar control and normal kidney function. Your HbA1c is 6.7%, which aligns well with your diabetes management target. Your triglycerides are slightly high (172 mg/dL), which indicates that limiting oily foods and sweets will help protect your heart.',
    overallSummaryMarathi: 'तुमच्या चाचणीत रक्तातील साखर नियंत्रणात आणि किडनीचे कार्य निरोगी असल्याचे दिसून येत आहे. HbA1c ६.७% आहे, जे मधुमेहाच्या दृष्टीने चांगले आहे. ट्रायग्लिसराइड्स (१७२ mg/dL) थोडे वाढलेले आहेत, त्यामुळे तेलकट आणि गोड पदार्थ कमी करणे फायदेशीर ठरेल.',
    keyFindings: [
      {
        title: '3-Month Blood Sugar (HbA1c: 6.7%)',
        status: 'Good',
        explanation: 'HbA1c measures the average sugar coated on your red blood cells over the last 90 days. For someone managing diabetes, staying below 7.0% prevents long-term nerve and eye complications.',
        explanationMarathi: 'गेल्या ३ महिन्यांमधील रक्तातील साखरेची सरासरी समाधानकारक आहे (७% पेक्षा कमी).'
      },
      {
        title: 'Kidney Health (Creatinine: 0.95 mg/dL & eGFR: 92)',
        status: 'Good',
        explanation: 'Both creatinine and filtration rate are in the optimal healthy range, showing that your diabetes medications are not stressing your kidneys.',
        explanationMarathi: 'किडनीचे कार्य पूर्णपणे सामान्य व निरोगी आहे.'
      },
      {
        title: 'Blood Fats / Triglycerides (172 mg/dL)',
        status: 'Attention',
        explanation: 'Slightly above the desirable limit of 150 mg/dL. Elevated triglycerides are common with carb intake; daily 40-minute walking helps clear them.',
        explanationMarathi: 'रक्तातील ट्रायग्लिसराइड्स चरबी १५० पेक्षा थोडी जास्त आहे. नियमित व्यायाम व आहारातील पथ्ये आवश्यक आहेत.'
      }
    ],
    biomarkers: [
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        nameMarathi: 'एचबीए१सी (३ महिन्यांची सरासरी साखर)',
        value: 6.7,
        unit: '%',
        referenceRange: '4.0 - 5.6 (Normal) | 5.7 - 6.4 (Pre-diabetes) | >= 6.5 (Diabetes)',
        status: 'High',
        plainExplanation: 'Target for diabetic adults is < 7.0%. Your 6.7% shows your medications and lifestyle are working well.',
        plainExplanationMarathi: 'मधुमेही व्यक्तींसाठी ७.०% पेक्षा कमी असणे उत्तम मानले जाते. तुमचे नियंत्रण चांगले आहे.'
      },
      {
        name: 'Fasting Blood Sugar',
        nameMarathi: 'उपाशीपोटी साखर (Fasting Glucose)',
        value: 118,
        unit: 'mg/dL',
        referenceRange: '70 - 100 mg/dL',
        status: 'High',
        plainExplanation: 'Shows morning baseline sugar. Slightly above normal non-diabetic range, which is expected with T2DM.',
        plainExplanationMarathi: 'सकाळची उपाशीपोटी साखर सामान्य मर्यादेपेक्षा थोडी जास्त आहे.'
      },
      {
        name: 'Serum Creatinine',
        nameMarathi: 'सिरम क्रिएटीनिन',
        value: 0.95,
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3 mg/dL',
        status: 'Normal',
        plainExplanation: 'A waste product filtered out by kidneys. Normal level confirms normal kidney filtration.',
        plainExplanationMarathi: 'किडनीचे फिल्टरेशन पूर्णपणे व्यवस्थित आहे.'
      },
      {
        name: 'Serum Triglycerides',
        nameMarathi: 'ट्रायग्लिसराइड्स',
        value: 172,
        unit: 'mg/dL',
        referenceRange: '< 150 mg/dL',
        status: 'High',
        plainExplanation: 'Fat in blood stream. Slightly elevated. Reduce bakery items, deep fried foods and excess sugar.',
        plainExplanationMarathi: 'रक्तातील चरबीचे प्रमाण १५० पेक्षा जास्त आहे. तळलेले पदार्थ टाळा.'
      },
      {
        name: 'HDL (Good Cholesterol)',
        nameMarathi: 'एचडीएल (चांगले कोलेस्टेरॉल)',
        value: 44,
        unit: 'mg/dL',
        referenceRange: '> 40 mg/dL',
        status: 'Normal',
        plainExplanation: 'Good cholesterol protects against heart disease. Your level is healthy.',
        plainExplanationMarathi: 'हृदयाचे रक्षण करणारे चांगले कोलेस्टेरॉल सुरक्षित पातळीवर आहे.'
      }
    ],
    recommendedDoctorQuestions: [
      'Should I continue my current dosage of Metformin 500mg BD or is any adjustment needed?',
      'Do I need to take a low-dose statin for the slightly elevated triglycerides (172 mg/dL)?',
      'When should I schedule my next kidney microalbumin urine test?'
    ],
    disclaimer: 'DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician or visiting medical officer before changing any medication or treatment.'
  },
  {
    id: 'simp-rep-02',
    recordId: 'rec-006',
    title: 'Complete Blood Count (CBC) & Hemogram',
    testCategory: 'Hematology',
    reportDate: '2026-06-10',
    overallSummary: 'Your hemoglobin and red blood cells are normal. White blood cell count is within normal range with no active acute bacterial infection indicated. Platelet count is 245,000 /µL, which is healthy.',
    overallSummaryMarathi: 'तुमचे हिमोग्लोबिन आणि पांढऱ्या पेशींचे प्रमाण सामान्य आहे. प्लेटलेट्स २४५,००० /µL असून उत्तम स्थितीत आहेत.',
    keyFindings: [
      {
        title: 'Hemoglobin (14.2 g/dL)',
        status: 'Good',
        explanation: 'Healthy red blood cell oxygen-carrying capacity. No anemia detected.',
        explanationMarathi: 'हिमोग्लोबिन १४.२ ग्रॅम असून रक्तक्षय (एनिमिया) नाही.'
      },
      {
        title: 'Platelet Count (2,45,000 /µL)',
        status: 'Good',
        explanation: 'Adequate blood clotting cells. Normal healthy range (150,000 - 450,000).',
        explanationMarathi: 'प्लेटलेट्सची संख्या पूर्णपणे सुरक्षित आहे.'
      }
    ],
    biomarkers: [
      {
        name: 'Hemoglobin',
        nameMarathi: 'हिमोग्लोबिन',
        value: 14.2,
        unit: 'g/dL',
        referenceRange: '13.0 - 17.0 g/dL',
        status: 'Normal',
        plainExplanation: 'Normal oxygen delivery throughout body tissues.',
        plainExplanationMarathi: 'शरीरात ऑक्सिजन पोहोचवण्याची क्षमता चांगली आहे.'
      },
      {
        name: 'Total Leukocyte Count (WBC)',
        nameMarathi: 'एकूण पांढऱ्या पेशी (WBC)',
        value: 6800,
        unit: '/µL',
        referenceRange: '4,000 - 11,000 /µL',
        status: 'Normal',
        plainExplanation: 'Immune cell count is balanced, indicating no acute infection.',
        plainExplanationMarathi: 'रोगप्रतिकारक पेशींचे प्रमाण योग्य आहे.'
      },
      {
        name: 'Platelet Count',
        nameMarathi: 'प्लेटलेट संख्या',
        value: 245000,
        unit: '/µL',
        referenceRange: '150,000 - 450,000 /µL',
        status: 'Normal',
        plainExplanation: 'Optimal platelet levels for healthy clotting.',
        plainExplanationMarathi: 'रक्त गोठण्यासाठी आवश्यक प्लेटलेट्स पुरेशा आहेत.'
      }
    ],
    recommendedDoctorQuestions: [
      'Is my nutrition adequate to maintain this healthy hemoglobin level?'
    ],
    disclaimer: 'DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician or visiting medical officer.'
  }
];
