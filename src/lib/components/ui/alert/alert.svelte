<script module>
	import { tv } from "tailwind-variants";

	export const alertVariants = tv({
		base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
				info: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
				warning: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
				success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400"
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
	role="alert"
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
