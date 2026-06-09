import type { APIRoute } from 'astro';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || path.resolve(process.cwd(), 'uploads'));

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
};

export const GET: APIRoute = async ({ params }) => {
  const relativePath = params.path ?? '';
  const fullPath = path.resolve(UPLOADS_DIR, relativePath);

  // Evita path traversal: el archivo debe quedar dentro de UPLOADS_DIR.
  if (fullPath !== UPLOADS_DIR && !fullPath.startsWith(UPLOADS_DIR + path.sep)) {
    return new Response('No encontrado', { status: 404 });
  }

  try {
    const fileStat = await stat(fullPath);

    if (!fileStat.isFile()) {
      return new Response('No encontrado', { status: 404 });
    }

    const data = await readFile(fullPath);
    const extension = path.extname(fullPath).toLowerCase();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': CONTENT_TYPE_BY_EXT[extension] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return new Response('No encontrado', { status: 404 });
  }
};
