import { simplifyMedicalReport } from '../server/geminiService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const result = await simplifyMedicalReport(body.base64Data, body.mimeType, body.fileName);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API /api/report-simplify error:', error);
    res.status(500).json({ error: error.message || 'Internal Report Simplification Error' });
  }
}
