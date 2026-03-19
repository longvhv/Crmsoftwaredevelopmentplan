import * as React from "react";
import { cn } from "./utils";

/* ============================================================
 * SCROLL PROGRESS INDICATOR - Page scroll progress
 * ============================================================
 * Visual feedback for page/section scroll progress
 */

export interface ScrollIndicatorProps {
  /**
   * Position
   * @default 'top'
   */
  position?: 'top' | 'bottom';
  
  /**
   * Height
   * @default 3
   */
  height?: number;
  
  /**
   * Color
   */
  color?: string;
  
  /**
   * Show percentage
   * @default false
   */
  showPercentage?: boolean;
  
  /**
   * Target element (if null, use window)
   */
  target?: HTMLElement | null;
  
  /**
   * Custom className
   */
  className?: string;
}

export function ScrollIndicator({
  position = 'top',
  height = 3,
  color = 'hsl(var(--primary))',
  showPercentage = false,
  target,
  className,
}: ScrollIndicatorProps) {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  React.useEffect(() => {
    const element = target || window;
    
    const handleScroll = () => {
      let progress = 0;
      
      if (target) {
        const { scrollTop, scrollHeight, clientHeight } = target;
        progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      } else {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progress = (window.scrollY / windowHeight) * 100;
      }
      
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };
    
    element.addEventListener('scroll', handleScroll as any);
    handleScroll();
    
    return () => element.removeEventListener('scroll', handleScroll as any);
  }, [target]);
  
  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height }}
    >
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: color,
        }}
      />
      
      {showPercentage && scrollProgress > 0 && (
        <div
          className="fixed top-4 right-4 px-3 py-1 bg-background border border-border rounded-full shadow-lg text-xs font-medium"
        >
          {Math.round(scrollProgress)}%
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * SECTION SCROLL PROGRESS
 * ============================================================ */

export interface SectionScrollProgressProps {
  sections: Array<{ id: string; label: string }>;
  onSectionChange?: (id: string) => void;
  offset?: number;
  className?: string;
}

export function SectionScrollProgress({
  sections,
  onSectionChange,
  offset = 100,
  className,
}: SectionScrollProgressProps) {
  const [activeSection, setActiveSection] = React.useState(sections[0]?.id);
  
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
              onSectionChange?.(section.id);
            }
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSection, offset, onSectionChange]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - offset + 50;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
  
  return (
    <nav className={cn('space-y-1', className)}>
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => scrollToSection(section.id)}
          className={cn(
            'w-full text-left px-3 py-2 text-sm rounded-lg transition-all',
            activeSection === section.id
              ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary pl-[10px]'
              : 'text-muted-foreground hover:bg-[var(--muted)] hover:text-foreground'
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
