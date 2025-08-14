import { copy, ensureDir } from 'fs-extra';
import { execSync } from 'child_process';

async function buildForVercel() {
  try {
    // Build the frontend with Vite
    console.log('Building frontend with Vite...');
    execSync('npm run build', { stdio: 'inherit' });

    // Copy server files to root for Vercel to find
    console.log('Copying server files...');
    await copy('server', 'server', { overwrite: true });

    // Copy shared files
    console.log('Copying shared files...');
    await copy('shared', 'shared', { overwrite: true });

    console.log('Build completed successfully!');
    console.log('Vercel will handle the deployment automatically.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForVercel(); 