<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<AlertDialogPrimitive.Description
	bind:ref
	class={cn("text-sm text-muted-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</AlertDialogPrimitive.Description>
