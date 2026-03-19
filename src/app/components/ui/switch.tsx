"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: 'sm' | 'md' | 'lg';
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-4 w-7',
    md: 'h-5 w-9',
    lg: 'h-6 w-11',
  };

  const thumbSizes = {
    sm: 'size-3 data-[state=checked]:translate-x-3',
    md: 'size-4 data-[state=checked]:translate-x-4',
    lg: 'size-5 data-[state=checked]:translate-x-5',
  };

  return (
    <SwitchPrimitive.Root
      ref={ref}
      data-slot="switch"
      className={cn(
        'peer inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:bg-border',
        'data-[state=checked]:bg-[var(--brand-primary)]',
        'hover:data-[state=unchecked]:bg-border/80',
        'hover:data-[state=checked]:bg-[var(--brand-primary-600)]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          'data-[state=unchecked]:translate-x-0',
          thumbSizes[size]
        )}
      />
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };