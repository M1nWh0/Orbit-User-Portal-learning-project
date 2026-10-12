<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<tbody
	bind:this={ref}
	class={cn("[&_tr:last-child]:border-0", className)}
	{...restProps}
>
	{@render children?.()}
</tbody>
