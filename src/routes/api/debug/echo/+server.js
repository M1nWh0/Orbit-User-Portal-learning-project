import { json } from '@sveltejs/kit';

/**
 * Scenario A: JSON Property Mismatch debugging endpoint.
 * Expects { "email": string }. Fails 400 if client sends { "username": string }.
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json(
			{
				error: 'Malformed JSON payload',
				code: 'INVALID_JSON',
				explanation: 'Request body must be a valid JSON object.'
			},
			{ status: 400 }
		);
	}

	if (!body || typeof body !== 'object') {
		return json(
			{
				error: 'Request body must be a JSON object.',
				code: 'INVALID_BODY'
			},
			{ status: 400 }
		);
	}

	// Deliberate contract verification
	if (!body.email) {
		const receivedKeys = Object.keys(body);
		const hasUsername = 'username' in body;

		return json(
			{
				error: "Contract Mismatch: Missing required property 'email'.",
				code: 'CONTRACT_PROPERTY_MISMATCH',
				expectedContract: {
					email: 'string (required, e.g. user@example.com)'
				},
				receivedPayload: body,
				diagnostic: hasUsername
					? "Client transmitted property 'username' instead of 'email'. The server schema strictly requires 'email'."
					: `Received keys: [${receivedKeys.join(', ')}]. Property 'email' is absent.`
			},
			{ status: 400 }
		);
	}

	return json(
		{
			success: true,
			code: 'CONTRACT_MATCH',
			message: 'Contract validated successfully! The email property was received.',
			data: {
				email: body.email
			}
		},
		{ status: 200 }
	);
}
