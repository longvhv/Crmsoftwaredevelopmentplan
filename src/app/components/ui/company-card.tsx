import * as React from "react";
import { Building2, Users, DollarSign, MapPin, Globe, ExternalLink } from "lucide-react";
import { cn } from "./utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./enhanced-card";
import { Badge } from "./badge";
import { Button } from "./button";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface CompanyCardProps {
  name: string;
  logo?: string;
  industry?: string;
  size?: string;
  revenue?: string;
  location?: string;
  website?: string;
  tags?: string[];
  stats?: {
    contacts?: number;
    deals?: number;
    value?: number;
  };
  icpScore?: number;
  actions?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

/* ============================================================
 * HELPERS
 * ============================================================ */

const getIcpScoreColor = (score: number): string => {
  if (score >= 80) return "text-[var(--success)]";
  if (score >= 60) return "text-[var(--warning)]";
  return "text-[var(--error)]";
};

const getIcpScoreLabel = (score: number): string => {
  if (score >= 80) return "High Fit";
  if (score >= 60) return "Medium Fit";
  return "Low Fit";
};

/* ============================================================
 * COMPONENT
 * ============================================================ */

export const CompanyCard = React.forwardRef<HTMLDivElement, CompanyCardProps>(
  (
    {
      name,
      logo,
      industry,
      size,
      revenue,
      location,
      website,
      tags = [],
      stats,
      icpScore,
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
            {/* Logo */}
            <div className="shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt={name}
                  className="size-12 rounded-lg object-contain bg-accent p-2"
                />
              ) : (
                <div className="size-12 rounded-lg bg-[var(--brand-primary)]/10 flex items-center justify-center">
                  <Building2 className="size-6 text-[var(--brand-primary)]" />
                </div>
              )}
            </div>

            {/* Name & Industry */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base line-clamp-1">
                {name}
              </CardTitle>
              {industry && (
                <p className="text-sm text-muted-foreground mt-1">
                  {industry}
                </p>
              )}
            </div>

            {/* ICP Score */}
            {icpScore !== undefined && (
              <div className="shrink-0 text-right">
                <div className={cn(
                  "text-xl font-bold",
                  getIcpScoreColor(icpScore)
                )}>
                  {icpScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getIcpScoreLabel(icpScore)}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Company Info */}
            <div className="space-y-2">
              {size && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-3.5 shrink-0" />
                  <span>{size} employees</span>
                </div>
              )}
              {revenue && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="size-3.5 shrink-0" />
                  <span>{revenue} revenue</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="size-3.5 shrink-0" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="truncate hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                {stats.contacts !== undefined && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">{stats.contacts}</div>
                    <div className="text-xs text-muted-foreground">Contacts</div>
                  </div>
                )}
                {stats.deals !== undefined && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">{stats.deals}</div>
                    <div className="text-xs text-muted-foreground">Deals</div>
                  </div>
                )}
                {stats.value !== undefined && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      ${(stats.value / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">Value</div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="default" size="sm">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
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

CompanyCard.displayName = "CompanyCard";
