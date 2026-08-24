import { generateCloudTTS } from '../server/ttsService';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { text, languageCode } = body;

    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Text is required for TTS synthesis.' });
      return;
    }

    const result = await generateCloudTTS({ text, languageCode });
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API /api/tts error:', error.message || error);
    res.status(500).json({ error: error.message || 'Internal Cloud TTS Error' });
  }
}
