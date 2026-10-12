<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<thead
	bind:this={ref}
	class={cn("[&_tr]:border-b", className)}
	{...restProps}
>
	{@render children?.()}
</thead>
