import * as React from "react";
import { Mail, Phone, MapPin, MoreVertical } from "lucide-react";
import { cn } from "./utils";
import { Card, CardContent, CardFooter, CardImage } from "./enhanced-card";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Badge } from "./badge";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface ProfileCardProps {
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  coverImage?: string;
  email?: string;
  phone?: string;
  location?: string;
  tags?: string[];
  status?: "online" | "offline" | "busy" | "away";
  actions?: React.ReactNode;
  loading?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const statusColors = {
  online: "bg-[var(--success)]",
  offline: "bg-gray-400",
  busy: "bg-[var(--error)]",
  away: "bg-[var(--warning)]",
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      name,
      role,
      company,
      avatar,
      coverImage,
      email,
      phone,
      location,
      tags = [],
      status,
      actions,
      loading = false,
      variant = "default",
      className,
    },
    ref
  ) => {
    if (variant === "compact") {
      return (
        <Card
          ref={ref}
          variant="bordered"
          hoverable
          loading={loading}
          className={cn("hover:border-[var(--brand-primary)]/50", className)}
        >
          <CardContent>
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="size-12">
                  {avatar ? (
                    <img src={avatar} alt={name} className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white font-medium">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
                {status && (
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 size-3 rounded-full border-2 border-background",
                      statusColors[status]
                    )}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{name}</h4>
                {role && (
                  <p className="text-sm text-muted-foreground truncate">{role}</p>
                )}
              </div>

              {/* Actions */}
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        variant="bordered"
        hoverable
        loading={loading}
        className={className}
      >
        {/* Cover Image */}
        {coverImage && (
          <CardImage
            src={coverImage}
            alt={`${name} cover`}
            className="h-32"
          />
        )}

        <CardContent className={coverImage ? "pt-0" : undefined}>
          {/* Header with Avatar */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={cn(
              "relative shrink-0",
              coverImage && "-mt-8"
            )}>
              <Avatar className={cn(
                coverImage ? "size-20 border-4 border-background" : "size-16"
              )}>
                {avatar ? (
                  <img src={avatar} alt={name} className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white text-2xl font-medium">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </Avatar>
              {status && (
                <div
                  className={cn(
                    "absolute bottom-1 right-1 size-4 rounded-full border-2 border-background",
                    statusColors[status]
                  )}
                />
              )}
            </div>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold truncate">{name}</h3>
              {role && (
                <p className="text-muted-foreground truncate">{role}</p>
              )}
              {company && (
                <p className="text-sm text-muted-foreground truncate">
                  {company}
                </p>
              )}
            </div>

            {/* Menu */}
            {actions && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                <MoreVertical className="size-4" />
              </Button>
            )}
          </div>

          {/* Contact Info */}
          {variant === "detailed" && (email || phone || location) && (
            <div className="mt-4 space-y-2">
              {email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4 shrink-0" />
                  <span className="truncate">{phone}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {tags.map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {/* Actions Footer */}
        {actions && (
          <CardFooter>
            {actions}
          </CardFooter>
        )}
      </Card>
    );
  }
);

ProfileCard.displayName = "ProfileCard";
