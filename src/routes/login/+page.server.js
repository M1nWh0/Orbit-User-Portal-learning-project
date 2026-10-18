import { fail, redirect } from '@sveltejs/kit';
import { verifyCredentials } from '$lib/server/store.js';
import { createSession } from '$lib/server/auth.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// Guard against authenticated users visiting login page
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || typeof email !== 'string' || !email.trim()) {
			return fail(400, {
				message: 'Email address is required.',
				email: typeof email === 'string' ? email : ''
			});
		}

		if (!password || typeof password !== 'string') {
			return fail(400, {
				message: 'Password is required.',
				email: email.trim()
			});
		}

		const result = await verifyCredentials(email, password);

		if (!result.success) {
			if (result.reason === 'inactive') {
				return fail(403, {
					message: 'This account has been deactivated. Please contact an administrator.',
					email: email.trim()
				});
			}

			return fail(400, {
				message: 'Invalid email address or password.',
				email: email.trim()
			});
		}

		// Issue session token and cookie
		createSession(result.user.id, cookies);

		// Redirect to dashboard
		throw redirect(303, '/dashboard');
	}
};
