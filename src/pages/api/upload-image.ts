import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se proporcionó archivo' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Solo se permiten imágenes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'El archivo es demasiado grande (máx 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `products/product_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type
    });

    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return new Response(JSON.stringify({ error: 'Error al subir la imagen' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
