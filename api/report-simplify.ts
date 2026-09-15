import { simplifyMedicalReport } from '../server/geminiService';
import { applyCorsHeaders, authenticateApiRequest } from '../server/apiSecurity';

export default async function handler(req: any, res: any) {
  // 1. Strict CORS validation & OPTIONS preflight
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

  // 3. Payload validation & size limits (Max 10MB base64 payload)
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    if (body.base64Data && typeof body.base64Data === 'string' && body.base64Data.length > 10 * 1024 * 1024) {
      res.status(413).json({ error: 'Payload Too Large. Report document exceeds maximum 10MB limit.' });
      return;
    }

    const result = await simplifyMedicalReport(body.base64Data, body.mimeType, body.fileName);
    res.status(200).json(result);
  } catch (error: any) {
    // Sanitized logging: do not log raw base64 data or patient records
    console.error('API /api/report-simplify error:', error?.message || 'Processing failed');
    res.status(500).json({ error: 'An error occurred while processing the medical report.' });
  }
}
