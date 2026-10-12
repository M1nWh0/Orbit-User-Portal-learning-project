<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		tag = "h3",
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	class={cn("text-2xl font-semibold leading-none tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
