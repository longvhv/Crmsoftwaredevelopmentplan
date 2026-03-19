import * as React from "react";
import { Button, ButtonProps } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "./utils";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  icon: React.ReactNode;
  label: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  size?: "xs" | "sm" | "default" | "lg" | "xl";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, tooltipSide = "top", size = "default", className, ...props }, ref) => {
    const iconSize = size === "xs" ? "icon-xs" : size === "sm" ? "icon-sm" : size === "lg" ? "icon-lg" : size === "xl" ? "icon-xl" : "icon";

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              size={iconSize as any}
              aria-label={label}
              className={cn("shrink-0", className)}
              {...props}
            >
              <span className="inline-flex [&_svg]:size-full">{icon}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
