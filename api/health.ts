import { isGeminiConfigured } from '../server/geminiService';

export default async function handler(req: any, res: any) {
  res.status(200).json({
    status: 'online',
    geminiConfigured: isGeminiConfigured,
    environment: process.env.NODE_ENV || 'production'
  });
}
