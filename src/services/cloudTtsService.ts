/**
 * SwasthyaSync Cloud TTS Client Service
 * Calls server-side /api/tts (Gemini 2.5 Flash TTS) with in-memory caching
 */

export interface CloudTTSRequest {
  text: string;
  languageCode: 'en-IN' | 'hi-IN' | 'mr-IN' | string;
}

export interface CloudTTSResponse {
  audioData: string;
  mimeType: string;
  languageCode: string;
  model: string;
  isRealAiResponse?: boolean;
}

// In-memory audio session cache to prevent redundant requests
const audioCache = new Map<string, string>();

/**
 * Clean & normalize text for synthesis
 */
export function cleanTextForCloudTTS(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/[#*_~`]/g, '') // remove markdown symbols
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // convert markdown links
    .replace(/•|\*|-/g, ' ') // convert bullets to spaces
    .replace(/\s+/g, ' ') // normalize spaces
    .replace(/(\d+)\/(\d+)\s*mmHg/gi, '$1 over $2 millimeters of mercury')
    .replace(/mg\/dL/gi, 'milligrams per deciliter')
    .replace(/g\/dL/gi, 'grams per deciliter')
    .replace(/°F/g, 'degrees Fahrenheit')
    .replace(/°C/g, 'degrees Celsius')
    .replace(/%\s*/g, ' percent ')
    .trim();
}

/**
 * Request Cloud TTS speech audio from server /api/tts
 */
export async function fetchCloudTTSAudio(params: CloudTTSRequest): Promise<string> {
  const cleaned = cleanTextForCloudTTS(params.text);
  if (!cleaned) {
    throw new Error('No text provided for audio synthesis.');
  }

  const langCode = params.languageCode || 'en-IN';
  const cacheKey = `${langCode}:${cleaned}`;

  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: cleaned,
        languageCode: langCode
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `TTS server responded with HTTP status ${res.status}`);
    }

    const data: CloudTTSResponse = await res.json();
    if (!data.audioData) {
      throw new Error('No audio data received from Cloud TTS service.');
    }

    audioCache.set(cacheKey, data.audioData);
    return data.audioData;
  } catch (error: any) {
    console.error('fetchCloudTTSAudio error:', error);
    throw error;
  }
}
