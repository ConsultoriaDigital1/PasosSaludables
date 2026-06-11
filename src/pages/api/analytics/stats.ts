import type { APIRoute } from 'astro';
import { db } from '../../../lib/database';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error desconocido';
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const days = Number(url.searchParams.get('days') || 30);
    const data = await db.analytics.getStats(Number.isFinite(days) ? days : 30);

    return new Response(JSON.stringify(data), {
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
