<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
	{...restProps}
>
	{@render children?.()}
</div>
