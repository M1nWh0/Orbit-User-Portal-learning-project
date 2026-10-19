import { json } from '@sveltejs/kit';
import { getUserById, toSafeUser } from '$lib/server/store.js';

/**
 * Scenario B: API 404 debugging endpoint.
 * Demonstrates the difference between unmapped route 404 and data resource 404.
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ params }) {
	const user = getUserById(params.id);

	if (!user) {
		return json(
			{
				error: 'User resource not found',
				code: 'USER_NOT_FOUND',
				requestedId: params.id,
				diagnostic: {
					routeMatched: true,
					routePattern: '/api/debug/users/[id]',
					routeExplanation:
						'The URL path was successfully parsed and matched by SvelteKit routing rules.',
					dataLookupResult: null,
					dataExplanation:
						'No record with the requested identifier exists in the server in-memory store. This demonstrates a DATA-LEVEL 404 (resource absent), as opposed to a ROUTE-LEVEL 404 (nonexistent endpoint).'
				}
			},
			{ status: 404 }
		);
	}

	return json(
		{
			success: true,
			code: 'RESOURCE_FOUND',
			user: toSafeUser(user),
			diagnostic: {
				routeMatched: true,
				dataLookupResult: 'found'
			}
		},
		{ status: 200 }
	);
}
