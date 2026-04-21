import type { APIRoute } from 'astro';
import { db } from '../../../../lib/database';

function getTransactionId(idParam: string | undefined) {
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID de transaccion invalido');
  }

  return id;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error desconocido';
}

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = getTransactionId(params.id);
    const deleted = await db.treasury.delete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Transaccion no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

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
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
