<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Users from '@lucide/svelte/icons/users';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import UserX from '@lucide/svelte/icons/user-x';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import Terminal from '@lucide/svelte/icons/terminal';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Lock from '@lucide/svelte/icons/lock';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Activity from '@lucide/svelte/icons/activity';
	import Calendar from '@lucide/svelte/icons/calendar';

	let { data } = $props();
	let stats = $derived(data.stats);
	let users = $derived(data.users || []);

	// Sort accounts by most recent first
	let recentUsers = $derived(
		[...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
	);

	function formatDate(isoString) {
		if (!isoString) return 'N/A';
		try {
			return new Date(isoString).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return isoString;
		}
	}
</script>

<svelte:head>
	<title>Admin Overview — Orbit User Portal</title>
</svelte:head>

<div class="space-y-8">
	<!-- Page Header -->
	<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Admin Overview</h1>
				<span class="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
					<ShieldCheck class="size-3.5" />
					Privileged Console
				</span>
			</div>
			<p class="text-sm text-muted-foreground mt-1">
				Real-time telemetry, store metrics, and governance controls across the entire Orbit portal.
			</p>
		</div>

		<div class="flex items-center gap-2">
			<Button href="/admin/users" size="sm" class="gap-1.5 shadow-sm">
				<UserCog class="size-4" />
				Manage Accounts
			</Button>
			<Button href="/debug-lab" variant="outline" size="sm" class="gap-1.5">
				<Terminal class="size-4" />
				Debug Lab
			</Button>
		</div>
	</div>

	<!-- Live Telemetry Stat Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Total Accounts -->
		<Card.Root class="relative overflow-hidden border shadow-sm transition hover:shadow-md">
			<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
				<Card.Title class="text-xs font-medium text-muted-foreground">Total Accounts</Card.Title>
				<div class="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
					<Users class="size-4" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">{stats.totalAccounts}</div>
				<p class="text-xs text-muted-foreground mt-1">Total registered in server memory</p>
			</Card.Content>
		</Card.Root>

		<!-- Active Accounts -->
		<Card.Root class="relative overflow-hidden border shadow-sm transition hover:shadow-md">
			<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
				<Card.Title class="text-xs font-medium text-muted-foreground">Active Accounts</Card.Title>
				<div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
					<UserCheck class="size-4" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
					{stats.activeAccounts}
				</div>
				<p class="text-xs text-muted-foreground mt-1">Authorized for active sessions</p>
			</Card.Content>
		</Card.Root>

		<!-- Inactive Accounts -->
		<Card.Root class="relative overflow-hidden border shadow-sm transition hover:shadow-md">
			<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
				<Card.Title class="text-xs font-medium text-muted-foreground">Inactive Accounts</Card.Title>
				<div class="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
					<UserX class="size-4" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-amber-600 dark:text-amber-400">
					{stats.inactiveAccounts}
				</div>
				<p class="text-xs text-muted-foreground mt-1">Sessions revoked & login disabled</p>
			</Card.Content>
		</Card.Root>

		<!-- System Administrators -->
		<Card.Root class="relative overflow-hidden border shadow-sm transition hover:shadow-md">
			<Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
				<Card.Title class="text-xs font-medium text-muted-foreground">Administrators</Card.Title>
				<div class="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
					<ShieldAlert class="size-4" />
				</div>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
					{stats.adminCount}
				</div>
				<p class="text-xs text-muted-foreground mt-1">Hold administrative privileges</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- System Governance & Navigation Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Recent System Accounts -->
		<Card.Root class="lg:col-span-2 border shadow-sm">
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title class="text-base">Recent Accounts</Card.Title>
					<Card.Description>Latest members added to the system</Card.Description>
				</div>
				<Button href="/admin/users" variant="outline" size="sm" class="gap-1 text-xs">
					View All ({users.length})
					<ArrowRight class="size-3" />
				</Button>
			</Card.Header>
			<Card.Content class="p-0">
				<div class="divide-y border-t">
					{#each recentUsers as acc (acc.id)}
						<div class="flex items-center justify-between p-4 hover:bg-muted/30 transition">
							<div class="space-y-0.5">
								<div class="flex items-center gap-2">
									<span class="text-sm font-semibold text-foreground">{acc.name}</span>
									<Badge variant={acc.role === 'admin' ? 'default' : 'secondary'} class="text-[10px] uppercase">
										{acc.role}
									</Badge>
									<Badge
										variant="outline"
										class={acc.status === 'active'
											? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]'
											: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px]'}
									>
										{acc.status}
									</Badge>
								</div>
								<div class="text-xs text-muted-foreground font-mono">{acc.email}</div>
							</div>

							<div class="flex items-center gap-3">
								<span class="text-xs text-muted-foreground hidden sm:inline-block">
									{formatDate(acc.createdAt)}
								</span>
								<Button href="/users/{acc.id}" variant="ghost" size="sm" class="h-8 text-xs">
									Inspect
								</Button>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Security & Policy Enforcements -->
		<div class="space-y-6">
			<!-- Critical Invariant Guards -->
			<Card.Root class="border shadow-sm bg-muted/20">
				<Card.Header>
					<Card.Title class="text-sm font-semibold flex items-center gap-2">
						<Lock class="size-4 text-primary" />
						Enforced Invariants
					</Card.Title>
					<Card.Description class="text-xs">
						Server-only rules that cannot be bypassed
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-3 text-xs text-muted-foreground">
					<div class="rounded-lg border bg-background p-3 space-y-1">
						<div class="font-semibold text-foreground flex items-center gap-1.5">
							<ShieldAlert class="size-3.5 text-purple-600 dark:text-purple-400" />
							Final Admin Protection
						</div>
						<p class="text-[11px] leading-relaxed">
							The server strictly rejects demoting or deactivating the last active administrator to guarantee system access is never lost.
						</p>
					</div>

					<div class="rounded-lg border bg-background p-3 space-y-1">
						<div class="font-semibold text-foreground flex items-center gap-1.5">
							<KeyRound class="size-3.5 text-emerald-600 dark:text-emerald-400" />
							Immediate Session Revocation
						</div>
						<p class="text-[11px] leading-relaxed">
							Deactivating an account instantly destroys all corresponding session records in server memory, halting active access on the next request.
						</p>
					</div>

					<div class="rounded-lg border bg-background p-3 space-y-1">
						<div class="font-semibold text-foreground flex items-center gap-1.5">
							<Activity class="size-3.5 text-blue-600 dark:text-blue-400" />
							Timing-Safe Comparison
						</div>
						<p class="text-[11px] leading-relaxed">
							All credential verifications execute via <code class="font-mono text-[10px]">crypto.timingSafeEqual</code> preventing side-channel attacks.
						</p>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Quick Management Links -->
			<Card.Root class="border shadow-sm">
				<Card.Header>
					<Card.Title class="text-sm font-semibold">Admin Actions</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-2">
					<Button href="/admin/users" class="w-full justify-between" size="sm">
						<span class="flex items-center gap-2">
							<UserCog class="size-4" />
							Account Management Console
						</span>
						<ArrowRight class="size-3.5" />
					</Button>
					<Button href="/debug-lab" variant="outline" class="w-full justify-between" size="sm">
						<span class="flex items-center gap-2">
							<Terminal class="size-4" />
							HTTP Debugging Lab
						</span>
						<ArrowRight class="size-3.5" />
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
