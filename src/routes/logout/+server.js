import { redirect } from '@sveltejs/kit';
import { destroySession } from '$lib/server/auth.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	destroySession(cookies);
	throw redirect(303, '/login');
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	throw redirect(303, '/login');
}
