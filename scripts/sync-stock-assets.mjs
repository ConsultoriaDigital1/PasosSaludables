import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const destinationDir = path.join(projectRoot, 'public', 'assets');

const candidateSources = [
  process.env.STOCK_ASSETS_DIR,
  path.resolve(projectRoot, '../PasosSaludablesStock/img')
].filter(Boolean);

async function main() {
  const sourceDir = await findExistingSource(candidateSources);

  if (!sourceDir) {
    console.warn(
      '[sync:assets] No encontre una carpeta de assets para sincronizar. ' +
        'Define STOCK_ASSETS_DIR o mantene ../PasosSaludablesStock/img.'
    );
    return;
  }

  await fs.mkdir(path.dirname(destinationDir), { recursive: true });
  const summary = {
    copied: 0,
    skippedLocked: 0
  };

  await syncDirectory(sourceDir, destinationDir, summary);

  const totalFiles = await countFiles(destinationDir);
  console.log(
    `[sync:assets] Assets sincronizados desde ${sourceDir} hacia ${destinationDir} (${totalFiles} archivos, ${summary.copied} copiados, ${summary.skippedLocked} bloqueados).`
  );
}

async function findExistingSource(candidates) {
  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);

      if (stats.isDirectory()) {
        return candidate;
      }
    } catch {
      // Sigue con el siguiente candidato.
    }
  }

  return '';
}

async function countFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  let total = 0;

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      total += await countFiles(fullPath);
      continue;
    }

    total += 1;
  }

  return total;
}

async function syncDirectory(sourceDir, targetDir, summary) {
  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await syncDirectory(sourcePath, targetPath, summary);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    try {
      await fs.copyFile(sourcePath, targetPath);
      summary.copied += 1;
    } catch (error) {
      if (isLockedFileError(error)) {
        summary.skippedLocked += 1;
        console.warn(
          `[sync:assets] Se omite ${targetPath} porque esta bloqueado por otro proceso.`
        );
        continue;
      }

      throw error;
    }
  }
}

function isLockedFileError(error) {
  if (!(error instanceof Error) || !('code' in error)) {
    return false;
  }

  return ['EBUSY', 'EPERM', 'EACCES'].includes(error.code);
}

main().catch((error) => {
  console.error(
    '[sync:assets] Fallo la sincronizacion:',
    error instanceof Error ? error.message : error
  );
  process.exitCode = 1;
});
