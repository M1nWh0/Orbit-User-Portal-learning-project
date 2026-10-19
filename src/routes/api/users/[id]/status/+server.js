import { json } from '@sveltejs/kit';
import { getUserById, setUserStatus } from '$lib/server/store.js';

/**
 * Handles account status updates via HTTP API.
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ params, request, locals }) {
	return handleStatusUpdate({ params, request, locals });
}

/**
 * Handles account status updates via HTTP API.
 * @type {import('./$types').RequestHandler}
 */
export async function PATCH({ params, request, locals }) {
	return handleStatusUpdate({ params, request, locals });
}

async function handleStatusUpdate({ params, request, locals }) {
	// 1. Authentication check (401)
	if (!locals.user) {
		return json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
	}

	// 2. Authorization check (403)
	if (locals.user.role !== 'admin') {
		return json({ error: 'Forbidden: Administrator privileges required.' }, { status: 403 });
	}

	// 3. User lookup (404)
	const target = getUserById(params.id);
	if (!target) {
		return json({ error: `User not found with ID: ${params.id}` }, { status: 404 });
	}

	// 4. Parse JSON body (400)
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body.' }, { status: 400 });
	}

	const newStatus = body?.status;
	if (newStatus !== 'active' && newStatus !== 'inactive') {
		return json(
			{ error: "Invalid status parameter. Must be either 'active' or 'inactive'." },
			{ status: 400 }
		);
	}

	// 5. Invariant enforcement & store update (400)
	try {
		const updated = setUserStatus(params.id, newStatus);
		return json(
			{
				success: true,
				message: `Account status for ${updated.name} successfully updated to ${updated.status}.`,
				user: updated
			},
			{ status: 200 }
		);
	} catch (err) {
		return json({ error: err.message || 'Failed to update user status.' }, { status: 400 });
	}
}
