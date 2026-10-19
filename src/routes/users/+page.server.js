import { requireUser } from '$lib/server/auth.js';
import { getPublicDirectoryUsers } from '$lib/server/store.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	requireUser(locals);
	depends('app:users');

	const users = getPublicDirectoryUsers();

	return {
		users
	};
}
