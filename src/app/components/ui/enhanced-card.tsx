import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "bordered" | "elevated" | "flat" | "interactive";
  hoverable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  loading?: boolean;
}

export interface CardHeaderProps extends React.ComponentProps<"div"> {
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const cardVariants = {
  default: "bg-card border border-border shadow-sm",
  bordered: "bg-card border-2 border-border",
  elevated: "bg-card border border-border shadow-lg",
  flat: "bg-card",
  interactive: "bg-card border border-border shadow-sm cursor-pointer hover:shadow-md hover:border-[var(--brand-primary)]/50",
};

/* ============================================================
 * SKELETON LOADER
 * ============================================================ */

const CardSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-accent rounded w-3/4" />
    <div className="h-3 bg-accent rounded w-full" />
    <div className="h-3 bg-accent rounded w-5/6" />
  </div>
);

/* ============================================================
 * CARD COMPONENT
 * ============================================================ */

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hoverable = false,
      collapsible = false,
      defaultCollapsed = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          "rounded-xl transition-all duration-200",
          cardVariants[variant],
          hoverable && variant !== "interactive" && "hover:shadow-md hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="p-6">
            <CardSkeleton />
          </div>
        ) : (
          React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === CardHeader) {
              return React.cloneElement(child as React.ReactElement<CardHeaderProps>, {
                collapsible,
                collapsed,
                onToggle: () => setCollapsed(!collapsed),
              });
            }
            if (collapsible && collapsed && child.type !== CardHeader) {
              return null;
            }
            return child;
          })
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

/* ============================================================
 * CARD HEADER
 * ============================================================ */

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      collapsible,
      collapsed,
      onToggle,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "flex items-start justify-between gap-4 px-6 pt-6",
          collapsible ? "cursor-pointer hover:bg-accent/50 rounded-t-xl transition-colors" : "pb-6",
          className
        )}
        onClick={collapsible ? onToggle : undefined}
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {collapsible && (
          <button
            type="button"
            className="shrink-0 p-1 hover:bg-accent rounded transition-colors"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="size-4 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

/* ============================================================
 * CARD TITLE
 * ============================================================ */

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h3">>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        data-slot="card-title"
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = "CardTitle";

/* ============================================================
 * CARD DESCRIPTION
 * ============================================================ */

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={cn("text-sm text-muted-foreground mt-1.5", className)}
        {...props}
      />
    );
  }
);

CardDescription.displayName = "CardDescription";

/* ============================================================
 * CARD CONTENT
 * ============================================================ */

export const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn("px-6 pb-6", className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";

/* ============================================================
 * CARD FOOTER
 * ============================================================ */

export const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          "flex items-center justify-between gap-4 px-6 pb-6 pt-0",
          "border-t border-border/50 mt-6",
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

/* ============================================================
 * CARD IMAGE
 * ============================================================ */

export const CardImage = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { src: string; alt: string }>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-t-xl", className)}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }
);

CardImage.displayName = "CardImage";
