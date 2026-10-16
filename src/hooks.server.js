import { redirect, error } from '@sveltejs/kit';
import { resolveSession } from '$lib/server/auth.js';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// 1. Resolve session from cookies and populate event.locals.user
	const user = resolveSession(event.cookies);
	event.locals.user = user;

	const { pathname } = event.url;

	// 2. Protected routes requiring authentication
	const isProtectedRoute =
		pathname === '/dashboard' ||
		pathname.startsWith('/dashboard/') ||
		pathname === '/profile' ||
		pathname.startsWith('/profile/') ||
		pathname === '/users' ||
		pathname.startsWith('/users/') ||
		pathname === '/admin' ||
		pathname.startsWith('/admin/');

	if (isProtectedRoute && !user) {
		throw redirect(303, '/login');
	}

	// 3. Admin-only routes
	if (pathname === '/admin' || pathname.startsWith('/admin/')) {
		if (user.role !== 'admin') {
			throw error(403, 'Forbidden: Administrator access required');
		}
	}

	// 4. Authenticated users should not visit login or register
	if (user && (pathname === '/login' || pathname === '/register')) {
		throw redirect(303, '/dashboard');
	}

	// 5. Proceed with normal request resolution
	return resolve(event);
}
