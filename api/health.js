// server/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.production") });
var isGeminiConfigured = Boolean(
  process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here" && process.env.GEMINI_API_KEY.length > 10
);

// server/apiSecurity.ts
import { createClient } from "@supabase/supabase-js";
import dotenv2 from "dotenv";
import path2 from "path";
dotenv2.config();
dotenv2.config({ path: path2.resolve(process.cwd(), ".env.production") });
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

// server/api/health.ts
async function handler(req, res) {
  if (applyCorsHeaders(req, res)) return;
  res.status(200).json({
    status: "online",
    geminiConfigured: isGeminiConfigured,
    environment: process.env.NODE_ENV || "production"
  });
}
export {
  handler as default
};
