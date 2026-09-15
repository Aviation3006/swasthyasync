const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const endpoints = [
  { src: 'server/api/health.ts', dest: 'api/health.js' },
  { src: 'server/api/report-simplify.ts', dest: 'api/report-simplify.js' },
  { src: 'server/api/symptom-analysis.ts', dest: 'api/symptom-analysis.js' },
  { src: 'server/api/tts.ts', dest: 'api/tts.js' }
];

async function build() {
  const apiDir = path.resolve('api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  for (const ep of endpoints) {
    const srcPath = path.resolve(ep.src);
    const destPath = path.resolve(ep.dest);

    await esbuild.build({
      entryPoints: [srcPath],
      outfile: destPath,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node20',
      external: ['@google/genai', '@supabase/supabase-js', 'dotenv'],
      define: {
        'process.env.VITE_ENABLE_DEMO_MODE': '"true"',
        'process.env.ALLOWED_ORIGINS': '"https://swasthyasync-dusky.vercel.app"'
      }
    });

    const stat = fs.statSync(destPath);
    console.log(`✓ Bundled ${ep.dest} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

build().catch(err => {
  console.error('API build failed:', err);
  process.exit(1);
});
