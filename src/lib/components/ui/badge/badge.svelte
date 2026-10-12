<script module>
	import { tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "inline-flex select-none items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
				secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "text-foreground",
				success: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
				warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	});
</script>

<script>
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		variant = "default",
		ref = $bindable(null),
		children,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
