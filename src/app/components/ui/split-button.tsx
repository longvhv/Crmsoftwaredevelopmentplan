import * as React from "react";
import { Button, ButtonProps } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface SplitButtonOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export interface SplitButtonProps extends Omit<ButtonProps, "onClick"> {
  options: SplitButtonOption[];
  onMainClick?: () => void;
  dropdownAlign?: "start" | "center" | "end";
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      children,
      options,
      onMainClick,
      variant = "default",
      size = "default",
      dropdownAlign = "end",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("inline-flex", className)}>
        {/* Main Button */}
        <Button
          variant={variant}
          size={size}
          onClick={onMainClick}
          className="rounded-r-none border-r border-white/20"
          {...props}
        >
          {children}
        </Button>

        {/* Dropdown Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className="rounded-l-none px-2"
              aria-label="Show more options"
            >
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dropdownAlign}>
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={option.onSelect}
                className="gap-2"
              >
                {option.icon && (
                  <span className="inline-flex [&_svg]:size-4">{option.icon}</span>
                )}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

SplitButton.displayName = "SplitButton";

export { SplitButton };
