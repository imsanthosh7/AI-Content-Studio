import { build } from 'esbuild';
import { copy, ensureDir } from 'fs-extra';
import { resolve } from 'path';

async function buildForVercel() {
  try {
    // Ensure output directories exist
    await ensureDir('dist');
    await ensureDir('dist/public');
    
    // Build the frontend with Vite
    console.log('Building frontend with Vite...');
    const { execSync } = await import('child_process');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Build the backend API
    console.log('Building backend API...');
    await build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      outdir: 'dist',
      platform: 'node',
      format: 'esm',
      external: ['@google/genai', 'express', 'dotenv'],
      target: 'node18',
      minify: false,
    });
    
    // Copy shared files
    console.log('Copying shared files...');
    await copy('shared', 'dist/shared', { overwrite: true });
    
    // Create vercel.json in dist for proper routing
    const vercelConfig = {
      version: 2,
      routes: [
        {
          src: "/api/(.*)",
          dest: "/index.js"
        },
        {
          src: "/(.*)",
          dest: "/public/$1"
        }
      ]
    };
    
    await import('fs').then(fs => 
      fs.writeFileSync('dist/vercel.json', JSON.stringify(vercelConfig, null, 2))
    );
    
    console.log('Build completed successfully!');
    console.log('Output directory: dist/');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForVercel(); 