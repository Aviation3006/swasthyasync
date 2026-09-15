import { analyzeSymptomPattern } from '../geminiService';
import { applyCorsHeaders, authenticateApiRequest } from '../apiSecurity';

export default async function handler(req: any, res: any) {
  // 1. Strict CORS validation & OPTIONS preflight (eliminates wildcard credentials vulnerability)
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  // 2. Server-side Supabase JWT Authentication & Authorization
  const auth = await authenticateApiRequest(req);
  if (!auth.authenticated) {
    res.status(auth.statusCode || 401).json({ error: auth.error || 'Unauthorized access' });
    return;
  }

  // 3. Payload validation & character limits (Max 5,000 characters)
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    const textToValidate = body.transcript || body.text || '';
    if (typeof textToValidate === 'string' && textToValidate.length > 5000) {
      res.status(400).json({ error: 'Payload exceeds maximum allowable limit of 5,000 characters.' });
      return;
    }

    const result = await analyzeSymptomPattern(body);
    res.status(200).json(result);
  } catch (error: any) {
    // Sanitized logging: do not log patient symptom descriptions
    console.error('API /api/symptom-analysis error:', error?.message || 'Processing failed');
    res.status(500).json({ error: 'An error occurred while analyzing symptoms.' });
  }
}
