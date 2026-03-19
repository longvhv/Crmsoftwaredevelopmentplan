import * as React from "react";
import { cn } from "./utils";
import { Check, X, Info, Star, Zap } from "lucide-react";

/* ============================================================
 * PRICING TABLE - Product pricing display
 * ============================================================
 * Supports features, CTAs, popular badges, and comparison
 */

export interface PricingFeature {
  name: string;
  included: boolean;
  info?: string;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  currency?: string;
  period?: string;
  features: PricingFeature[];
  cta?: {
    label: string;
    action?: () => void;
  };
  badge?: string;
  highlighted?: boolean;
  mostPopular?: boolean;
}

export interface PricingTableProps {
  /**
   * Pricing plans
   */
  plans: PricingPlan[];
  
  /**
   * Billing period toggle
   */
  billingPeriod?: 'monthly' | 'yearly';
  
  /**
   * Billing period change handler
   */
  onBillingPeriodChange?: (period: 'monthly' | 'yearly') => void;
  
  /**
   * Show period toggle
   * @default false
   */
  showPeriodToggle?: boolean;
  
  /**
   * Layout
   * @default 'grid'
   */
  layout?: 'grid' | 'table';
  
  /**
   * Columns for grid layout
   * @default 3
   */
  columns?: number;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * PRICING CARD (Grid Layout)
 * ============================================================ */

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <div
      className={cn(
        'border rounded-lg p-6 flex flex-col transition-all',
        plan.highlighted && 'ring-2 ring-primary border-primary shadow-lg scale-105',
        !plan.highlighted && 'hover:shadow-md'
      )}
    >
      {/* Badge */}
      {(plan.badge || plan.mostPopular) && (
        <div className="mb-4">
          {plan.mostPopular ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
              <Star className="w-3 h-3 fill-current" />
              Most Popular
            </span>
          ) : plan.badge ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {plan.badge}
            </span>
          ) : null}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
      </div>
      
      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {plan.currency && (
            <span className="text-2xl font-semibold text-muted-foreground">
              {plan.currency}
            </span>
          )}
          <span className="text-5xl font-bold">{plan.price}</span>
          {plan.period && (
            <span className="text-muted-foreground">/{plan.period}</span>
          )}
        </div>
      </div>
      
      {/* CTA */}
      {plan.cta && (
        <button
          type="button"
          onClick={plan.cta.action}
          className={cn(
            'w-full py-3 px-4 rounded-lg font-medium transition-colors mb-6',
            plan.highlighted
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'border-2 border-primary text-primary hover:bg-primary/5'
          )}
        >
          {plan.cta.label}
        </button>
      )}
      
      {/* Features */}
      <div className="space-y-3 flex-1">
        {plan.features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-2',
              feature.highlight && 'text-primary font-medium'
            )}
          >
            {feature.included ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <span className={cn('text-sm', !feature.included && 'text-muted-foreground')}>
              {feature.name}
            </span>
            {feature.info && (
              <button
                type="button"
                title={feature.info}
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
 * PRICING TABLE (Table Layout)
 * ============================================================ */

interface PricingTableLayoutProps {
  plans: PricingPlan[];
}

const PricingTableLayout: React.FC<PricingTableLayoutProps> = ({ plans }) => {
  const allFeatureNames = Array.from(
    new Set(plans.flatMap((plan) => plan.features.map((f) => f.name)))
  );
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left px-4 py-4 font-semibold bg-[var(--muted)]/30">
              Features
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className={cn(
                  'px-4 py-4 text-center border-l border-border',
                  plan.highlighted && 'bg-primary/5 border-primary/20'
                )}
              >
                <div className="space-y-2">
                  {plan.mostPopular && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </div>
                  )}
                  
                  <div className="font-bold text-lg">{plan.name}</div>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.currency && (
                      <span className="text-lg font-semibold text-muted-foreground">
                        {plan.currency}
                      </span>
                    )}
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  
                  {plan.cta && (
                    <button
                      type="button"
                      onClick={plan.cta.action}
                      className={cn(
                        'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                        plan.highlighted
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'border border-primary text-primary hover:bg-primary/5'
                      )}
                    >
                      {plan.cta.label}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {allFeatureNames.map((featureName, index) => (
            <tr
              key={index}
              className="border-b border-border hover:bg-[var(--muted)]/20 transition-colors"
            >
              <td className="px-4 py-3 font-medium bg-[var(--muted)]/10">
                {featureName}
              </td>
              
              {plans.map((plan) => {
                const feature = plan.features.find((f) => f.name === featureName);
                
                return (
                  <td
                    key={plan.id}
                    className={cn(
                      'px-4 py-3 text-center border-l border-border',
                      plan.highlighted && 'bg-primary/5'
                    )}
                  >
                    {feature ? (
                      feature.included ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ============================================================
 * PRICING TABLE COMPONENT
 * ============================================================ */

export function PricingTable({
  plans,
  billingPeriod = 'monthly',
  onBillingPeriodChange,
  showPeriodToggle = false,
  layout = 'grid',
  columns = 3,
  className,
}: PricingTableProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Billing Period Toggle */}
      {showPeriodToggle && onBillingPeriodChange && (
        <div className="flex items-center justify-center gap-3">
          <span className={cn('text-sm', billingPeriod === 'monthly' && 'font-medium')}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => onBillingPeriodChange(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className={cn(
              'relative w-14 h-7 rounded-full transition-colors',
              billingPeriod === 'yearly' ? 'bg-primary' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-5 h-5 bg-white rounded-full transition-transform',
                billingPeriod === 'yearly' ? 'translate-x-8' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn('text-sm', billingPeriod === 'yearly' && 'font-medium')}>
            Yearly
            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      )}
      
      {/* Plans */}
      {layout === 'grid' ? (
        <div className={cn('grid gap-6', `md:grid-cols-${Math.min(plans.length, columns)}`)}>
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <PricingTableLayout plans={plans} />
      )}
    </div>
  );
}

/* ============================================================
 * SIMPLE PRICING CARD
 * ============================================================ */

export interface SimplePricingCardProps {
  name: string;
  price: number | string;
  currency?: string;
  period?: string;
  features: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  highlighted?: boolean;
  className?: string;
}

export function SimplePricingCard({
  name,
  price,
  currency = '$',
  period = 'mo',
  features,
  ctaLabel = 'Get Started',
  onCtaClick,
  highlighted = false,
  className,
}: SimplePricingCardProps) {
  return (
    <div
      className={cn(
        'border rounded-lg p-6 text-center transition-all',
        highlighted && 'ring-2 ring-primary border-primary shadow-lg',
        !highlighted && 'hover:shadow-md',
        className
      )}
    >
      <h3 className="text-xl font-bold mb-4">{name}</h3>
      
      <div className="mb-6">
        <span className="text-4xl font-bold">{currency}{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      
      <button
        type="button"
        onClick={onCtaClick}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium transition-colors mb-6',
          highlighted
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'border-2 border-primary text-primary hover:bg-primary/5'
        )}
      >
        {ctaLabel}
      </button>
      
      <ul className="space-y-2 text-sm text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
 * TIER PRICING (Usage-based)
 * ============================================================ */

export interface PricingTier {
  from: number;
  to: number | null;
  price: number;
  unit: string;
}

export interface TierPricingProps {
  tiers: PricingTier[];
  currency?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function TierPricing({
  tiers,
  currency = '$',
  title = 'Usage-based Pricing',
  description,
  className,
}: TierPricingProps) {
  return (
    <div className={cn('border rounded-lg p-6', className)}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}
      
      <div className="space-y-3">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-border rounded-lg"
          >
            <div>
              <div className="font-medium">
                {tier.from.toLocaleString()} {tier.to ? `- ${tier.to.toLocaleString()}` : '+'} {tier.unit}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Tier {index + 1}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">
                {currency}{tier.price}
              </div>
              <div className="text-xs text-muted-foreground">
                per {tier.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * ENTERPRISE PRICING (Contact Sales)
 * ============================================================ */

export interface EnterprisePricingProps {
  features: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EnterprisePricing({
  features,
  ctaLabel = 'Contact Sales',
  onCtaClick,
  icon = <Zap className="w-12 h-12" />,
  className,
}: EnterprisePricingProps) {
  return (
    <div className={cn('border-2 border-primary rounded-lg p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10', className)}>
      <div className="text-primary mb-4 flex justify-center">{icon}</div>
      
      <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
      <p className="text-muted-foreground mb-6">Custom pricing for your needs</p>
      
      <button
        type="button"
        onClick={onCtaClick}
        className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors mb-6"
      >
        {ctaLabel}
      </button>
      
      <ul className="space-y-2 text-sm text-left">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
