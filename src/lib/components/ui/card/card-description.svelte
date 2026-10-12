<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<p
	bind:this={ref}
	class={cn("text-sm text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</p>
