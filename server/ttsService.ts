import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const isGeminiTtsConfigured = Boolean(
  apiKey &&
  apiKey !== 'your-gemini-api-key-here' &&
  apiKey.length > 10
);

const ai = isGeminiTtsConfigured ? new GoogleGenAI({ apiKey }) : null;

export const SUPPORTED_TTS_LANGUAGES = ['en-IN', 'hi-IN', 'mr-IN'] as const;
export type SupportedTTSLanguage = typeof SUPPORTED_TTS_LANGUAGES[number];

/**
 * Convert 16-bit linear PCM base64 string to standard WAV container Data URI (44-byte RIFF header)
 */
export function pcmToWavDataUri(pcmBase64: string, sampleRate = 24000, numChannels = 1): string {
  const pcmBuffer = Buffer.from(pcmBase64, 'base64');
  const wavHeader = Buffer.alloc(44);
  const dataLength = pcmBuffer.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;

  // RIFF identifier
  wavHeader.write('RIFF', 0);
  // File length minus RIFF identifier & length fields (36 + data length)
  wavHeader.writeUInt32LE(36 + dataLength, 4);
  // RIFF type
  wavHeader.write('WAVE', 8);
  // Format chunk identifier
  wavHeader.write('fmt ', 12);
  // Format chunk length
  wavHeader.writeUInt32LE(16, 16);
  // Sample format (1 = PCM)
  wavHeader.writeUInt16LE(1, 20);
  // Channel count (1 = mono)
  wavHeader.writeUInt16LE(numChannels, 22);
  // Sample rate (24000 Hz)
  wavHeader.writeUInt32LE(sampleRate, 24);
  // Byte rate (sampleRate * blockAlign)
  wavHeader.writeUInt32LE(byteRate, 28);
  // Block align (numChannels * bytesPerSample)
  wavHeader.writeUInt16LE(blockAlign, 32);
  // Bits per sample (16-bit)
  wavHeader.writeUInt16LE(16, 34);
  // Data chunk identifier
  wavHeader.write('data', 36);
  // Data chunk length
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
 * Server-side speech generation using Gemini Cloud TTS
 */
export async function generateCloudTTS(params: TTSRequest): Promise<TTSResponse> {
  const { text, languageCode } = params;

  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Missing or empty text for speech synthesis.');
  }

  // Validate language code
  const lang = (languageCode || 'en-IN').trim();
  if (!SUPPORTED_TTS_LANGUAGES.includes(lang as any)) {
    throw new Error(`Unsupported TTS language code: "${lang}". Supported: ${SUPPORTED_TTS_LANGUAGES.join(', ')}`);
  }

  // Enforce reasonable text limit (max 2500 characters)
  const trimmedText = text.trim().slice(0, 2500);

  if (!isGeminiTtsConfigured || !ai) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in your server environment.');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ text: trimmedText }],
      config: {
        responseModalities: ['AUDIO']
      }
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error('Gemini did not return audio data for the requested text.');
    }

    const pcmBase64 = audioPart.inlineData.data;
    const wavDataUri = pcmToWavDataUri(pcmBase64, 24000, 1);

    return {
      audioData: wavDataUri,
      mimeType: 'audio/wav',
      languageCode: lang,
      model: 'gemini-2.5-flash-preview-tts',
      isRealAiResponse: true
    };
  } catch (err: any) {
    console.error('Error generating Gemini Cloud TTS:', err);
    throw new Error(err.message || 'Gemini Cloud TTS service encountered an unexpected error.');
  }
}
