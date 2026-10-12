<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	class={cn("animate-pulse rounded-md bg-muted", className)}
	{...restProps}
></div>
