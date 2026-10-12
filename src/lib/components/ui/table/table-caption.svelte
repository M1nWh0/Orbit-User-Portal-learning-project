<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<caption
	bind:this={ref}
	class={cn("mt-4 text-sm text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</caption>
