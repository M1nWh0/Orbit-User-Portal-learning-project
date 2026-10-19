<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Users from '@lucide/svelte/icons/users';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import UserX from '@lucide/svelte/icons/user-x';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import UserIcon from '@lucide/svelte/icons/user';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Mail from '@lucide/svelte/icons/mail';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Hash from '@lucide/svelte/icons/hash';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Settings from '@lucide/svelte/icons/settings';

	let { data } = $props();
	let user = $derived(data.user);
	let stats = $derived(data.stats);

	function formatDate(isoString) {
		if (!isoString) return 'N/A';
		try {
			return new Date(isoString).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return isoString;
		}
	}
</script>

<svelte:head>
	<title>Dashboard — Orbit User Portal</title>
</svelte:head>

<div class="space-y-8">
	<!-- Hero Header -->
	<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
				<span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
					<Sparkles class="size-3" />
					Overview
				</span>
			</div>
			<p class="text-sm text-muted-foreground mt-1">
				Welcome back, <span class="font-medium text-foreground">{user?.name}</span>! Here is your portal activity and overview.
			</p>
		</div>

		<div class="flex items-center gap-2">
			<Button href="/users" variant="outline" size="sm" class="gap-1.5">
				<Users class="size-4" />
				Browse Directory
			</Button>
			{#if user?.role === 'admin'}
				<Button href="/admin/users" size="sm" class="gap-1.5 shadow-sm">
					<Settings class="size-4" />
					Admin Console
				</Button>
			{/if}
		</div>
	</div>

	<!-- Admin Derived Live Metrics (Only visible if user has role: 'admin') -->
	{#if stats}
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Live Store Telemetry
				</h2>
				<span class="text-xs text-muted-foreground">Derived directly from in-memory state</span>
			</div>

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
						<p class="text-xs text-muted-foreground mt-1">Registered users across portal</p>
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
						<p class="text-xs text-muted-foreground mt-1">Can log in and access system</p>
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
						<p class="text-xs text-muted-foreground mt-1">Sessions revoked, login blocked</p>
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
						<p class="text-xs text-muted-foreground mt-1">Full administrative privileges</p>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	{/if}

	<!-- Account Profile & Details Card -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- User Summary Card -->
		<Card.Root class="lg:col-span-2 border shadow-sm">
			<Card.Header>
				<div class="flex items-center justify-between">
					<div>
						<Card.Title class="text-lg">Account Profile</Card.Title>
						<Card.Description>Your identity, credentials, and role privileges</Card.Description>
					</div>
					<div class="flex items-center gap-2">
						<Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} class="capitalize font-medium">
							{user?.role}
						</Badge>
						<Badge
							variant="outline"
							class={user?.status === 'active'
								? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
								: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'}
						>
							{user?.status}
						</Badge>
					</div>
				</div>
			</Card.Header>
			<Card.Content class="space-y-6">
				<!-- Detail Grid -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="flex items-start gap-3 rounded-lg border p-3.5 bg-muted/20">
						<UserIcon class="size-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<div class="text-xs font-medium text-muted-foreground">Display Name</div>
							<div class="font-semibold text-foreground mt-0.5">{user?.name}</div>
						</div>
					</div>

					<div class="flex items-start gap-3 rounded-lg border p-3.5 bg-muted/20">
						<Mail class="size-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<div class="text-xs font-medium text-muted-foreground">Email Address</div>
							<div class="font-semibold text-foreground mt-0.5">{user?.email}</div>
						</div>
					</div>

					<div class="flex items-start gap-3 rounded-lg border p-3.5 bg-muted/20">
						<Hash class="size-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<div class="text-xs font-medium text-muted-foreground">Account Identifier</div>
							<div class="font-mono text-xs text-foreground mt-1 truncate">{user?.id}</div>
						</div>
					</div>

					<div class="flex items-start gap-3 rounded-lg border p-3.5 bg-muted/20">
						<Calendar class="size-5 text-muted-foreground shrink-0 mt-0.5" />
						<div>
							<div class="text-xs font-medium text-muted-foreground">Member Since</div>
							<div class="font-semibold text-foreground mt-0.5">{formatDate(user?.createdAt)}</div>
						</div>
					</div>
				</div>

				<!-- Bio snippet -->
				<div class="rounded-lg border p-4 bg-muted/10">
					<div class="text-xs font-medium text-muted-foreground mb-1">Personal Biography</div>
					{#if user?.bio}
						<p class="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
					{:else}
						<p class="text-sm italic text-muted-foreground">No bio provided yet. Click below to add one!</p>
					{/if}
				</div>
			</Card.Content>
			<Card.Footer class="border-t bg-muted/10 flex justify-end gap-3 pt-4">
				<Button href="/profile" size="sm" class="gap-1.5">
					Edit Profile
					<ArrowRight class="size-3.5" />
				</Button>
			</Card.Footer>
		</Card.Root>

		<!-- Fast Navigation & System Information -->
		<div class="space-y-6">
			<!-- Quick Actions -->
			<Card.Root class="border shadow-sm">
				<Card.Header>
					<Card.Title class="text-base">Quick Shortcuts</Card.Title>
					<Card.Description>Navigate key areas of Orbit Portal</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-3">
					<a
						href="/users"
						class="flex items-center justify-between p-3 rounded-lg border transition hover:bg-muted/50 group"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-md bg-primary/10 p-2 text-primary">
								<Users class="size-4" />
							</div>
							<div>
								<div class="text-sm font-medium">User Directory</div>
								<div class="text-xs text-muted-foreground">Search and inspect team profiles</div>
							</div>
						</div>
						<ArrowRight class="size-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
					</a>

					<a
						href="/profile"
						class="flex items-center justify-between p-3 rounded-lg border transition hover:bg-muted/50 group"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-md bg-primary/10 p-2 text-primary">
								<UserIcon class="size-4" />
							</div>
							<div>
								<div class="text-sm font-medium">Profile Settings</div>
								<div class="text-xs text-muted-foreground">Manage your display name & bio</div>
							</div>
						</div>
						<ArrowRight class="size-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
					</a>

					{#if user?.role === 'admin'}
						<a
							href="/admin/users"
							class="flex items-center justify-between p-3 rounded-lg border transition hover:bg-muted/50 group"
						>
							<div class="flex items-center gap-3">
								<div class="rounded-md bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
									<ShieldAlert class="size-4" />
								</div>
								<div>
									<div class="text-sm font-medium">Account Management</div>
									<div class="text-xs text-muted-foreground">Create, activate, & assign roles</div>
								</div>
							</div>
							<ArrowRight class="size-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
						</a>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Security & Session Health Box -->
			<Card.Root class="border shadow-sm bg-muted/20">
				<Card.Header class="pb-2">
					<Card.Title class="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
						Active Session Health
					</Card.Title>
				</Card.Header>
				<Card.Content class="text-xs space-y-2 text-muted-foreground">
					<div class="flex items-center justify-between">
						<span>Cookie Status:</span>
						<span class="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
							<span class="size-1.5 rounded-full bg-emerald-500 inline-block"></span>
							HttpOnly / SameSite
						</span>
					</div>
					<div class="flex items-center justify-between">
						<span>Crypto Standard:</span>
						<span class="font-medium text-foreground">Node scrypt + timingSafeEqual</span>
					</div>
					<div class="flex items-center justify-between">
						<span>Role Authorization:</span>
						<span class="font-medium text-foreground">Verified per request in hooks</span>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
