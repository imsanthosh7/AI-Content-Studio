import { build } from 'esbuild';
import { copy } from 'fs-extra';
import { resolve } from 'path';

async function buildForVercel() {
    try {
        // Build the frontend
        console.log('Building frontend...');
        await build({
            entryPoints: ['client/index.html'],
            bundle: false,
            outdir: 'dist/public',
            platform: 'browser',
            format: 'esm',
        });

        // Build the backend
        console.log('Building backend...');
        await build({
            entryPoints: ['server/index.ts'],
            bundle: true,
            outdir: 'dist',
            platform: 'node',
            format: 'esm',
            external: ['@google/genai', 'express', 'dotenv'],
            target: 'node18',
        });

        // Copy static assets
        console.log('Copying static assets...');
        await copy('client', 'dist/public', { overwrite: true });
        await copy('shared', 'dist/shared', { overwrite: true });

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildForVercel(); 