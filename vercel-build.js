import { copy, ensureDir } from 'fs-extra';
import { execSync } from 'child_process';

async function buildForVercel() {
  try {
    // Ensure output directories exist
    await ensureDir('dist');
    await ensureDir('dist/public');

    // Build the frontend with Vite
    console.log('Building frontend with Vite...');
    execSync('npm run build', { stdio: 'inherit' });

    // Copy server files without bundling (let Vercel handle it)
    console.log('Copying server files...');
    await copy('server', 'dist/server', { overwrite: true });

    // Copy shared files
    console.log('Copying shared files...');
    await copy('shared', 'dist/shared', { overwrite: true });

    // Copy package.json for dependencies
    console.log('Copying package.json...');
    await copy('package.json', 'dist/package.json', { overwrite: true });

    // Create vercel.json in dist for proper routing
    const vercelConfig = {
      version: 2,
      routes: [
        {
          src: "/api/(.*)",
          dest: "/server/index.ts"
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