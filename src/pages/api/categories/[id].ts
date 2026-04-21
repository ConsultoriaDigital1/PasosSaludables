import type { APIRoute } from 'astro';
import { db } from '../../../lib/database';

function getCategoryId(idParam: string | undefined) {
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('ID de categoria invalido');
  }

  return id;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error desconocido';
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = getCategoryId(params.id);
    const category = await db.categories.getById(id);

    if (!category) {
      return new Response(JSON.stringify({ error: 'Categoria no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(category), {
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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const id = getCategoryId(params.id);
    const payload = await request.json();
    const updated = await db.categories.update(id, payload);

    if (!updated) {
      return new Response(JSON.stringify({ error: 'Categoria no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(updated), {
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const id = getCategoryId(params.id);
    const deleted = await db.categories.delete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Categoria no encontrada' }), {
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
