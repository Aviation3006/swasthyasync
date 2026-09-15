// server/ttsService.ts
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
var SUPPORTED_TTS_LANGUAGES = ["en-IN", "hi-IN", "mr-IN"];
function pcmToWavDataUri(pcmBase64, sampleRate = 24e3, numChannels = 1) {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");
  const wavHeader = Buffer.alloc(44);
  const dataLength = pcmBuffer.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  wavHeader.write("RIFF", 0);
  wavHeader.writeUInt32LE(36 + dataLength, 4);
  wavHeader.write("WAVE", 8);
  wavHeader.write("fmt ", 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20);
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(16, 34);
  wavHeader.write("data", 36);
  wavHeader.writeUInt32LE(dataLength, 40);
  const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
  return `data:audio/wav;base64,${wavBuffer.toString("base64")}`;
}
async function generateCloudTTS(params) {
  const { text, languageCode } = params;
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Missing or empty text for speech synthesis.");
  }
  const lang = (languageCode || "en-IN").trim();
  if (!SUPPORTED_TTS_LANGUAGES.includes(lang)) {
    throw new Error(`Unsupported TTS language code: "${lang}". Supported codes: ${SUPPORTED_TTS_LANGUAGES.join(", ")}`);
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here" || apiKey.length < 10) {
    console.error("[Server TTS Error] GEMINI_API_KEY environment variable is not configured or is invalid.");
    throw new Error("GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY in your Vercel Project Settings or server environment.");
  }
  const trimmedText = text.trim().slice(0, 2500);
  console.log(`[Server TTS] Synthesizing audio for lang: ${lang}, textLength: ${trimmedText.length}`);
  const ai = new GoogleGenAI({ apiKey });
  let promptText = trimmedText;
  const isDevanagari = /[\u0900-\u097F]/.test(trimmedText);
  if (lang === "hi-IN" && !isDevanagari) {
    promptText = `Read this medical summary aloud in clear, standard Hindi (\u0939\u093F\u0928\u094D\u0926\u0940): ${trimmedText}`;
  } else if (lang === "mr-IN" && !isDevanagari) {
    promptText = `Read this medical summary aloud in clear, standard Marathi (\u092E\u0930\u093E\u0920\u0940): ${trimmedText}`;
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ text: promptText }],
      config: {
        responseModalities: ["AUDIO"]
      }
    });
    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p) => p.inlineData?.data);
    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error("Gemini did not return audio data for the requested text.");
    }
    const pcmBase64 = audioPart.inlineData.data;
    const wavDataUri = pcmToWavDataUri(pcmBase64, 24e3, 1);
    console.log(`[Server TTS] Successfully synthesized audio for ${lang} (${wavDataUri.length} chars)`);
    return {
      audioData: wavDataUri,
      mimeType: "audio/wav",
      languageCode: lang,
      model: "gemini-2.5-flash-preview-tts",
      isRealAiResponse: true
    };
  } catch (err) {
    console.error("[Server TTS Error]:", err.message || err);
    throw new Error(err.message || "Gemini Cloud TTS service encountered an unexpected error.");
  }
}

// server/apiSecurity.ts
import { createClient } from "@supabase/supabase-js";
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

// server/api/tts.ts
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
    const { text, languageCode } = body;
    if (!text || !text.trim()) {
      res.status(400).json({ error: "Text is required for TTS synthesis." });
      return;
    }
    if (text.length > 1e3) {
      res.status(400).json({ error: "Text exceeds maximum allowable limit of 1,000 characters for voice synthesis." });
      return;
    }
    const result = await generateCloudTTS({ text, languageCode });
    res.status(200).json(result);
  } catch (error) {
    console.error("API /api/tts error:", error?.message || "Processing failed");
    res.status(500).json({ error: "An error occurred during audio synthesis." });
  }
}
export {
  handler as default
};
