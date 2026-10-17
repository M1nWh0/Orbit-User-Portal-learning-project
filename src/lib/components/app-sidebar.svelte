<script>
	import { page } from '$app/state';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Users from '@lucide/svelte/icons/users';
	import UserIcon from '@lucide/svelte/icons/user';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import Terminal from '@lucide/svelte/icons/terminal';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Orbit from '@lucide/svelte/icons/orbit';

	let { user = null, mobileOpen = $bindable(false) } = $props();

	let currentPath = $derived(page.url.pathname);

	function isActive(href) {
		if (href === '/dashboard') return currentPath === '/dashboard';
		if (href === '/admin') return currentPath === '/admin';
		return currentPath === href || currentPath.startsWith(href + '/');
	}

	const mainNav = [
		{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
		{ name: 'User Directory', href: '/users', icon: Users },
		{ name: 'My Profile', href: '/profile', icon: UserIcon }
	];

	const adminNav = [
		{ name: 'Admin Overview', href: '/admin', icon: ShieldCheck },
		{ name: 'Manage Accounts', href: '/admin/users', icon: UserCog }
	];

	const toolsNav = [
		{ name: 'Debug Lab', href: '/debug-lab', icon: Terminal }
	];
</script>

{#snippet navList(isMobile = false)}
	<div class="flex flex-col h-full justify-between">
		<div class="space-y-6">
			<!-- Branding Header -->
			<div class="flex items-center gap-3 px-3 py-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
					<Orbit class="h-6 w-6" />
				</div>
				<div>
					<h2 class="text-base font-bold tracking-tight text-foreground">Orbit Portal</h2>
					<p class="text-xs text-muted-foreground">User Management System</p>
				</div>
			</div>

			<Separator />

			<!-- Main Navigation -->
			<div class="space-y-1">
				<div class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
					Navigation
				</div>
				<nav class="space-y-1 pt-1">
					{#each mainNav as item}
						{@const active = isActive(item.href)}
						{@const Icon = item.icon}
						<a
							href={item.href}
							onclick={() => isMobile && (mobileOpen = false)}
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all {active
								? 'bg-primary text-primary-foreground shadow-xs'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
						>
							<Icon class="h-4 w-4 shrink-0" />
							<span>{item.name}</span>
						</a>
					{/each}
				</nav>
			</div>

			<!-- Admin Section (Only rendered for admin role) -->
			{#if user && user.role === 'admin'}
				<div class="space-y-1">
					<div class="flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
						<span>Administration</span>
						<Badge variant="outline" class="h-4 px-1 text-[9px] font-semibold text-primary border-primary/30">
							Admin
						</Badge>
					</div>
					<nav class="space-y-1 pt-1">
						{#each adminNav as item}
							{@const active = isActive(item.href)}
							{@const Icon = item.icon}
							<a
								href={item.href}
								onclick={() => isMobile && (mobileOpen = false)}
								class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all {active
									? 'bg-primary text-primary-foreground shadow-xs'
									: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
							>
								<Icon class="h-4 w-4 shrink-0" />
								<span>{item.name}</span>
							</a>
						{/each}
					</nav>
				</div>
			{/if}

			<!-- System & Learning Tools -->
			<div class="space-y-1">
				<div class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
					Developer & Audit
				</div>
				<nav class="space-y-1 pt-1">
					{#each toolsNav as item}
						{@const active = isActive(item.href)}
						{@const Icon = item.icon}
						<a
							href={item.href}
							onclick={() => isMobile && (mobileOpen = false)}
							class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all {active
								? 'bg-primary text-primary-foreground shadow-xs'
								: 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
						>
							<Icon class="h-4 w-4 shrink-0" />
							<span>{item.name}</span>
						</a>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Footer User Status & Logout -->
		{#if user}
			<div class="space-y-3 pt-6">
				<Separator />
				<div class="flex items-center justify-between rounded-lg bg-muted/50 p-2.5">
					<div class="min-w-0">
						<p class="truncate text-xs font-medium text-foreground">{user.name}</p>
						<p class="truncate text-[11px] text-muted-foreground capitalize">{user.role} • {user.status}</p>
					</div>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
							aria-label="Sign out"
							title="Sign out"
						>
							<LogOut class="h-4 w-4" />
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
{/snippet}

<!-- Desktop Sidebar (visible on lg screens) -->
<aside class="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 border-r bg-card px-4 py-6 shadow-xs">
	{@render navList(false)}
</aside>

<!-- Mobile Navigation Drawer (using Sheet) -->
<Sheet.Root bind:open={mobileOpen}>
	<Sheet.Content side="left" class="w-72 p-6">
		{@render navList(true)}
	</Sheet.Content>
</Sheet.Root>
