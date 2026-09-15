import { isGeminiConfigured } from '../geminiService';
import { applyCorsHeaders } from '../apiSecurity';

export default async function handler(req: any, res: any) {
  if (applyCorsHeaders(req, res)) return;

  res.status(200).json({
    status: 'online',
    geminiConfigured: isGeminiConfigured,
    environment: process.env.NODE_ENV || 'production'
  });
}
