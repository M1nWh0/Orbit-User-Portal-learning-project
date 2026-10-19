import { fail } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth.js';
import { updateUserProfile, getUserById, toSafeUser } from '$lib/server/store.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	const user = requireUser(locals);
	depends('app:users');

	// Fresh fetch from store in case user was updated
	const freshUser = getUserById(user.id);

	return {
		user: toSafeUser(freshUser) || user
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const user = requireUser(locals);
		const formData = await request.formData();

		const name = formData.get('name');
		const bio = formData.get('bio');

		const safeName = typeof name === 'string' ? name.trim() : '';
		const safeBio = typeof bio === 'string' ? bio.trim() : '';

		// Validation: Name length between 2 and 50 characters
		if (!safeName || safeName.length < 2 || safeName.length > 50) {
			return fail(400, {
				success: false,
				message: 'Display name must be between 2 and 50 characters.',
				values: { name: safeName, bio: safeBio }
			});
		}

		// Validation: Bio max length 500 characters
		if (safeBio.length > 500) {
			return fail(400, {
				success: false,
				message: 'Biography cannot exceed 500 characters.',
				values: { name: safeName, bio: safeBio }
			});
		}

		try {
			// Strictly update only name and bio; role/status/email can never be modified here
			const updated = updateUserProfile(user.id, {
				name: safeName,
				bio: safeBio
			});

			return {
				success: true,
				message: 'Profile updated successfully.',
				user: updated
			};
		} catch (err) {
			return fail(400, {
				success: false,
				message: err.message || 'Failed to update profile.',
				values: { name: safeName, bio: safeBio }
			});
		}
	}
};
