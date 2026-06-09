import type { APIRoute } from 'astro';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.resolve(process.cwd(), 'uploads');
const MAX_SIZE = 50 * 1024 * 1024;

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return json({ error: 'No se recibio ninguna imagen' }, 400);
    }

    const extension = EXTENSION_BY_TYPE[file.type];

    if (!extension) {
      return json({ error: 'Tipo de archivo no permitido (usa JPG, PNG, WEBP o GIF)' }, 400);
    }

    if (file.size > MAX_SIZE) {
      return json({ error: 'La imagen es demasiado grande (max 50 MB)' }, 400);
    }

    const filename = `product_${Date.now()}_${randomUUID().slice(0, 8)}.${extension}`;
    const targetDir = path.join(UPLOADS_DIR, 'products');
    await mkdir(targetDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(targetDir, filename), buffer);

    return json({ url: `/uploads/products/${filename}` }, 200);
  } catch (error) {
    console.error('Error al subir imagen:', error);
    const message = error instanceof Error ? error.message : 'Error al subir la imagen';
    return json({ error: message }, 400);
  }
};
