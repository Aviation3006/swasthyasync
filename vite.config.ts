import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { simplifyMedicalReport, analyzeSymptomPattern, isGeminiConfigured } from './server/geminiService';
import { generateCloudTTS } from './server/ttsService';

dotenv.config();

// Custom Vite Server Plugin for Gemini Backend API
function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-backend-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'online',
            geminiConfigured: isGeminiConfigured,
            environment: process.env.NODE_ENV || 'development'
          }));
          return;
        }

        if (req.url === '/api/tts' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const result = await generateCloudTTS({
                text: data.text,
                languageCode: data.languageCode
              });
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (error: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message || 'Internal Cloud TTS Error' }));
            }
          });
          return;
        }

        if (req.url === '/api/report-simplify' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const result = await simplifyMedicalReport(
                data.base64Data,
                data.mimeType,
                data.fileName
              );
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (error: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message || 'Internal AI Server Error' }));
            }
          });
          return;
        }

        if (req.url === '/api/symptom-analysis' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const result = await analyzeSymptomPattern(data);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (error: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message || 'Internal AI Server Error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), geminiApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react', 'qrcode.react']
        }
      }
    }
  }
});
