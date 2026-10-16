import { redirect, error } from '@sveltejs/kit';
import {
	createSessionRecord,
	getSessionRecord,
	deleteSessionRecord,
	getUserById,
	toSafeUser
} from './store.js';

export const SESSION_COOKIE_NAME = 'session_id';

const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
	secure: process.env.NODE_ENV === 'production'
};

/**
 * Creates a new session for a user and sets the HttpOnly session cookie.
 * @param {string} userId - Unique identifier of the user
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
 * @returns {import('./store.js').SessionRecord} The created session record
 */
export function createSession(userId, cookies) {
	if (!userId) {
		throw new Error('User ID is required to create a session');
	}

	const session = createSessionRecord(userId);
	cookies.set(SESSION_COOKIE_NAME, session.sessionId, COOKIE_OPTIONS);
	return session;
}

/**
 * Resolves the authenticated user from the session cookie.
 * If the session is missing, expired, or the user is inactive/not found,
 * invalidates the session, clears the cookie, and returns null.
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
 * @returns {import('./store.js').SafeUser | null} The safe authenticated user or null
 */
export function resolveSession(cookies) {
	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) {
		return null;
	}

	const session = getSessionRecord(sessionId);
	if (!session) {
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	const user = getUserById(session.userId);
	if (!user || user.status !== 'active') {
		// Revoke the session record and purge cookie if user is missing or deactivated
		deleteSessionRecord(sessionId);
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	return toSafeUser(user);
}

/**
 * Destroys the current session and clears the session cookie.
 * @param {import('@sveltejs/kit').Cookies} cookies - SvelteKit cookies object
 * @returns {void}
 */
export function destroySession(cookies) {
	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	if (sessionId) {
		deleteSessionRecord(sessionId);
	}
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Access control helper to require an authenticated user.
 * Throws a redirect to /login if unauthenticated.
 * @param {App.Locals} locals - SvelteKit request locals
 * @returns {import('./store.js').SafeUser} The safe authenticated user
 */
export function requireUser(locals) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	return locals.user;
}

/**
 * Access control helper to require an active administrator account.
 * Throws redirect to /login if unauthenticated, or 403 Forbidden if not an administrator.
 * @param {App.Locals} locals - SvelteKit request locals
 * @returns {import('./store.js').SafeUser} The safe administrator user
 */
export function requireAdmin(locals) {
	const user = requireUser(locals);
	if (user.role !== 'admin') {
		throw error(403, 'Forbidden: Administrator access required');
	}
	return user;
}
