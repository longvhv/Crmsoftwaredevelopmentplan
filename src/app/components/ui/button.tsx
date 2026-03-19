import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary - Violet AI-first branding
        default: "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)] shadow-sm hover:shadow-md hover:shadow-[var(--shadow-primary)] active:shadow-sm",
        primary: "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)] shadow-sm hover:shadow-md hover:shadow-[var(--shadow-primary)] active:shadow-sm",
        
        // Secondary - Blue professional
        secondary: "bg-[var(--brand-secondary)] text-white hover:bg-[var(--brand-secondary-600)] shadow-sm hover:shadow-md hover:shadow-[var(--shadow-secondary)] active:shadow-sm",
        
        // Semantic colors
        destructive: "bg-destructive text-white hover:bg-[var(--error-600)] shadow-sm hover:shadow-md hover:shadow-[var(--shadow-error)] active:shadow-sm focus-visible:ring-destructive/20",
        success: "bg-[var(--success)] text-white hover:bg-[var(--success-600)] shadow-sm hover:shadow-md hover:shadow-[var(--shadow-success)] active:shadow-sm",
        warning: "bg-[var(--warning)] text-white hover:bg-[var(--warning-600)] shadow-sm hover:shadow-md hover:shadow-[var(--shadow-warning)] active:shadow-sm",
        
        // Outline variants
        outline: "border-2 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-[var(--brand-primary)]",
        "outline-primary": "border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white",
        
        // Ghost & Link
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-[var(--brand-primary)] underline-offset-4 hover:underline hover:text-[var(--brand-primary-600)]",
        
        // Special variants
        ai: "bg-gradient-to-r from-[var(--ai-gradient-start)] to-[var(--ai-gradient-end)] text-white hover:opacity-90 shadow-md shadow-[var(--shadow-ai)] hover:shadow-lg hover:shadow-[var(--shadow-ai)]",
        gradient: "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white hover:opacity-90 shadow-md hover:shadow-lg",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md gap-1 has-[>svg]:px-2",
        sm: "h-8 px-3 text-sm rounded-md gap-1.5 has-[>svg]:px-2.5",
        default: "h-10 px-4 text-base rounded-lg has-[>svg]:px-3",
        lg: "h-12 px-6 text-lg rounded-lg has-[>svg]:px-4",
        xl: "h-14 px-8 text-xl rounded-xl gap-3 has-[>svg]:px-5",
        icon: "size-10 rounded-lg",
        "icon-xs": "size-7 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12 rounded-lg",
        "icon-xl": "size-14 rounded-xl",
      },
      shape: {
        default: "",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, shape, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {!loading && leftIcon && (
          <span className="inline-flex">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="inline-flex">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };