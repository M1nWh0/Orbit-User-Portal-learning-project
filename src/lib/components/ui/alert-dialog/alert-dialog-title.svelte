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

<AlertDialogPrimitive.Title
	bind:ref
	class={cn("text-lg font-semibold", className)}
	{...restProps}
>
	{@render children?.()}
</AlertDialogPrimitive.Title>
