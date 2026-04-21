import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const astroBin = path.join(rootDir, 'node_modules', 'astro', 'astro.js');

const [, , command = 'dev', ...rest] = process.argv;
const env = { ...process.env };
const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '', 10);
const viteEsbuildBin = path.join(
  rootDir,
  'node_modules',
  'vite',
  'node_modules',
  '@esbuild',
  'win32-x64',
  'esbuild.exe'
);

// Some Windows sessions keep a broken ESBUILD_BINARY_PATH with escaped quotes.
// Astro/Vite inherit it and esbuild then tries to execute an invalid path.
delete env.ESBUILD_BINARY_PATH;

if (process.platform === 'win32') {
  env.ESBUILD_BINARY_PATH = viteEsbuildBin;
}

if (nodeMajor !== 20) {
  console.error(
    [
      `[run-astro] Este proyecto necesita Node 20.x para levantar Astro/Vite en Windows.`,
      `[run-astro] Version detectada: ${process.version}.`,
      `[run-astro] Con Node ${nodeMajor || 'desconocido'} suele explotar con "The service is no longer running" o "spawn EPERM" de esbuild.`,
      `[run-astro] Cambia a Node 20 y volve a correr el comando.`,
      `[run-astro] Si PowerShell bloquea npm.ps1, usa: npm.cmd run ${command}`
    ].join('\n')
  );
  process.exit(1);
}

const child = spawn(process.execPath, [astroBin, command, ...rest], {
  cwd: rootDir,
  stdio: 'inherit',
  env
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error('[run-astro] No se pudo iniciar Astro:', error);
  process.exit(1);
});
