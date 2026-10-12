<script>
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	class={cn("text-lg font-semibold text-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</SheetPrimitive.Title>
