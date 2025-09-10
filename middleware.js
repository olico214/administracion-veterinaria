import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const { pathname } = request.nextUrl;

    // ESCENARIO 1: El usuario TIENE token y está en la página de login ('/').
    // ACCIÓN: Redirigirlo a la aplicación principal ('/veterinaria').
    if (tokenCookie && pathname === '/') {
        return NextResponse.redirect(new URL('/veterinaria', request.url));
    }

    // ESCENARIO 2: El usuario NO TIENE token y está intentando acceder a una ruta protegida.
    // ACCIÓN: Redirigirlo a la página de login ('/').
    if (!tokenCookie && pathname.startsWith('/veterinaria')) {
        // Evita bucles infinitos si la página de login estuviera protegida por error.
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Si ninguno de los escenarios anteriores se cumple, permite que la solicitud continúe.
    return NextResponse.next();
}

// ¡IMPORTANTE! Actualiza el matcher para que el middleware se ejecute en AMBAS rutas.
export const config = {
    matcher: [
        /*
         * El middleware se ejecutará en:
         * - La página principal ('/')
         * - Todas las rutas que comiencen con '/veterinaria'
         */
        '/',
        '/veterinaria/:path*',
    ],
};