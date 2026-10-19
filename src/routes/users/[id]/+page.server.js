import { error } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth.js';
import { getUserById, toSafeUser, toPublicDirectoryUser } from '$lib/server/store.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, depends }) {
	const currentUser = requireUser(locals);
	depends('app:users');

	const targetUser = getUserById(params.id);

	if (!targetUser) {
		throw error(404, `User not found with identifier: ${params.id}`);
	}

	const isOwnProfile = currentUser.id === targetUser.id;
	const canViewEmail = isOwnProfile || currentUser.role === 'admin';

	// Safe projection: include private email only for owner or administrator
	const profileUser = canViewEmail ? toSafeUser(targetUser) : toPublicDirectoryUser(targetUser);

	return {
		profileUser,
		isOwnProfile,
		canViewEmail
	};
}
