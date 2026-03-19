import * as React from "react";
import { Mail, Phone, Building2, MapPin, Star } from "lucide-react";
import { cn } from "./utils";
import { Card, CardContent, CardFooter, CardHeader } from "./enhanced-card";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { Button } from "./button";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface ContactCardProps {
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  leadScore?: number;
  tags?: string[];
  status?: "active" | "new" | "hot" | "cold";
  actions?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

/* ============================================================
 * STYLES
 * ============================================================ */

const statusColors = {
  active: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  hot: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
  cold: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const ContactCard = React.forwardRef<HTMLDivElement, ContactCardProps>(
  (
    {
      name,
      title,
      company,
      avatar,
      email,
      phone,
      location,
      leadScore,
      tags = [],
      status,
      actions,
      loading = false,
      onClick,
      className,
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        variant={onClick ? "interactive" : "bordered"}
        loading={loading}
        onClick={onClick}
        className={cn(
          onClick && "hover:scale-[1.01]",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <Avatar className="size-12 shrink-0">
              {avatar ? (
                <img src={avatar} alt={name} className="object-cover" />
              ) : (
                <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white text-lg font-medium">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>

            {/* Name & Title */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold line-clamp-1">{name}</h4>
              {title && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {title}
                </p>
              )}
              {company && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <Building2 className="size-3.5 shrink-0" />
                  <span className="truncate">{company}</span>
                </div>
              )}
            </div>

            {/* Lead Score */}
            {leadScore !== undefined && (
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-0.5 text-[var(--warning)]">
                  <Star className="size-4 fill-current" />
                  <span className="text-sm font-semibold">{leadScore}</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Contact Info */}
            <div className="space-y-2">
              {email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <a
                    href={`mailto:${email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="truncate hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                  <a
                    href={`tel:${phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>

            {/* Status & Tags */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {status && (
                <Badge
                  size="sm"
                  className={cn(
                    "border font-medium",
                    statusColors[status]
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              )}
              {tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="default" size="sm">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        {actions && (
          <CardFooter>
            {actions}
          </CardFooter>
        )}
      </Card>
    );
  }
);

ContactCard.displayName = "ContactCard";
