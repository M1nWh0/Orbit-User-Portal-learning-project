import { requireUser } from '$lib/server/auth.js';
import { getAccountStats } from '$lib/server/store.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	const user = requireUser(locals);
	depends('app:users');

	let stats = null;
	if (user.role === 'admin') {
		stats = getAccountStats();
	}

	return {
		user,
		stats
	};
}
