import * as React from "react";
import { cn } from "./utils";
import { Plus, X, ChevronUp } from "lucide-react";

/* ============================================================
 * FLOATING ACTION BUTTON (FAB) & SPEED DIAL
 * ============================================================
 * Floating action buttons with speed dial menu
 */

/* ============================================================
 * FAB
 * ============================================================ */

export interface FABProps {
  /**
   * Icon
   */
  icon?: React.ReactNode;
  
  /**
   * Label (shown on hover)
   */
  label?: string;
  
  /**
   * Click handler
   */
  onClick?: () => void;
  
  /**
   * Position
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  /**
   * Size
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg';
  
  /**
   * Variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /**
   * Show label
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

const FAB_POSITIONS = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const FAB_SIZES = {
  sm: 'w-12 h-12',
  default: 'w-14 h-14',
  lg: 'w-16 h-16',
};

const FAB_VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl',
  outline: 'bg-background border-2 border-primary text-primary hover:bg-primary/5 shadow-lg',
};

export function FAB({
  icon = <Plus className="w-6 h-6" />,
  label,
  onClick,
  position = 'bottom-right',
  size = 'default',
  variant = 'primary',
  showLabel = false,
  className,
}: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        'fixed z-40 rounded-full flex items-center justify-center transition-all group',
        FAB_POSITIONS[position],
        FAB_SIZES[size],
        FAB_VARIANTS[variant],
        showLabel && 'gap-2 px-6 w-auto',
        className
      )}
    >
      <span className={cn(!showLabel && 'group-hover:scale-110 transition-transform')}>
        {icon}
      </span>
      
      {showLabel && label && (
        <span className="font-medium">{label}</span>
      )}
      
      {!showLabel && label && (
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {label}
          <span className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </span>
      )}
    </button>
  );
}

/* ============================================================
 * SPEED DIAL
 * ============================================================ */

export interface SpeedDialAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export interface SpeedDialProps {
  /**
   * Actions
   */
  actions: SpeedDialAction[];
  
  /**
   * Direction
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right';
  
  /**
   * Position
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  /**
   * Icon when closed
   */
  icon?: React.ReactNode;
  
  /**
   * Icon when open
   */
  openIcon?: React.ReactNode;
  
  /**
   * Custom className
   */
  className?: string;
}

export function SpeedDial({
  actions,
  direction = 'up',
  position = 'bottom-right',
  icon = <Plus className="w-6 h-6" />,
  openIcon = <X className="w-6 h-6" />,
  className,
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const getActionPosition = (index: number) => {
    const offset = (index + 1) * 60;
    
    switch (direction) {
      case 'up':
        return { bottom: `${offset}px` };
      case 'down':
        return { top: `${offset}px` };
      case 'left':
        return { right: `${offset}px` };
      case 'right':
        return { left: `${offset}px` };
      default:
        return {};
    }
  };
  
  const handleActionClick = (action: SpeedDialAction) => {
    action.onClick();
    setIsOpen(false);
  };
  
  return (
    <div className={cn('fixed z-40', FAB_POSITIONS[position], className)}>
      {/* Actions */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Action Buttons */}
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="absolute transition-all duration-200"
              style={{
                ...getActionPosition(index),
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'scale(1)' : 'scale(0)',
                transitionDelay: `${index * 30}ms`,
              }}
            >
              <button
                type="button"
                onClick={() => handleActionClick(action)}
                className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center hover:bg-[var(--muted)] transition-all shadow-lg group"
              >
                <span className="w-5 h-5">{action.icon}</span>
                
                {/* Label */}
                <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                  <span className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                </span>
              </button>
            </div>
          ))}
        </>
      )}
      
      {/* Main Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all',
          isOpen && 'rotate-45'
        )}
      >
        {isOpen ? openIcon : icon}
      </button>
    </div>
  );
}

/* ============================================================
 * BACK TO TOP BUTTON
 * ============================================================ */

export interface BackToTopProps {
  /**
   * Show threshold (scroll position in pixels)
   * @default 400
   */
  threshold?: number;
  
  /**
   * Smooth scroll
   * @default true
   */
  smooth?: boolean;
  
  /**
   * Position
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left';
  
  /**
   * Icon
   */
  icon?: React.ReactNode;
  
  /**
   * Label
   */
  label?: string;
  
  /**
   * Custom className
   */
  className?: string;
}

export function BackToTop({
  threshold = 400,
  smooth = true,
  position = 'bottom-right',
  icon = <ChevronUp className="w-5 h-5" />,
  label = 'Back to top',
  className,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  
  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <button
      type="button"
      onClick={scrollToTop}
      title={label}
      className={cn(
        'fixed z-40 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all',
        position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
        className
      )}
    >
      {icon}
    </button>
  );
}

/* ============================================================
 * SCROLL TO SECTION FAB
 * ============================================================ */

export interface ScrollToSectionFABProps {
  sections: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function ScrollToSectionFAB({
  sections,
  position = 'bottom-right',
  className,
}: ScrollToSectionFABProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const actions: SpeedDialAction[] = sections.map((section) => ({
    id: section.id,
    icon: section.icon || <ChevronUp className="w-5 h-5" />,
    label: section.label,
    onClick: () => scrollToSection(section.id),
  }));
  
  return (
    <SpeedDial
      actions={actions}
      position={position}
      direction="up"
      className={className}
    />
  );
}
