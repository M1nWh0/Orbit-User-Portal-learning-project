import { requireAdmin } from '$lib/server/auth.js';
import { getAccountStats, getAllSafeUsers } from '$lib/server/store.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	const user = requireAdmin(locals);
	depends('app:users');

	const stats = getAccountStats();
	const users = getAllSafeUsers();

	return {
		user,
		stats,
		users
	};
}
