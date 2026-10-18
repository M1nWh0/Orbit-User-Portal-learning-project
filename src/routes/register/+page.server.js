import { fail, redirect } from '@sveltejs/kit';
import { createUser } from '$lib/server/store.js';
import { createSession } from '$lib/server/auth.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		const safeName = typeof name === 'string' ? name.trim() : '';
		const safeEmail = typeof email === 'string' ? email.trim() : '';

		// 1. Validate presence
		if (!safeName) {
			return fail(400, {
				message: 'Display name is required.',
				name: safeName,
				email: safeEmail
			});
		}

		if (!safeEmail || !safeEmail.includes('@') || !safeEmail.includes('.')) {
			return fail(400, {
				message: 'A valid email address is required.',
				name: safeName,
				email: safeEmail
			});
		}

		if (!password || typeof password !== 'string' || password.length < 6) {
			return fail(400, {
				message: 'Password must be at least 6 characters long.',
				name: safeName,
				email: safeEmail
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match.',
				name: safeName,
				email: safeEmail
			});
		}

		// 2. Create user (Strictly enforced role: 'user')
		try {
			const newUser = await createUser({
				name: safeName,
				email: safeEmail,
				password,
				role: 'user',
				status: 'active',
				bio: ''
			});

			// 3. Automatically authenticate new user
			createSession(newUser.id, cookies);
		} catch (err) {
			return fail(400, {
				message: err.message || 'Failed to create account.',
				name: safeName,
				email: safeEmail
			});
		}

		// 4. Redirect to dashboard
		throw redirect(303, '/dashboard');
	}
};
