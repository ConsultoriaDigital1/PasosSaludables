import type { APIRoute } from 'astro';
import { ensureSchema } from '../../lib/database';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error desconocido';
}

export const POST: APIRoute = async () => {
  try {
    await ensureSchema();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: getErrorMessage(error)
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify({
      message: 'Usa POST para asegurar el esquema.'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
