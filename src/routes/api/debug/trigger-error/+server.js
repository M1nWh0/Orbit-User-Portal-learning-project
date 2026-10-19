import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

/**
 * Scenario C: Controlled Server Error debugging endpoint.
 * Throws/returns a deliberate 500 status in development, and is strictly disabled (403) in production.
 * @type {import('./$types').RequestHandler}
 */
export async function GET() {
	// Guard against triggering debug errors in production
	if (!dev) {
		return json(
			{
				error: 'Controlled debugging failures are strictly disabled in production.',
				code: 'PRODUCTION_GUARD_ACTIVE'
			},
			{ status: 403 }
		);
	}

	console.error(
		'[DEBUG-LAB] Intentionally emitting controlled 500 Internal Server Error from /api/debug/trigger-error'
	);

	return json(
		{
			error: 'Controlled Internal Server Error: Deliberate server diagnostic exception triggered.',
			code: 'INTENTIONAL_500_ERROR',
			timestamp: new Date().toISOString(),
			diagnostic: {
				environment: 'development',
				severity: 'HIGH (Simulated 500 Failure)',
				terminalCheck:
					'Development terminal has logged: "[DEBUG-LAB] Intentionally emitting controlled 500 Internal Server Error..."',
				purpose:
					'Demonstrates client error handling, inspector error visualization, and the production safeguard guard boundary.'
			}
		},
		{ status: 500 }
	);
}
