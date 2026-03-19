import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        primary: "border-transparent bg-[var(--brand-primary)] text-white [a&]:hover:bg-[var(--brand-primary-600)]",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline: "border border-border bg-background text-foreground [a&]:hover:bg-accent",
        success: "border-transparent bg-[var(--success)] text-white [a&]:hover:bg-[var(--success-600)]",
        warning: "border-transparent bg-[var(--warning)] text-white [a&]:hover:bg-[var(--warning-600)]",
        error: "border-transparent bg-[var(--error)] text-white [a&]:hover:bg-[var(--error-600)]",
        info: "border-transparent bg-[var(--info)] text-white [a&]:hover:bg-[var(--info-600)]",
        ai: "border-transparent bg-gradient-to-r from-[var(--ai-gradient-start)] to-[var(--ai-gradient-end)] text-white",
        
        // CRM Status variants
        'lead-new': "border-transparent bg-[var(--lead-new)] text-white",
        'lead-contacted': "border-transparent bg-[var(--lead-contacted)] text-white",
        'lead-qualified': "border-transparent bg-[var(--lead-qualified)] text-white",
        'lead-unqualified': "border-transparent bg-[var(--lead-unqualified)] text-white",
        
        // Subtle variants (lighter backgrounds)
        'subtle-default': "bg-[var(--neutral-100)] dark:bg-[var(--neutral-800)] text-foreground",
        'subtle-primary': "bg-[var(--brand-primary-100)] dark:bg-[var(--brand-primary-900)] text-[var(--brand-primary-700)] dark:text-[var(--brand-primary-300)]",
        'subtle-success': "bg-[var(--success-100)] dark:bg-[var(--success-900)] text-[var(--success-700)] dark:text-[var(--success-300)]",
        'subtle-warning': "bg-[var(--warning-100)] dark:bg-[var(--warning-900)] text-[var(--warning-700)] dark:text-[var(--warning-300)]",
        'subtle-error': "bg-[var(--error-100)] dark:bg-[var(--error-900)] text-[var(--error-700)] dark:text-[var(--error-300)]",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px] rounded-sm",
        default: "px-2 py-0.5 text-xs rounded-md",
        lg: "px-2.5 py-1 text-sm rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /**
   * Show close button
   */
  dismissible?: boolean;
  /**
   * Callback when close button is clicked
   */
  onDismiss?: () => void;
  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;
  /**
   * Dot indicator
   */
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      dismissible = false,
      onDismiss,
      leftIcon,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
        )}
        {leftIcon && (
          <span className="inline-flex">{leftIcon}</span>
        )}
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className="ml-0.5 inline-flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Remove badge"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };