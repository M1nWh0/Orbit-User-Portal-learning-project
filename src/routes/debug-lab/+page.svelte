<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Terminal from '@lucide/svelte/icons/terminal';
	import Play from '@lucide/svelte/icons/play';
	import AlertCircle from '@lucide/svelte/icons/alert-circle';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import HelpCircle from '@lucide/svelte/icons/help-circle';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import Cookie from '@lucide/svelte/icons/cookie';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Code from '@lucide/svelte/icons/code';

	// Scenario state
	let scenarioAMode = $state('mismatch'); // 'mismatch' | 'fixed'
	let scenarioBId = $state('usr_ghost_404_test');
	let scenarioDCredentials = $state('same-origin'); // 'same-origin' | 'omit'

	// Inspector state
	let isExecuting = $state(false);
	let activeScenario = $state(null);
	let inspectionResult = $state(null);

	async function runScenarioA() {
		activeScenario = 'Scenario A: JSON Property Mismatch';
		isExecuting = true;
		const startTime = performance.now();

		const payload =
			scenarioAMode === 'mismatch'
				? { username: 'testuser', role: 'guest' }
				: { email: 'developer@example.com' };

		try {
			const res = await fetch('/api/debug/echo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const latency = Math.round(performance.now() - startTime);
			const data = await res.json().catch(() => null);

			inspectionResult = {
				scenario: 'Scenario A',
				method: 'POST',
				url: '/api/debug/echo',
				requestHeaders: { 'Content-Type': 'application/json' },
				requestBody: payload,
				status: res.status,
				statusText: res.statusText,
				latency,
				responseBody: data,
				lifecycleStage: 'Endpoint Request Body Validation',
				explanation:
					res.status === 400
						? "Client sent property 'username' where schema contract strictly expects 'email'. Request rejected at the endpoint validator with HTTP 400 Bad Request."
						: "Client sent valid contract property 'email'. Request validated and returned HTTP 200 OK."
			};
		} catch (err) {
			inspectionResult = {
				scenario: 'Scenario A',
				error: err.message,
				status: 0
			};
		} finally {
			isExecuting = false;
		}
	}

	async function runScenarioB() {
		activeScenario = 'Scenario B: API 404 (Data vs Route 404)';
		isExecuting = true;
		const startTime = performance.now();
		const targetId = scenarioBId.trim() || 'usr_ghost_404_test';

		try {
			const res = await fetch(`/api/debug/users/${targetId}`);
			const latency = Math.round(performance.now() - startTime);
			const data = await res.json().catch(() => null);

			inspectionResult = {
				scenario: 'Scenario B',
				method: 'GET',
				url: `/api/debug/users/${targetId}`,
				requestHeaders: { Accept: 'application/json' },
				requestBody: null,
				status: res.status,
				statusText: res.statusText,
				latency,
				responseBody: data,
				lifecycleStage: 'Data Layer Resource Lookup',
				explanation:
					res.status === 404
						? 'The route matched /api/debug/users/[id], but the resource was absent in store.js. This proves a DATA-LEVEL 404, which is distinct from an unmapped route 404.'
						: 'The user identifier was found in store.js. Valid safe user returned with HTTP 200 OK.'
			};
		} catch (err) {
			inspectionResult = {
				scenario: 'Scenario B',
				error: err.message,
				status: 0
			};
		} finally {
			isExecuting = false;
		}
	}

	async function runScenarioC() {
		activeScenario = 'Scenario C: Controlled Server Error';
		isExecuting = true;
		const startTime = performance.now();

		try {
			const res = await fetch('/api/debug/trigger-error');
			const latency = Math.round(performance.now() - startTime);
			const data = await res.json().catch(() => null);

			inspectionResult = {
				scenario: 'Scenario C',
				method: 'GET',
				url: '/api/debug/trigger-error',
				requestHeaders: { Accept: 'application/json' },
				requestBody: null,
				status: res.status,
				statusText: res.statusText,
				latency,
				responseBody: data,
				lifecycleStage: 'Server Exception & Environment Safeguard',
				explanation:
					res.status === 500
						? 'Deliberate server exception handled by SvelteKit endpoint. Status 500 returned and diagnostic message emitted to terminal log. Safeguarded to never trigger in production (would return 403).'
						: 'Request was intercepted with code ' + res.status
			};
		} catch (err) {
			inspectionResult = {
				scenario: 'Scenario C',
				error: err.message,
				status: 0
			};
		} finally {
			isExecuting = false;
		}
	}

	async function runScenarioD() {
		activeScenario = 'Scenario D: Session Cookie Omitted';
		isExecuting = true;
		const startTime = performance.now();

		try {
			const res = await fetch('/api/debug/session', {
				credentials: scenarioDCredentials
			});
			const latency = Math.round(performance.now() - startTime);
			const data = await res.json().catch(() => null);

			inspectionResult = {
				scenario: 'Scenario D',
				method: 'GET',
				url: '/api/debug/session',
				requestHeaders: {
					Credentials: scenarioDCredentials
				},
				requestBody: null,
				status: res.status,
				statusText: res.statusText,
				latency,
				responseBody: data,
				lifecycleStage: 'hooks.server.js -> handle() -> resolveSession()',
				explanation:
					scenarioDCredentials === 'omit'
						? "Client used credentials: 'omit', preventing the browser from attaching the HttpOnly session cookie. The server hook resolved event.locals.user to null."
						: 'Client used standard credentials: "same-origin", transmitting the orbit_session cookie. The server hook resolved and authenticated event.locals.user.'
			};
		} catch (err) {
			inspectionResult = {
				scenario: 'Scenario D',
				error: err.message,
				status: 0
			};
		} finally {
			isExecuting = false;
		}
	}

	function getStatusColor(status) {
		if (status >= 200 && status < 300) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
		if (status === 400) return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
		if (status === 401 || status === 403) return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
		if (status === 404) return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
		if (status >= 500) return 'bg-red-500/10 text-red-600 border-red-500/30';
		return 'bg-muted text-muted-foreground';
	}
</script>

<svelte:head>
	<title>Controlled Debugging Laboratory — Orbit User Portal</title>
</svelte:head>

<div class="space-y-8">
	<!-- Laboratory Header -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Debugging Laboratory</h1>
				<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
					<Terminal class="size-3.5" />
					Interactive Workbench
				</span>
			</div>
			<p class="text-sm text-muted-foreground mt-1">
				Trigger, observe, and inspect controlled HTTP request lifecycles, contract mismatches, and error boundaries in real time.
			</p>
		</div>
	</div>

	<!-- 4 Scenario Cards Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Scenario A: JSON Property Mismatch -->
		<Card.Root class="border shadow-sm flex flex-col justify-between hover:border-primary/40 transition">
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Badge variant="outline" class="text-xs uppercase font-semibold">Scenario A</Badge>
					<span class="text-xs font-mono text-muted-foreground">POST /api/debug/echo</span>
				</div>
				<Card.Title class="text-base mt-2">JSON Property Mismatch</Card.Title>
				<Card.Description class="text-xs">
					Server expects <code class="bg-muted px-1 rounded text-foreground font-mono">email</code>, while client can intentionally submit <code class="bg-muted px-1 rounded text-foreground font-mono">username</code>.
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-3 pb-3">
				<div class="space-y-1.5">
					<Label class="text-xs font-medium">Payload Mode:</Label>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							onclick={() => (scenarioAMode = 'mismatch')}
							class="rounded-md border p-2 text-xs font-medium text-left transition {scenarioAMode === 'mismatch'
								? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
								: 'hover:bg-muted text-muted-foreground'}"
						>
							<div class="font-semibold">Mismatched</div>
							<div class="text-[10px] opacity-80">{"{ username: '...' }"}</div>
						</button>

						<button
							type="button"
							onclick={() => (scenarioAMode = 'fixed')}
							class="rounded-md border p-2 text-xs font-medium text-left transition {scenarioAMode === 'fixed'
								? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
								: 'hover:bg-muted text-muted-foreground'}"
						>
							<div class="font-semibold">Correct Contract</div>
							<div class="text-[10px] opacity-80">{"{ email: '...' }"}</div>
						</button>
					</div>
				</div>
			</Card.Content>

			<Card.Footer class="border-t bg-muted/10 p-3 flex justify-end">
				<Button
					size="sm"
					onclick={runScenarioA}
					disabled={isExecuting}
					class="gap-1.5 text-xs w-full sm:w-auto"
				>
					<Play class="size-3.5" />
					Execute Scenario A
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Scenario B: API 404 (Data vs Route 404) -->
		<Card.Root class="border shadow-sm flex flex-col justify-between hover:border-primary/40 transition">
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Badge variant="outline" class="text-xs uppercase font-semibold">Scenario B</Badge>
					<span class="text-xs font-mono text-muted-foreground">GET /api/debug/users/[id]</span>
				</div>
				<Card.Title class="text-base mt-2">API 404 (Data vs Route)</Card.Title>
				<Card.Description class="text-xs">
					Distinguish between an unmapped URL 404 vs an existing route with a missing data record.
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-3 pb-3">
				<div class="space-y-1.5">
					<Label for="scenario-b-id" class="text-xs font-medium">Target User Identifier:</Label>
					<Input
						id="scenario-b-id"
						bind:value={scenarioBId}
						placeholder="e.g. usr_ghost_404_test"
						class="text-xs font-mono"
					/>
					<div class="flex gap-2 pt-1">
						<button
							type="button"
							onclick={() => (scenarioBId = 'usr_ghost_404_test')}
							class="text-[11px] text-primary hover:underline"
						>
							Set Nonexistent ID (404)
						</button>
						<span class="text-muted-foreground text-xs">|</span>
						<button
							type="button"
							onclick={() => (scenarioBId = 'usr_seed_member_01')}
							class="text-[11px] text-primary hover:underline"
						>
							Set Seed Member (200)
						</button>
					</div>
				</div>
			</Card.Content>

			<Card.Footer class="border-t bg-muted/10 p-3 flex justify-end">
				<Button
					size="sm"
					onclick={runScenarioB}
					disabled={isExecuting}
					class="gap-1.5 text-xs w-full sm:w-auto"
				>
					<Play class="size-3.5" />
					Execute Scenario B
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Scenario C: Controlled Server Error -->
		<Card.Root class="border shadow-sm flex flex-col justify-between hover:border-primary/40 transition">
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Badge variant="outline" class="text-xs uppercase font-semibold">Scenario C</Badge>
					<span class="text-xs font-mono text-muted-foreground">GET /api/debug/trigger-error</span>
				</div>
				<Card.Title class="text-base mt-2">Controlled Server Error</Card.Title>
				<Card.Description class="text-xs">
					Trigger a deliberate 500 Internal Server Error in development. Safeguarded to 403 in production.
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-2 pb-3 text-xs text-muted-foreground">
				<div class="rounded-lg border bg-muted/20 p-2.5 space-y-1">
					<div class="font-medium text-foreground flex items-center gap-1.5">
						<ShieldAlert class="size-3.5 text-amber-500" />
						Safe Diagnostic Boundary
					</div>
					<p class="text-[11px] leading-relaxed">
						Emits a simulated 500 error to inspect the terminal stack trace and response visualization. Protected by an environment guard check.
					</p>
				</div>
			</Card.Content>

			<Card.Footer class="border-t bg-muted/10 p-3 flex justify-end">
				<Button
					size="sm"
					variant="destructive"
					onclick={runScenarioC}
					disabled={isExecuting}
					class="gap-1.5 text-xs w-full sm:w-auto"
				>
					<Play class="size-3.5" />
					Trigger 500 Server Error
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Scenario D: Session Cookie Omitted -->
		<Card.Root class="border shadow-sm flex flex-col justify-between hover:border-primary/40 transition">
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Badge variant="outline" class="text-xs uppercase font-semibold">Scenario D</Badge>
					<span class="text-xs font-mono text-muted-foreground">GET /api/debug/session</span>
				</div>
				<Card.Title class="text-base mt-2">Session Cookie Omission</Card.Title>
				<Card.Description class="text-xs">
					Compare standard fetch vs a request with <code class="bg-muted px-1 rounded text-foreground font-mono">credentials: 'omit'</code>.
				</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-3 pb-3">
				<div class="space-y-1.5">
					<Label class="text-xs font-medium">Fetch Credentials Mode:</Label>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							onclick={() => (scenarioDCredentials = 'same-origin')}
							class="rounded-md border p-2 text-xs font-medium text-left transition {scenarioDCredentials === 'same-origin'
								? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
								: 'hover:bg-muted text-muted-foreground'}"
						>
							<div class="font-semibold">Normal (Included)</div>
							<div class="text-[10px] opacity-80">Transmits cookie</div>
						</button>

						<button
							type="button"
							onclick={() => (scenarioDCredentials = 'omit')}
							class="rounded-md border p-2 text-xs font-medium text-left transition {scenarioDCredentials === 'omit'
								? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
								: 'hover:bg-muted text-muted-foreground'}"
						>
							<div class="font-semibold">Omitted ('omit')</div>
							<div class="text-[10px] opacity-80">Suppresses cookie</div>
						</button>
					</div>
				</div>
			</Card.Content>

			<Card.Footer class="border-t bg-muted/10 p-3 flex justify-end">
				<Button
					size="sm"
					onclick={runScenarioD}
					disabled={isExecuting}
					class="gap-1.5 text-xs w-full sm:w-auto"
				>
					<Play class="size-3.5" />
					Execute Scenario D
				</Button>
			</Card.Footer>
		</Card.Root>
	</div>

	<!-- Live Response & Inspector Workbench -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Code class="size-5 text-primary" />
				<h2 class="text-lg font-bold tracking-tight">Request Lifecycle Inspector</h2>
			</div>

			{#if inspectionResult}
				<Button
					variant="ghost"
					size="sm"
					onclick={() => (inspectionResult = null)}
					class="gap-1 text-xs text-muted-foreground hover:text-foreground"
				>
					<Trash2 class="size-3.5" />
					Clear Inspector
				</Button>
			{/if}
		</div>

		{#if !inspectionResult}
			<Card.Root class="border border-dashed text-center py-12 shadow-sm bg-muted/10">
				<Card.Content class="space-y-3">
					<div class="mx-auto rounded-full bg-muted p-3 w-fit text-muted-foreground">
						<Terminal class="size-6" />
					</div>
					<div>
						<div class="text-sm font-semibold">Inspector Idle</div>
						<p class="text-xs text-muted-foreground max-w-sm mx-auto mt-0.5">
							Click "Execute Scenario" on any card above to trigger the HTTP request and inspect headers, payload, response status, and lifecycle stage.
						</p>
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<Card.Root class="border shadow-md overflow-hidden bg-card">
				<!-- Inspector Top Metadata Bar -->
				<Card.Header class="bg-muted/40 border-b p-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<div class="flex items-center gap-3">
							<Badge variant="outline" class="font-mono text-xs uppercase px-2">
								{inspectionResult.method}
							</Badge>
							<span class="font-mono text-sm font-semibold text-foreground">
								{inspectionResult.url}
							</span>
						</div>

						<div class="flex items-center gap-2">
							<Badge
								variant="outline"
								class="font-mono text-xs font-bold px-2.5 py-0.5 border {getStatusColor(inspectionResult.status)}"
							>
								{inspectionResult.status} {inspectionResult.statusText || ''}
							</Badge>
							<span class="text-xs font-mono text-muted-foreground">
								{inspectionResult.latency} ms
							</span>
						</div>
					</div>
				</Card.Header>

				<Card.Content class="p-4 sm:p-6 space-y-6">
					<!-- Lifecycle Diagnostic Explanation -->
					<div class="rounded-lg border bg-primary/5 p-4 space-y-1">
						<div class="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
							<HelpCircle class="size-3.5" />
							Lifecycle Diagnostic ({inspectionResult.lifecycleStage})
						</div>
						<p class="text-xs text-foreground/90 leading-relaxed">
							{inspectionResult.explanation}
						</p>
					</div>

					<!-- Request & Response JSON Panes -->
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
						<!-- Request Payload / Headers -->
						<div class="space-y-2">
							<div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
								<span>Sent Payload & Options</span>
								<span class="text-[10px] font-mono">Client Request</span>
							</div>
							<pre class="rounded-lg border bg-muted/40 p-3 font-mono text-xs text-foreground overflow-x-auto max-h-64 leading-snug">{JSON.stringify(
								{
									method: inspectionResult.method,
									url: inspectionResult.url,
									headers: inspectionResult.requestHeaders,
									body: inspectionResult.requestBody
								},
								null,
								2
							)}</pre>
						</div>

						<!-- Response Body -->
						<div class="space-y-2">
							<div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
								<span>Server Response Body</span>
								<span class="text-[10px] font-mono">HTTP {inspectionResult.status}</span>
							</div>
							<pre class="rounded-lg border bg-muted/40 p-3 font-mono text-xs text-foreground overflow-x-auto max-h-64 leading-snug">{JSON.stringify(
								inspectionResult.responseBody,
								null,
								2
							)}</pre>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
</div>
