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

<SheetPrimitive.Description
	bind:ref
	class={cn("text-sm text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</SheetPrimitive.Description>
