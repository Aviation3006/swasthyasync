// server/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.production") });
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here" || apiKey.length < 10) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}
var isGeminiConfigured = Boolean(
  process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here" && process.env.GEMINI_API_KEY.length > 10
);
async function simplifyMedicalReport(base64Data, mimeType, fileName) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      title: fileName ? `Simulated Analysis: ${fileName}` : "Complete Metabolic & Glycemic Panel (Demo Mode)",
      testCategory: "Pathology / Biochemistry",
      reportDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      overallSummary: "[DEMO MODE - GEMINI_API_KEY NOT CONFIGURED] Your test indicates stable biological parameters with mild blood sugar elevation (Fasting glucose 118 mg/dL, HbA1c 6.7%). Kidney and liver parameters are in healthy ranges.",
      overallSummaryHindi: "[\u0921\u0947\u092E\u094B \u092E\u094B\u0921] \u0906\u092A\u0915\u0940 \u091C\u093E\u0902\u091A \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u092E\u0947\u0902 \u092C\u094D\u0932\u0921 \u0936\u0941\u0917\u0930 \u092E\u0947\u0902 \u0939\u0932\u094D\u0915\u0940 \u0935\u0943\u0926\u094D\u0927\u093F \u0939\u0948 (Fasting glucose 118 mg/dL, HbA1c 6.7%), \u091C\u092C\u0915\u093F \u0915\u093F\u0921\u0928\u0940 \u0914\u0930 \u0932\u093F\u0935\u0930 \u0915\u0947 \u092A\u0948\u0930\u093E\u092E\u0940\u091F\u0930 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0939\u0948\u0902\u0964",
      overallSummaryMarathi: "[\u0921\u0947\u092E\u094B \u092E\u094B\u0921] \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u091A\u093E\u091A\u0923\u0940\u0924 \u0930\u0915\u094D\u0924\u093E\u0924\u0940\u0932 \u0938\u093E\u0916\u0930 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923\u093E\u0924 \u0905\u0938\u0942\u0928 \u0915\u093F\u0921\u0928\u0940 \u0935 \u0932\u093F\u0935\u094D\u0939\u0930\u091A\u0947 \u0915\u093E\u0930\u094D\u092F \u0928\u093F\u0930\u094B\u0917\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u091A\u0947 \u0926\u093F\u0938\u0942\u0928 \u092F\u0947\u0924 \u0906\u0939\u0947.",
      keyFindings: [
        {
          title: "3-Month Blood Sugar Target",
          status: "Good",
          explanation: "HbA1c of 6.7% shows that long-term glycemic control is on track for managed type 2 diabetes.",
          explanationMarathi: "\u0917\u0947\u0932\u094D\u092F\u093E \u0969 \u092E\u0939\u093F\u0928\u094D\u092F\u093E\u0902\u092E\u0927\u0940\u0932 \u0930\u0915\u094D\u0924\u093E\u0924\u0940\u0932 \u0938\u093E\u0916\u0930\u0947\u091A\u0940 \u0938\u0930\u093E\u0938\u0930\u0940 \u0938\u092E\u093E\u0927\u093E\u0928\u0915\u093E\u0930\u0915 \u0906\u0939\u0947."
        },
        {
          title: "Kidney Filtration (Creatinine & eGFR)",
          status: "Good",
          explanation: "Optimal waste clearance and normal hydration.",
          explanationMarathi: "\u0915\u093F\u0921\u0928\u0940\u091A\u0947 \u0915\u093E\u0930\u094D\u092F \u092A\u0942\u0930\u094D\u0923\u092A\u0923\u0947 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0935 \u0928\u093F\u0930\u094B\u0917\u0940 \u0906\u0939\u0947."
        }
      ],
      biomarkers: [
        {
          name: "HbA1c (Glycated Hemoglobin)",
          nameMarathi: "\u090F\u091A\u092C\u0940\u090F\u0967\u0938\u0940",
          value: 6.7,
          unit: "%",
          referenceRange: "< 5.7 (Normal) | 5.7 - 6.4 (Pre-diabetic) | >= 6.5 (Diabetic)",
          status: "High",
          plainExplanation: "In range for managed diabetes target (< 7.0%).",
          plainExplanationMarathi: "\u092E\u0927\u0941\u092E\u0947\u0939\u093E\u091A\u094D\u092F\u093E \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923\u093E\u0938\u093E\u0920\u0940 \u0938\u092E\u093E\u0927\u093E\u0928\u0915\u093E\u0930\u0915."
        },
        {
          name: "Fasting Blood Glucose",
          nameMarathi: "\u0909\u092A\u093E\u0936\u0940\u092A\u094B\u091F\u0940 \u0938\u093E\u0916\u0930",
          value: 118,
          unit: "mg/dL",
          referenceRange: "70 - 100 mg/dL",
          status: "High",
          plainExplanation: "Slightly higher than non-diabetic baseline.",
          plainExplanationMarathi: "\u0938\u0915\u093E\u0933\u091A\u0940 \u0938\u093E\u0916\u0930 \u0915\u093F\u0902\u091A\u093F\u0924 \u091C\u093E\u0938\u094D\u0924."
        },
        {
          name: "Serum Creatinine",
          nameMarathi: "\u0938\u093F\u0930\u092E \u0915\u094D\u0930\u093F\u090F\u091F\u0940\u0928\u093F\u0928",
          value: 0.95,
          unit: "mg/dL",
          referenceRange: "0.7 - 1.3 mg/dL",
          status: "Normal",
          plainExplanation: "Normal kidney filtration integrity.",
          plainExplanationMarathi: "\u0915\u093F\u0921\u0928\u0940\u091A\u0947 \u092B\u093F\u0932\u094D\u091F\u0930\u0947\u0936\u0928 \u0909\u0924\u094D\u0924\u092E \u0906\u0939\u0947."
        }
      ],
      recommendedDoctorQuestions: [
        "Should I continue my existing medication timing with meals?",
        "When should I schedule the next routine lipid and kidney screening?"
      ],
      disclaimer: "DEMO NOTICE: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician before altering treatment.",
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
  "overallSummaryHindi": "Clear 2-3 sentence explanation in simple Hindi (\u0939\u093F\u0928\u094D\u0926\u0940)",
  "overallSummaryMarathi": "Clear 2-3 sentence explanation in simple Marathi (\u092E\u0930\u093E\u0920\u0940)",
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
      "nameMarathi": "\u0928\u093E\u0935 (\u092E\u0930\u093E\u0920\u0940)",
      "value": "Observed numerical or textual value",
      "unit": "Measurement Unit (e.g. mg/dL, %)",
      "referenceRange": "Standard Clinical Range",
      "status": "Normal" | "Low" | "High" | "Critical",
      "plainExplanation": "Simple 1-sentence patient takeaway",
      "plainExplanationMarathi": "\u0938\u094B\u092A\u094D\u092F\u093E \u092E\u0930\u093E\u0920\u0940\u0924\u0940\u0932 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923"
    }
  ],
  "recommendedDoctorQuestions": [
    "Practical question 1 for doctor visit",
    "Practical question 2"
  ],
  "disclaimer": "DISCLAIMER: SwasthyaSync Report Simplifier provides educational summaries for informational purposes only. It is not an automated medical diagnosis or clinical prescription. Always consult your treating physician or visiting medical officer before changing any medication or treatment."
}`;
    const parts = [{ text: prompt }];
    if (base64Data && mimeType) {
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: parts,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      isRealAiResponse: true
    };
  } catch (error) {
    console.error("Error executing Gemini report simplification:", error);
    throw error;
  }
}

// server/apiSecurity.ts
import { createClient } from "@supabase/supabase-js";
import dotenv2 from "dotenv";
import path2 from "path";
dotenv2.config();
dotenv2.config({ path: path2.resolve(process.cwd(), ".env.production") });
var serverSupabaseClient = null;
function getServerSupabase() {
  if (serverSupabaseClient) return serverSupabaseClient;
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && anonKey && url !== "https://your-project.supabase.co" && !url.includes("placeholder")) {
    serverSupabaseClient = createClient(url, anonKey);
  }
  return serverSupabaseClient;
}
function isAllowedOrigin(origin) {
  if (!origin) return true;
  const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().toLowerCase()) : [];
  const lower = origin.toLowerCase();
  if (envOrigins.includes(lower)) return true;
  if (lower.startsWith("http://localhost:") || lower.startsWith("http://127.0.0.1:") || lower.startsWith("https://localhost:")) {
    return true;
  }
  if (lower.endsWith(".vercel.app")) {
    return true;
  }
  return false;
}
function applyCorsHeaders(req, res) {
  const origin = req.headers?.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!origin) {
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-SwasthyaSync-Demo"
  );
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    if (origin && !isAllowedOrigin(origin)) {
      res.status(403).json({ error: "CORS origin not allowed." });
      return true;
    }
    res.status(204).end();
    return true;
  }
  return false;
}
async function authenticateApiRequest(req) {
  const isServerDemoMode = process.env.VITE_ENABLE_DEMO_MODE === "true";
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  let token;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }
  if (token) {
    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (!error && data?.user) {
          return {
            authenticated: true,
            userId: data.user.id,
            isDemo: false
          };
        }
      } catch (err) {
      }
    }
  }
  const hasDemoHeader = req.headers?.["x-swasthyasync-demo"] === "true";
  if (isServerDemoMode && (hasDemoHeader || process.env.NODE_ENV === "development")) {
    return {
      authenticated: true,
      userId: "demo-evaluator-session",
      isDemo: true
    };
  }
  return {
    authenticated: false,
    statusCode: 401,
    error: "Unauthorized. An authenticated Supabase session is required to access clinical AI services."
  };
}

// server/api/report-simplify.ts
async function handler(req, res) {
  if (applyCorsHeaders(req, res)) return;
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed. Use POST." });
    return;
  }
  const auth = await authenticateApiRequest(req);
  if (!auth.authenticated) {
    res.status(auth.statusCode || 401).json({ error: auth.error || "Unauthorized access" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (body.base64Data && typeof body.base64Data === "string" && body.base64Data.length > 10 * 1024 * 1024) {
      res.status(413).json({ error: "Payload Too Large. Report document exceeds maximum 10MB limit." });
      return;
    }
    const result = await simplifyMedicalReport(body.base64Data, body.mimeType, body.fileName);
    res.status(200).json(result);
  } catch (error) {
    console.error("API /api/report-simplify error:", error?.message || "Processing failed");
    res.status(500).json({ error: "An error occurred while processing the medical report." });
  }
}
export {
  handler as default
};
