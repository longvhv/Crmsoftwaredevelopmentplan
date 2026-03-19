import * as React from "react";
import { Button, ButtonProps } from "./button";
import { Badge } from "./badge";
import { cn } from "./utils";

export interface ButtonBadgeProps extends ButtonProps {
  badgeContent?: string | number;
  badgeVariant?: "default" | "destructive" | "outline" | "secondary" | "success" | "warning";
  badgePosition?: "top-right" | "top-left" | "inline-right" | "inline-left";
  showZero?: boolean;
}

const ButtonBadge = React.forwardRef<HTMLButtonElement, ButtonBadgeProps>(
  (
    {
      children,
      badgeContent,
      badgeVariant = "destructive",
      badgePosition = "top-right",
      showZero = false,
      className,
      ...props
    },
    ref
  ) => {
    const shouldShowBadge = badgeContent !== undefined && (showZero || badgeContent !== 0);
    const isInline = badgePosition.startsWith("inline");

    if (!shouldShowBadge) {
      return (
        <Button ref={ref} className={className} {...props}>
          {children}
        </Button>
      );
    }

    if (isInline) {
      return (
        <Button ref={ref} className={cn("gap-2", className)} {...props}>
          {badgePosition === "inline-left" && (
            <Badge variant={badgeVariant} className="shrink-0">
              {badgeContent}
            </Badge>
          )}
          {children}
          {badgePosition === "inline-right" && (
            <Badge variant={badgeVariant} className="shrink-0">
              {badgeContent}
            </Badge>
          )}
        </Button>
      );
    }

    return (
      <div className="relative inline-flex">
        <Button ref={ref} className={className} {...props}>
          {children}
        </Button>
        <Badge
          variant={badgeVariant}
          className={cn(
            "absolute flex items-center justify-center min-w-5 h-5 px-1.5 text-xs",
            badgePosition === "top-right" && "-top-2 -right-2",
            badgePosition === "top-left" && "-top-2 -left-2"
          )}
        >
          {badgeContent}
        </Badge>
      </div>
    );
  }
);

ButtonBadge.displayName = "ButtonBadge";

export { ButtonBadge };
