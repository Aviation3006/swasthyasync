import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

// Server-Side Supabase Client for JWT verification
let serverSupabaseClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  if (serverSupabaseClient) return serverSupabaseClient;

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && anonKey && url !== 'https://your-project.supabase.co' && !url.includes('placeholder')) {
    serverSupabaseClient = createClient(url, anonKey);
  }
  return serverSupabaseClient;
}

/**
 * Validates request Origin for safe CORS handling
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true; // Direct same-origin or non-browser server-to-server request

  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().toLowerCase())
    : [];

  const lower = origin.toLowerCase();
  if (envOrigins.includes(lower)) return true;

  // Local development
  if (
    lower.startsWith('http://localhost:') ||
    lower.startsWith('http://127.0.0.1:') ||
    lower.startsWith('https://localhost:')
  ) {
    return true;
  }

  // Vercel deployment and preview URLs
  if (lower.endsWith('.vercel.app')) {
    return true;
  }

  return false;
}

/**
 * Applies strict CORS headers to the response
 * Returns true if the request was an OPTIONS preflight that was handled.
 */
export function applyCorsHeaders(req: any, res: any): boolean {
  const origin = req.headers?.origin as string | undefined;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (!origin) {
    // Same origin or server-to-server
    res.setHeader('Vary', 'Origin');
  } else {
    // Untrusted origin: do not set Access-Control-Allow-Origin
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, X-SwasthyaSync-Demo'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin(origin)) {
      res.status(403).json({ error: 'CORS origin not allowed.' });
      return true;
    }
    res.status(204).end();
    return true;
  }

  return false;
}

/**
 * Authenticates request using Supabase JWT verification
 * In Demo Mode (VITE_ENABLE_DEMO_MODE=true), demo evaluations are permitted.
 * In Production Mode (VITE_ENABLE_DEMO_MODE!=true), a valid Supabase JWT is strictly required.
 */
export async function authenticateApiRequest(req: any): Promise<{
  authenticated: boolean;
  userId?: string;
  isDemo?: boolean;
  error?: string;
  statusCode?: number;
}> {
  const isServerDemoMode = process.env.VITE_ENABLE_DEMO_MODE === 'true';

  // 1. Check Authorization Bearer Token
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  let token: string | undefined;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
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
      } catch (err: any) {
        // Token verification failed
      }
    }
  }

  // 2. Demo Evaluation Request Handling (Controlled and isolated)
  const hasDemoHeader = req.headers?.['x-swasthyasync-demo'] === 'true';
  if (isServerDemoMode && (hasDemoHeader || process.env.NODE_ENV === 'development')) {
    return {
      authenticated: true,
      userId: 'demo-evaluator-session',
      isDemo: true
    };
  }

  // 3. Strict Production Fail-Closed
  return {
    authenticated: false,
    statusCode: 401,
    error: 'Unauthorized. An authenticated Supabase session is required to access clinical AI services.'
  };
}
