import { generateCloudTTS } from '../server/ttsService';
import { applyCorsHeaders, authenticateApiRequest } from '../server/apiSecurity';

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

  // 3. Payload validation & character limits (Max 1,000 characters)
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, languageCode } = body;

    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Text is required for TTS synthesis.' });
      return;
    }

    if (text.length > 1000) {
      res.status(400).json({ error: 'Text exceeds maximum allowable limit of 1,000 characters for voice synthesis.' });
      return;
    }

    const result = await generateCloudTTS({ text, languageCode });
    res.status(200).json(result);
  } catch (error: any) {
    // Sanitized logging: do not log spoken text or secrets
    console.error('API /api/tts error:', error?.message || 'Processing failed');
    res.status(500).json({ error: 'An error occurred during audio synthesis.' });
  }
}
