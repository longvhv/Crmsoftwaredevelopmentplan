import * as React from "react";
import { cn } from "./utils";
import { Star, Heart, ThumbsUp, Smile, Frown, Meh } from "lucide-react";

/* ============================================================
 * RATING PROPS
 * ============================================================
 * Star rating or custom icon rating component
 */

export interface RatingProps {
  /**
   * Current rating value
   */
  value?: number;
  
  /**
   * Default rating (uncontrolled)
   */
  defaultValue?: number;
  
  /**
   * Maximum rating
   * @default 5
   */
  max?: number;
  
  /**
   * Allow half ratings (0.5 increments)
   * @default false
   */
  allowHalf?: boolean;
  
  /**
   * Rating icon type
   * @default 'star'
   */
  icon?: 'star' | 'heart' | 'thumbs' | 'emoji' | React.ReactNode;
  
  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Color when active
   * @default 'warning'
   */
  color?: 'primary' | 'warning' | 'error' | 'success' | 'info';
  
  /**
   * Read-only (display only)
   * @default false
   */
  readOnly?: boolean;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Show numeric value
   * @default false
   */
  showValue?: boolean;
  
  /**
   * Show labels for each rating
   */
  labels?: string[];
  
  /**
   * Highlight on hover
   * @default true
   */
  highlightOnHover?: boolean;
  
  /**
   * Change callback
   */
  onChange?: (value: number) => void;
  
  /**
   * Hover callback
   */
  onHover?: (value: number | null) => void;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * SIZE STYLES
 * ============================================================ */

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

/* ============================================================
 * COLOR STYLES
 * ============================================================ */

const colorStyles = {
  primary: {
    filled: 'text-primary',
    empty: 'text-[var(--neutral-300)] dark:text-[var(--neutral-700)]',
  },
  warning: {
    filled: 'text-[var(--warning)]',
    empty: 'text-[var(--neutral-300)] dark:text-[var(--neutral-700)]',
  },
  error: {
    filled: 'text-[var(--error)]',
    empty: 'text-[var(--neutral-300)] dark:text-[var(--neutral-700)]',
  },
  success: {
    filled: 'text-[var(--success)]',
    empty: 'text-[var(--neutral-300)] dark:text-[var(--neutral-700)]',
  },
  info: {
    filled: 'text-[var(--info)]',
    empty: 'text-[var(--neutral-300)] dark:text-[var(--neutral-700)]',
  },
};

/* ============================================================
 * ICON COMPONENTS
 * ============================================================ */

const getIcon = (iconType: RatingProps['icon']): React.ReactNode => {
  if (React.isValidElement(iconType)) {
    return iconType;
  }
  
  switch (iconType) {
    case 'heart':
      return <Heart />;
    case 'thumbs':
      return <ThumbsUp />;
    case 'emoji':
      return <Smile />;
    case 'star':
    default:
      return <Star />;
  }
};

/* ============================================================
 * EMOJI RATING (Special case)
 * ============================================================ */

const EmojiRating: React.FC<{
  value: number;
  size: keyof typeof sizeStyles;
  onClick?: () => void;
}> = ({ value, size, onClick }) => {
  const emojis = [
    { icon: <Frown />, color: 'text-[var(--error)]' },
    { icon: <Meh />, color: 'text-[var(--warning)]' },
    { icon: <Smile />, color: 'text-[var(--success)]' },
  ];
  
  // Map 1-5 to 0-2 emoji index
  const emojiIndex = Math.min(Math.floor((value - 1) / 2), 2);
  const emoji = emojis[emojiIndex];
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex transition-transform hover:scale-110',
        sizeStyles[size],
        emoji.color
      )}
    >
      {emoji.icon}
    </button>
  );
};

/* ============================================================
 * RATING ICON COMPONENT
 * ============================================================ */

interface RatingIconProps {
  filled: boolean;
  halfFilled: boolean;
  icon: React.ReactNode;
  size: keyof typeof sizeStyles;
  color: keyof typeof colorStyles;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
}

const RatingIcon: React.FC<RatingIconProps> = ({
  filled,
  halfFilled,
  icon,
  size,
  color,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  readOnly,
}) => {
  const colors = colorStyles[color];
  
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || readOnly}
      className={cn(
        'relative inline-flex transition-all',
        sizeStyles[size],
        !disabled && !readOnly && 'cursor-pointer hover:scale-110',
        (disabled || readOnly) && 'cursor-default',
        disabled && 'opacity-50'
      )}
    >
      {/* Background (empty) icon */}
      <span className={cn('absolute inset-0', colors.empty)}>
        {icon}
      </span>
      
      {/* Foreground (filled) icon */}
      <span
        className={cn(
          'absolute inset-0 overflow-hidden transition-all duration-200',
          colors.filled
        )}
        style={{
          width: filled ? '100%' : halfFilled ? '50%' : '0%',
        }}
      >
        {icon}
      </span>
    </button>
  );
};

/* ============================================================
 * RATING COMPONENT
 * ============================================================ */

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: valueProp,
      defaultValue = 0,
      max = 5,
      allowHalf = false,
      icon = 'star',
      size = 'md',
      color = 'warning',
      readOnly = false,
      disabled = false,
      showValue = false,
      labels = [],
      highlightOnHover = true,
      onChange,
      onHover,
      className,
    },
    ref
  ) => {
    const [rating, setRating] = React.useState(valueProp ?? defaultValue);
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);
    
    const isControlled = valueProp !== undefined;
    const currentRating = isControlled ? valueProp : rating;
    const displayRating = highlightOnHover && hoverRating !== null ? hoverRating : currentRating;
    
    // Special case: emoji rating (single emoji)
    const isEmojiRating = icon === 'emoji';
    
    // Handle click
    const handleClick = (value: number) => {
      if (disabled || readOnly) return;
      
      if (!isControlled) {
        setRating(value);
      }
      
      onChange?.(value);
    };
    
    // Handle hover
    const handleMouseEnter = (value: number) => {
      if (disabled || readOnly || !highlightOnHover) return;
      
      setHoverRating(value);
      onHover?.(value);
    };
    
    const handleMouseLeave = () => {
      if (disabled || readOnly || !highlightOnHover) return;
      
      setHoverRating(null);
      onHover?.(null);
    };
    
    // Get icon component
    const iconComponent = getIcon(icon);
    
    // Current label
    const currentLabel = labels[Math.ceil(displayRating) - 1];
    
    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col gap-2', className)}
      >
        <div className="flex items-center gap-1">
          {/* Emoji Rating (single emoji) */}
          {isEmojiRating ? (
            <EmojiRating
              value={displayRating}
              size={size}
              onClick={() => !disabled && !readOnly && handleClick(displayRating)}
            />
          ) : (
            /* Regular Rating Icons */
            Array.from({ length: max }, (_, index) => {
              const ratingValue = index + 1;
              const halfValue = index + 0.5;
              
              const isFilled = displayRating >= ratingValue;
              const isHalfFilled = allowHalf && displayRating >= halfValue && displayRating < ratingValue;
              
              return (
                <RatingIcon
                  key={index}
                  filled={isFilled}
                  halfFilled={isHalfFilled}
                  icon={iconComponent}
                  size={size}
                  color={color}
                  onClick={() => handleClick(ratingValue)}
                  onMouseEnter={() => handleMouseEnter(ratingValue)}
                  onMouseLeave={handleMouseLeave}
                  disabled={disabled}
                  readOnly={readOnly}
                />
              );
            })
          )}
          
          {/* Numeric Value */}
          {showValue && (
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {displayRating.toFixed(allowHalf ? 1 : 0)} / {max}
            </span>
          )}
        </div>
        
        {/* Label */}
        {currentLabel && (
          <span className="text-xs text-muted-foreground text-center">
            {currentLabel}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";

export { Rating };
