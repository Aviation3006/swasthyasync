import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const SUPPORTED_TTS_LANGUAGES = ['en-IN', 'hi-IN', 'mr-IN'] as const;
export type SupportedTTSLanguage = typeof SUPPORTED_TTS_LANGUAGES[number];

/**
 * Convert 16-bit linear PCM base64 to standard 44-byte RIFF WAV Data URI
 */
export function pcmToWavDataUri(pcmBase64: string, sampleRate = 24000, numChannels = 1): string {
  const pcmBuffer = Buffer.from(pcmBase64, 'base64');
  const wavHeader = Buffer.alloc(44);
  const dataLength = pcmBuffer.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;

  // RIFF identifier
  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + dataLength, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16);
  wavHeader.writeUInt16LE(1, 20); // PCM
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(16, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(dataLength, 40);

  const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
  return `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
}

export interface TTSRequest {
  text: string;
  languageCode: string;
}

export interface TTSResponse {
  audioData: string;
  mimeType: string;
  languageCode: string;
  model: string;
  isRealAiResponse: boolean;
}

/**
 * Server-side Gemini Cloud TTS generator
 */
export async function generateCloudTTS(params: TTSRequest): Promise<TTSResponse> {
  const { text, languageCode } = params;

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Missing or empty text for speech synthesis.');
  }

  const lang = (languageCode || 'en-IN').trim();
  if (!SUPPORTED_TTS_LANGUAGES.includes(lang as any)) {
    throw new Error(`Unsupported TTS language code: "${lang}". Supported codes: ${SUPPORTED_TTS_LANGUAGES.join(', ')}`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.length < 10) {
    console.error('[Server TTS Error] GEMINI_API_KEY environment variable is not configured or is invalid.');
    throw new Error('GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY in your Vercel Project Settings or server environment.');
  }

  const trimmedText = text.trim().slice(0, 2500);
  console.log(`[Server TTS] Synthesizing audio for lang: ${lang}, textLength: ${trimmedText.length}`);

  const ai = new GoogleGenAI({ apiKey });

  // If text is in English but Hindi/Marathi was requested, guide Gemini to speak in the requested language
  let promptText = trimmedText;
  const isDevanagari = /[\u0900-\u097F]/.test(trimmedText);

  if (lang === 'hi-IN' && !isDevanagari) {
    promptText = `Read this medical summary aloud in clear, standard Hindi (हिन्दी): ${trimmedText}`;
  } else if (lang === 'mr-IN' && !isDevanagari) {
    promptText = `Read this medical summary aloud in clear, standard Marathi (मराठी): ${trimmedText}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ text: promptText }],
      config: {
        responseModalities: ['AUDIO']
      }
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error('Gemini did not return audio data for the requested text.');
    }

    const pcmBase64 = audioPart.inlineData.data;
    const wavDataUri = pcmToWavDataUri(pcmBase64, 24000, 1);

    console.log(`[Server TTS] Successfully synthesized audio for ${lang} (${wavDataUri.length} chars)`);

    return {
      audioData: wavDataUri,
      mimeType: 'audio/wav',
      languageCode: lang,
      model: 'gemini-2.5-flash-preview-tts',
      isRealAiResponse: true
    };
  } catch (err: any) {
    console.error('[Server TTS Error]:', err.message || err);
    throw new Error(err.message || 'Gemini Cloud TTS service encountered an unexpected error.');
  }
}
