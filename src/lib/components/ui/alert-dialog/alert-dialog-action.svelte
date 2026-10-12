<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<AlertDialogPrimitive.Action
	bind:ref
	class={cn(buttonVariants(), className)}
	{...restProps}
>
	{@render children?.()}
</AlertDialogPrimitive.Action>
