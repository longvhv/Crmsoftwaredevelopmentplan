"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "./utils";

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = 'md', indeterminate, ...props }, ref) => {
  const sizeClasses = {
    sm: 'size-4 rounded',
    md: 'size-5 rounded-md',
    lg: 'size-6 rounded-lg',
  };

  const iconSizes = {
    sm: 'size-3',
    md: 'size-3.5',
    lg: 'size-4',
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        'peer shrink-0 border border-border bg-background',
        'hover:border-[var(--brand-primary-400)] hover:bg-accent/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
        'data-[state=checked]:bg-[var(--brand-primary)] data-[state=checked]:border-[var(--brand-primary)] data-[state=checked]:text-white',
        'data-[state=indeterminate]:bg-[var(--brand-primary)] data-[state=indeterminate]:border-[var(--brand-primary)] data-[state=indeterminate]:text-white',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-200',
        'shadow-sm',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current animate-in zoom-in-50 duration-200"
      >
        {indeterminate ? (
          <Minus className={iconSizes[size]} strokeWidth={3} />
        ) : (
          <Check className={iconSizes[size]} strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };