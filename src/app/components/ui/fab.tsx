import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import { Loader2 } from "lucide-react";

const fabVariants = cva(
  "fixed inline-flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 active:scale-95 z-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)] shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary)]",
        secondary: "bg-[var(--brand-secondary)] text-white hover:bg-[var(--brand-secondary-600)] shadow-[var(--shadow-secondary)] hover:shadow-[var(--shadow-secondary)]",
        ai: "bg-gradient-to-r from-[var(--ai-gradient-start)] to-[var(--ai-gradient-end)] text-white hover:opacity-90 shadow-[var(--shadow-ai)]",
        white: "bg-white text-foreground hover:bg-gray-50 shadow-lg",
      },
      size: {
        sm: "size-12 rounded-xl",
        default: "size-14 rounded-2xl",
        lg: "size-16 rounded-2xl",
        extended: "h-14 px-6 rounded-full",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      position: "bottom-right",
    },
  }
);

export interface FABProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof fabVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      className,
      variant,
      size,
      position,
      loading = false,
      icon,
      label,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isExtended = size === "extended";

    return (
      <button
        ref={ref}
        className={cn(fabVariants({ variant, size, position, className }))}
        disabled={disabled || loading}
        aria-label={label}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-6 animate-spin" />
        ) : (
          <>
            {icon && <span className="inline-flex [&_svg]:size-6">{icon}</span>}
            {isExtended && (children || label)}
          </>
        )}
      </button>
    );
  }
);

FAB.displayName = "FAB";

export { FAB, fabVariants };
