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
async function analyzeVoiceSymptomTranscript(params) {
  const { transcript, language = "en-IN" } = params;
  const cleanTranscript = (transcript || "").trim();
  if (!cleanTranscript) {
    throw new Error("Transcript is required for voice symptom analysis.");
  }
  const ai = getGeminiClient();
  if (!ai) {
    return {
      clinicalOverview: `Reported symptoms from user description: "${cleanTranscript}". No automated diagnosis is rendered.`,
      symptoms: [
        {
          name: cleanTranscript.split(" ")[0] || "Reported Symptom",
          description: cleanTranscript,
          duration: "Not mentioned",
          severity: "Not mentioned",
          onset: "Not mentioned",
          associatedSymptoms: []
        }
      ],
      relevantContext: [
        "User provided a natural spoken symptom description without diagnostic claims."
      ],
      suggestedQuestions: [
        "What could be contributing to these symptoms?",
        "Should I monitor any specific warning signs or progression?",
        "Are there any tests or clinical evaluations that may be appropriate?"
      ],
      missingInformation: [
        "Exact duration / timeline of symptom onset",
        "Severity level on a scale from mild to severe",
        "Known triggers, aggravating factors, or relieving postures"
      ],
      urgencyLevel: /chest pain|breathless|unconscious|severe bleed|stroke/i.test(cleanTranscript) ? "Emergency 108" : "Routine",
      disclaimer: "AI-generated summaries are for informational purposes and are not a medical diagnosis. Consult a qualified healthcare professional for medical advice.",
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
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return {
      ...parsed,
      isRealAiResponse: true
    };
  } catch (err) {
    console.error("Error executing Gemini voice symptom analysis:", err);
    throw err;
  }
}
async function analyzeSymptomPattern(data) {
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
      summary: `[DEMO MODE] You recorded ${symptomData.symptomName || "symptom"} in the ${symptomData.bodyArea || "body"} region (${symptomData.severity || "Mild"} severity, lasting ${symptomData.duration || "Not mentioned"}).`,
      summaryMarathi: `[\u0921\u0947\u092E\u094B \u092E\u094B\u0921] \u0924\u0941\u092E\u094D\u0939\u0940 ${symptomData.bodyArea || "\u0936\u0930\u0940\u0930"} \u092D\u093E\u0917\u093E\u0924\u0940\u0932 ${symptomData.symptomName || "\u0932\u0915\u094D\u0937\u0923"} \u0928\u094B\u0902\u0926\u0935\u0932\u0947 \u0906\u0939\u0947.`,
      generalInsights: [
        "Symptoms lasting multiple days are best evaluated in context with your medical history.",
        "Tracking aggravating activities provides valuable diagnostic context for your physician."
      ],
      doctorQuestions: [
        `How long has this ${symptomData.symptomName || "symptom"} been occurring?`,
        "Are there specific home remedies or resting positions that ease the discomfort?"
      ],
      safetyAdvisory: symptomData.severity === "Critical" || symptomData.severity === "Severe" ? "URGENT: Severe or rapidly worsening symptoms warrant immediate evaluation at the nearest hospital emergency casualty or calling 108." : "If symptoms persist or worsen, schedule an outpatient OPD consultation.",
      urgencyLevel: symptomData.severity === "Critical" ? "Emergency 108" : symptomData.severity === "Severe" ? "Prompt Attention" : "Routine",
      disclaimer: "DEMO NOTICE: SwasthyaSync Symptom Logger is for personal health tracking only and does not provide automated diagnoses. Dial 108 in emergencies.",
      isRealAiResponse: false
    };
  }
  try {
    const prompt = `You are a clinical preparation assistant for SwasthyaSync (Maharashtra Public Health Portal).
The user recorded a symptom entry in their diary:
- Body Region: ${symptomData.bodyArea || "General"}
- Symptom Name: ${symptomData.symptomName || "Symptom"}
- Severity: ${symptomData.severity || "Not mentioned"}
- Duration: ${symptomData.duration || "Not mentioned"}
- First Started: ${symptomData.startDate || "Not mentioned"}
- Associated Symptoms: ${(symptomData.associatedSymptoms || []).join(", ") || "None"}
- Notes/Triggers: ${symptomData.triggersOrNotes || "None"}

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
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return {
      ...parsed,
      isRealAiResponse: true
    };
  } catch (error) {
    console.error("Error executing Gemini symptom analysis:", error);
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
  const envOrigins = "https://swasthyasync-dusky.vercel.app" ? "https://swasthyasync-dusky.vercel.app".split(",").map((o) => o.trim().toLowerCase()) : [];
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
  const isServerDemoMode = true;
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

// server/api/symptom-analysis.ts
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
    const textToValidate = body.transcript || body.text || "";
    if (typeof textToValidate === "string" && textToValidate.length > 5e3) {
      res.status(400).json({ error: "Payload exceeds maximum allowable limit of 5,000 characters." });
      return;
    }
    const result = await analyzeSymptomPattern(body);
    res.status(200).json(result);
  } catch (error) {
    console.error("API /api/symptom-analysis error:", error?.message || "Processing failed");
    res.status(500).json({ error: "An error occurred while analyzing symptoms." });
  }
}
export {
  handler as default
};
