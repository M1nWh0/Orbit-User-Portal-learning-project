<script>
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Lock from '@lucide/svelte/icons/lock';
	import Users from '@lucide/svelte/icons/users';
	import Terminal from '@lucide/svelte/icons/terminal';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Orbit from '@lucide/svelte/icons/orbit';

	let { data } = $props();
	let user = $derived(data?.user);
</script>

<svelte:head>
	<title>Orbit User Portal — Enterprise SaaS Simulation</title>
	<meta
		name="description"
		content="A full-stack style SaaS user portal built with Svelte 5 runes, SvelteKit, session authentication, and role-based access control."
	/>
</svelte:head>

<div class="relative overflow-hidden bg-background">
	<!-- Decorative background gradient glow -->
	<div class="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/10 via-accent/20 to-transparent blur-3xl"></div>

	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-16 sm:py-24 text-center">
		<div class="mx-auto flex max-w-3xl flex-col items-center">
			<Badge variant="outline" class="mb-4 gap-2 rounded-full px-3 py-1 text-xs font-semibold text-primary border-primary/20 bg-primary/5">
				<Orbit class="h-3.5 w-3.5" />
				Svelte 5 & SvelteKit Architecture Simulation
			</Badge>

			<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
				Secure User Management <br />
				<span class="bg-gradient-to-r from-primary via-primary/80 to-muted-foreground bg-clip-text text-transparent">
					Built with Svelte 5 Runes
				</span>
			</h1>

			<p class="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
				Orbit User Portal is a full-stack educational SaaS platform demonstrating session-based authentication,
				server-only cryptographic primitives with Node.js <code class="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold">scrypt</code>,
				strict RBAC access controls, and dynamic data invalidation.
			</p>

			<!-- Dynamic Call to Action -->
			<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
				{#if user}
					<a
						href="/dashboard"
						class="{buttonVariants({ variant: 'default', size: 'lg' })} gap-2 shadow-md shadow-primary/20"
					>
						<span>Go to Dashboard</span>
						<ArrowRight class="h-4 w-4" />
					</a>
					<a
						href="/users"
						class="{buttonVariants({ variant: 'outline', size: 'lg' })} gap-2"
					>
						<Users class="h-4 w-4" />
						<span>Browse Directory</span>
					</a>
				{:else}
					<a
						href="/login"
						class="{buttonVariants({ variant: 'default', size: 'lg' })} gap-2 shadow-md shadow-primary/20"
					>
						<span>Sign In to Portal</span>
						<ArrowRight class="h-4 w-4" />
					</a>
					<a
						href="/register"
						class="{buttonVariants({ variant: 'outline', size: 'lg' })} gap-2"
					>
						<span>Create Account</span>
					</a>
				{/if}
				<a
					href="/debug-lab"
					class="{buttonVariants({ variant: 'ghost', size: 'lg' })} gap-2 text-muted-foreground hover:text-foreground"
				>
					<Terminal class="h-4 w-4" />
					<span>Explore Debug Lab</span>
				</a>
			</div>
		</div>

		<!-- Seed Account Quick-Reference Helper -->
		<div class="mx-auto mt-12 max-w-xl rounded-xl border border-border/80 bg-card/60 p-5 shadow-sm backdrop-blur-xs text-left">
			<div class="flex items-center justify-between pb-3 border-b">
				<div class="flex items-center gap-2">
					<Lock class="h-4 w-4 text-primary" />
					<h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Demonstration Accounts (Pre-Seeded)
					</h3>
				</div>
				<Badge variant="secondary" class="text-[10px]">Local Memory</Badge>
			</div>
			<div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
				<div class="rounded-lg bg-muted/50 p-3">
					<div class="flex items-center justify-between font-semibold">
						<span class="text-foreground">Standard Member</span>
						<Badge variant="outline" class="text-[9px]">User</Badge>
					</div>
					<p class="mt-1 font-mono text-[11px] text-muted-foreground">member@example.com</p>
					<p class="font-mono text-[11px] text-muted-foreground">Password: <span class="text-foreground font-semibold">member123</span></p>
				</div>
				<div class="rounded-lg bg-muted/50 p-3">
					<div class="flex items-center justify-between font-semibold">
						<span class="text-foreground">Administrator</span>
						<Badge variant="default" class="text-[9px]">Admin</Badge>
					</div>
					<p class="mt-1 font-mono text-[11px] text-muted-foreground">admin@example.com</p>
					<p class="font-mono text-[11px] text-muted-foreground">Password: <span class="text-foreground font-semibold">admin123</span></p>
				</div>
			</div>
		</div>
	</section>

	<!-- Feature Highlights Grid -->
	<section class="container mx-auto px-4 py-16 border-t">
		<div class="text-center max-w-2xl mx-auto mb-12">
			<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
				Simulated Production Architecture
			</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				Every module reflects security boundaries and conventions standard in enterprise web applications.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
			<!-- Feature 1 -->
			<Card.Root class="border bg-card/50 transition-all hover:shadow-md">
				<Card.Header>
					<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
						<ShieldCheck class="h-5 w-5" />
					</div>
					<Card.Title class="text-lg">Role-Based Access</Card.Title>
					<Card.Description class="text-xs">
						Granular access control enforcing User vs Admin capabilities across all routes and form actions.
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-xs text-muted-foreground space-y-1.5">
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>Server-level route guarding</span>
					</div>
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>Last-admin invariant safeguard</span>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Feature 2 -->
			<Card.Root class="border bg-card/50 transition-all hover:shadow-md">
				<Card.Header>
					<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
						<Lock class="h-5 w-5" />
					</div>
					<Card.Title class="text-lg">Cryptographic Security</Card.Title>
					<Card.Description class="text-xs">
						Node.js built-in security with zero third-party auth vulnerabilities.
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-xs text-muted-foreground space-y-1.5">
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>scrypt password hashing</span>
					</div>
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>timingSafeEqual verification</span>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Feature 3 -->
			<Card.Root class="border bg-card/50 transition-all hover:shadow-md">
				<Card.Header>
					<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
						<Users class="h-5 w-5" />
					</div>
					<Card.Title class="text-lg">Directory & Profiles</Card.Title>
					<Card.Description class="text-xs">
						Dynamic routing and projection sanitizers that protect private credentials.
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-xs text-muted-foreground space-y-1.5">
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>Sanitized safe projections</span>
					</div>
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>Searchable public directory</span>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Feature 4 -->
			<Card.Root class="border bg-card/50 transition-all hover:shadow-md">
				<Card.Header>
					<div class="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
						<Terminal class="h-5 w-5" />
					</div>
					<Card.Title class="text-lg">Lifecycle Debug Lab</Card.Title>
					<Card.Description class="text-xs">
						Interactive testing suite to observe SvelteKit request pipelines in real time.
					</Card.Description>
				</Card.Header>
				<Card.Content class="text-xs text-muted-foreground space-y-1.5">
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>8-stage lifecycle inspection</span>
					</div>
					<div class="flex items-center gap-2">
						<CheckCircle2 class="h-3.5 w-3.5 text-primary shrink-0" />
						<span>Error & invalidation triggers</span>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t py-8 text-center text-xs text-muted-foreground">
		<div class="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-2">
				<Orbit class="h-4 w-4 text-primary" />
				<span class="font-semibold text-foreground">Orbit User Portal</span>
				<span>•</span>
				<span>Svelte 5 Runes Learning Architecture</span>
			</div>
			<div>
				Strictly JavaScript (No TypeScript) • In-Memory Mock Store
			</div>
		</div>
	</footer>
</div>
