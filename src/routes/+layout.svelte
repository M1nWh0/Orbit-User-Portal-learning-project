<script>
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import AppHeader from '$lib/components/app-header.svelte';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	let user = $derived(data?.user);
	let mobileOpen = $state(false);

	// Determine if current page uses the authenticated dashboard shell with sidebar
	let isAppPage = $derived(
		user &&
			(page.url.pathname.startsWith('/dashboard') ||
				page.url.pathname.startsWith('/profile') ||
				page.url.pathname.startsWith('/users') ||
				page.url.pathname.startsWith('/admin') ||
				page.url.pathname.startsWith('/debug-lab'))
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Orbit User Portal</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-right" />

{#if isAppPage}
	<!-- Authenticated Application Shell with Sidebar -->
	<div class="min-h-screen bg-background text-foreground antialiased">
		<AppSidebar {user} bind:mobileOpen />
		<div class="flex min-h-screen flex-col lg:pl-64">
			<AppHeader {user} onMenuClick={() => (mobileOpen = true)} />
			<main class="flex-1 p-4 sm:p-6 lg:p-8">
				{@render children()}
			</main>
		</div>
	</div>
{:else}
	<!-- Public / Auth Flow Layout -->
	<div class="flex min-h-screen flex-col bg-background text-foreground antialiased">
		<AppHeader {user} />
		<main class="flex-1">
			{@render children()}
		</main>
	</div>
{/if}
