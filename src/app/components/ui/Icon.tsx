/**
 * Icon Component
 * Wrapper for lucide-react icons with consistent styling
 * 
 * @module components/ui/Icon
 * @version 2.0
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  getIconClass,
  iconWithBadge,
  type IconSize,
  type IconColor,
  type IconAnimation,
} from '@/app/utils/icons';
import { cn } from '@/lib/utils';

/* ============================================================
 * TYPES
 * ============================================================ */

export interface IconProps extends React.HTMLAttributes<SVGElement> {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Icon size preset
   * @default 'md'
   */
  size?: IconSize;
  
  /**
   * Icon color preset
   * @default 'default'
   */
  color?: IconColor;
  
  /**
   * Animation to apply
   */
  animated?: IconAnimation;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Stroke width (lucide default is 2)
   * @default 2
   */
  strokeWidth?: number;
  
  /**
   * Accessibility label
   */
  'aria-label'?: string;
  
  /**
   * Whether icon is decorative (hidden from screen readers)
   * @default false
   */
  decorative?: boolean;
}

export interface IconWithBadgeProps extends IconProps {
  /**
   * Badge count to display
   */
  badgeCount?: number;
  
  /**
   * Badge color
   * @default 'error'
   */
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  
  /**
   * Badge position
   * @default 'top-right'
   */
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/* ============================================================
 * ICON COMPONENT
 * ============================================================ */

/**
 * Icon component with preset sizes, colors, and animations
 * 
 * @example
 * ```tsx
 * import { Icon } from '@/app/components/ui/Icon';
 * import { icons } from '@/app/utils/icons';
 * 
 * <Icon icon={icons.user} size="md" color="primary" />
 * <Icon icon={icons.loader} size="lg" animated="spin" />
 * ```
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size = 'md',
      color = 'default',
      animated,
      className,
      strokeWidth = 2,
      decorative = false,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const iconClass = getIconClass(size, color, animated);
    
    return (
      <IconComponent
        ref={ref}
        className={cn(iconClass, className)}
        strokeWidth={strokeWidth}
        aria-hidden={decorative}
        aria-label={!decorative ? ariaLabel : undefined}
        role={!decorative && !ariaLabel ? 'img' : undefined}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

/* ============================================================
 * ICON WITH BADGE COMPONENT
 * ============================================================ */

/**
 * Icon with notification badge
 * 
 * @example
 * ```tsx
 * <IconWithBadge 
 *   icon={icons.bell} 
 *   badgeCount={5} 
 *   badgeColor="error"
 * />
 * ```
 */
export const IconWithBadge = React.forwardRef<HTMLDivElement, IconWithBadgeProps>(
  (
    {
      icon,
      size = 'md',
      color = 'default',
      animated,
      className,
      badgeCount,
      badgeColor = 'error',
      badgePosition = 'top-right',
      strokeWidth = 2,
      decorative = false,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const { hasBadge, badgeContent } = iconWithBadge(badgeCount);
    
    const badgeColorClass = {
      primary: 'bg-[var(--brand-primary)]',
      secondary: 'bg-[var(--brand-secondary)]',
      success: 'bg-[var(--success)]',
      warning: 'bg-[var(--warning)]',
      error: 'bg-[var(--error)]',
    }[badgeColor];
    
    const badgePositionClass = {
      'top-right': '-top-1 -right-1',
      'top-left': '-top-1 -left-1',
      'bottom-right': '-bottom-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
    }[badgePosition];
    
    return (
      <div ref={ref} className="relative inline-flex">
        <Icon
          icon={icon}
          size={size}
          color={color}
          animated={animated}
          className={className}
          strokeWidth={strokeWidth}
          decorative={decorative}
          aria-label={ariaLabel}
          {...props}
        />
        
        {hasBadge && (
          <span
            className={cn(
              'absolute inline-flex items-center justify-center',
              'min-w-[18px] h-[18px] px-1',
              'text-[10px] font-semibold text-white',
              'rounded-full',
              badgeColorClass,
              badgePositionClass
            )}
            aria-label={`${badgeCount} notifications`}
          >
            {badgeContent}
          </span>
        )}
      </div>
    );
  }
);

IconWithBadge.displayName = 'IconWithBadge';

/* ============================================================
 * ICON BUTTON COMPONENT
 * ============================================================ */

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Lucide icon component
   */
  icon: LucideIcon;
  
  /**
   * Icon size preset
   * @default 'md'
   */
  size?: IconSize;
  
  /**
   * Icon color preset
   * @default 'default'
   */
  color?: IconColor;
  
  /**
   * Button variant
   * @default 'ghost'
   */
  variant?: 'default' | 'ghost' | 'outline' | 'primary' | 'destructive';
  
  /**
   * Whether button is in loading state
   */
  loading?: boolean;
  
  /**
   * Accessibility label (required for icon-only buttons)
   */
  'aria-label': string;
}

/**
 * Icon button component
 * 
 * @example
 * ```tsx
 * <IconButton 
 *   icon={icons.trash} 
 *   aria-label="Delete" 
 *   variant="destructive"
 *   onClick={handleDelete}
 * />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      color = 'default',
      variant = 'ghost',
      loading = false,
      className,
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-border hover:bg-accent hover:text-accent-foreground',
      primary: 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-600)]',
      destructive: 'bg-[var(--error)] text-white hover:bg-[var(--error-600)]',
    }[variant];
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-md p-2',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantClasses,
          className
        )}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        {...props}
      >
        {loading ? (
          <Icon
            icon={require('lucide-react').Loader2}
            size={size}
            color="inherit"
            animated="spin"
          />
        ) : (
          <Icon icon={icon} size={size} color="inherit" />
        )}
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

/* ============================================================
 * ANIMATED ICON WRAPPER
 * ============================================================ */

export interface AnimatedIconProps extends IconProps {
  /**
   * Whether to show animation
   * @default true
   */
  animate?: boolean;
  
  /**
   * Animation delay in ms
   */
  delay?: number;
}

/**
 * Icon with conditional animation
 * 
 * @example
 * ```tsx
 * <AnimatedIcon 
 *   icon={icons.check} 
 *   animated="bounce"
 *   animate={isSuccess}
 * />
 * ```
 */
export const AnimatedIcon = React.forwardRef<SVGSVGElement, AnimatedIconProps>(
  ({ animate = true, animated, delay, className, ...props }, ref) => {
    const animationClass = animate && animated ? `animate-${animated}` : '';
    const delayStyle = delay ? { animationDelay: `${delay}ms` } : undefined;
    
    return (
      <Icon
        ref={ref}
        className={cn(animationClass, className)}
        style={delayStyle}
        {...props}
      />
    );
  }
);

AnimatedIcon.displayName = 'AnimatedIcon';

/* ============================================================
 * STATUS ICON COMPONENT
 * ============================================================ */

export interface StatusIconProps extends Omit<IconProps, 'icon'> {
  /**
   * Status type
   */
  status: 'success' | 'error' | 'warning' | 'info' | 'loading';
  
  /**
   * Whether to show default color based on status
   * @default true
   */
  colorize?: boolean;
}

/**
 * Icon that automatically selects icon and color based on status
 * 
 * @example
 * ```tsx
 * <StatusIcon status="success" />
 * <StatusIcon status="loading" size="lg" />
 * ```
 */
export const StatusIcon = React.forwardRef<SVGSVGElement, StatusIconProps>(
  ({ status, colorize = true, color, animated, ...props }, ref) => {
    const statusConfig = {
      success: {
        icon: require('lucide-react').Check,
        color: 'success' as IconColor,
        animated: undefined,
      },
      error: {
        icon: require('lucide-react').X,
        color: 'error' as IconColor,
        animated: undefined,
      },
      warning: {
        icon: require('lucide-react').AlertTriangle,
        color: 'warning' as IconColor,
        animated: undefined,
      },
      info: {
        icon: require('lucide-react').AlertCircle,
        color: 'info' as IconColor,
        animated: undefined,
      },
      loading: {
        icon: require('lucide-react').Loader2,
        color: 'muted' as IconColor,
        animated: 'spin' as IconAnimation,
      },
    }[status];
    
    return (
      <Icon
        ref={ref}
        icon={statusConfig.icon}
        color={colorize ? statusConfig.color : color}
        animated={animated || statusConfig.animated}
        {...props}
      />
    );
  }
);

StatusIcon.displayName = 'StatusIcon';

/* ============================================================
 * EXPORTS
 * ============================================================ */

export default Icon;
