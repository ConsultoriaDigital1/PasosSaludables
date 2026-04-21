import 'dotenv/config';
import type { APIRoute } from 'astro';

function getCredential(name: 'username' | 'password') {
  if (name === 'username') {
    return (
      process.env.AUTH_USERNAME ||
      process.env.ADMIN_USERNAME ||
      'admin'
    );
  }

  return (
    process.env.AUTH_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    'admin123'
  );
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    if (
      username === getCredential('username') &&
      password === getCredential('password')
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Credenciales validas'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Credenciales incorrectas'
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al validar la sesion'
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
