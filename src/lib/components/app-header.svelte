<script>
	import { page } from '$app/state';
	import ThemeToggle from './theme-toggle.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Menu from '@lucide/svelte/icons/menu';
	import UserIcon from '@lucide/svelte/icons/user';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Users from '@lucide/svelte/icons/users';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Orbit from '@lucide/svelte/icons/orbit';

	let { user = null, onMenuClick = () => {} } = $props();

	function getInitials(name) {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((part) => part[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	const routeTitles = {
		'/': 'Orbit Home',
		'/dashboard': 'Dashboard',
		'/profile': 'My Profile',
		'/users': 'User Directory',
		'/admin': 'Admin Console',
		'/admin/users': 'Account Management',
		'/debug-lab': 'Lifecycle Debug Lab'
	};

	let currentTitle = $derived(
		routeTitles[page.url.pathname] ||
			(page.url.pathname.startsWith('/users/')
				? 'User Profile'
				: page.url.pathname.startsWith('/admin')
					? 'Admin Console'
					: 'Orbit Portal')
	);
</script>

<header class="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
	<div class="flex items-center gap-3">
		<!-- Mobile menu toggle -->
		{#if user}
			<Button
				variant="ghost"
				size="icon"
				class="lg:hidden"
				onclick={onMenuClick}
				aria-label="Open navigation menu"
			>
				<Menu class="h-5 w-5" />
			</Button>
		{/if}

		<!-- Brand for mobile or when unauthenticated -->
		<a href="/" class="flex items-center gap-2 font-bold tracking-tight text-foreground transition-colors hover:text-primary lg:hidden">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
				<Orbit class="h-4 w-4" />
			</div>
			<span class="text-base font-semibold">Orbit</span>
		</a>

		<!-- Page title / Breadcrumb in desktop layout -->
		<div class="hidden items-center gap-2 lg:flex">
			<span class="text-sm font-medium text-muted-foreground">Orbit Portal</span>
			<span class="text-sm text-muted-foreground/50">/</span>
			<h1 class="text-sm font-semibold text-foreground">{currentTitle}</h1>
		</div>
	</div>

	<!-- Right controls: Theme toggle & User Menu -->
	<div class="flex items-center gap-3">
		<ThemeToggle />

		{#if user}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="User account menu"
				>
					<Avatar.Root class="h-8 w-8 border border-border">
						<Avatar.Fallback class="bg-primary/10 text-xs font-semibold text-primary">
							{getInitials(user.name)}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="hidden flex-col items-start text-left sm:flex">
						<span class="text-xs font-medium leading-none text-foreground">{user.name}</span>
						<span class="text-[11px] leading-tight text-muted-foreground">{user.email}</span>
					</div>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="end" class="w-56">
					<div class="flex items-center justify-between p-2">
						<div class="flex flex-col space-y-0.5">
							<p class="text-sm font-semibold">{user.name}</p>
							<p class="text-xs text-muted-foreground truncate">{user.email}</p>
						</div>
						<Badge variant={user.role === 'admin' ? 'default' : 'secondary'} class="capitalize text-[10px]">
							{user.role}
						</Badge>
					</div>

					<DropdownMenu.Separator />

					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a {...props} href="/dashboard" class="flex w-full items-center gap-2">
								<LayoutDashboard class="h-4 w-4" />
								<span>Dashboard</span>
							</a>
						{/snippet}
					</DropdownMenu.Item>

					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a {...props} href="/users" class="flex w-full items-center gap-2">
								<Users class="h-4 w-4" />
								<span>Directory</span>
							</a>
						{/snippet}
					</DropdownMenu.Item>

					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a {...props} href="/profile" class="flex w-full items-center gap-2">
								<UserIcon class="h-4 w-4" />
								<span>My Profile</span>
							</a>
						{/snippet}
					</DropdownMenu.Item>

					{#if user.role === 'admin'}
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a {...props} href="/admin" class="flex w-full items-center gap-2 text-primary font-medium">
									<ShieldCheck class="h-4 w-4" />
									<span>Admin Console</span>
								</a>
							{/snippet}
						</DropdownMenu.Item>
					{/if}

					<DropdownMenu.Separator />

					<!-- Form-based POST logout -->
					<form method="POST" action="/logout" class="w-full">
						<button
							type="submit"
							class="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-left"
						>
							<LogOut class="h-4 w-4" />
							<span>Sign out</span>
						</button>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<div class="flex items-center gap-2">
				<a href="/login" class={buttonVariants({ variant: 'ghost', size: 'sm' })}>
					Sign in
				</a>
				<a href="/register" class={buttonVariants({ variant: 'default', size: 'sm' })}>
					Register
				</a>
			</div>
		{/if}
	</div>
</header>
