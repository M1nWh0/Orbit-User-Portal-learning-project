import { json } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth.js';

/**
 * Scenario D: Session Cookie Omitted debugging endpoint.
 * Compares session resolution between requests with credentials vs credentials: 'omit'.
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ cookies, locals }) {
	const cookieValue = cookies.get(SESSION_COOKIE_NAME);
	const hasCookie = Boolean(cookieValue);
	const user = locals.user;

	return json(
		{
			success: true,
			code: hasCookie ? 'COOKIE_TRANSMITTED' : 'COOKIE_OMITTED',
			hasSessionCookie: hasCookie,
			cookieName: SESSION_COOKIE_NAME,
			cookiePreview: hasCookie ? `${cookieValue.slice(0, 8)}...` : null,
			isAuthenticated: Boolean(user),
			user: user
				? {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role
					}
				: null,
			diagnostic: {
				credentialsMode: hasCookie
					? 'include / same-origin (Cookie transmitted)'
					: "omit (Cookie explicitly omitted by client fetch options: credentials: 'omit')",
				lifecycleStage: 'hooks.server.js -> handle() -> resolveSession(cookies)',
				explanation: hasCookie
					? 'The browser automatically included the HttpOnly session cookie in the HTTP Request Header. Server hooks successfully looked up the session in memory and set event.locals.user.'
					: 'The client explicitly suppressed cookie transmission via credentials: "omit". Server hooks received no session cookie, leaving event.locals.user as null (Anonymous request).'
			}
		},
		{ status: 200 }
	);
}
