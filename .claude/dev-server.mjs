// Preview-only launcher: runs Astro dev with Node != 20 by bypassing the
// version guard in scripts/run-astro.mjs. Sets the esbuild binary path the
// same way run-astro does for Windows. Not used by npm scripts.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const astroBin = path.join(rootDir, 'node_modules', 'astro', 'astro.js');

const env = { ...process.env };
delete env.ESBUILD_BINARY_PATH;
if (process.platform === 'win32') {
  env.ESBUILD_BINARY_PATH = path.join(
    rootDir,
    'node_modules',
    'vite',
    'node_modules',
    '@esbuild',
    'win32-x64',
    'esbuild.exe'
  );
}

const child = spawn(process.execPath, [astroBin, 'dev', ...process.argv.slice(2)], {
  cwd: rootDir,
  stdio: 'inherit',
  env
});

child.on('exit', (code) => process.exit(code ?? 0));
