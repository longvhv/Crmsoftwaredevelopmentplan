import * as React from "react";
import { cn } from "./utils";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * BACK TO TOP - Scroll to top button
 * ============================================================
 * Step 100: Back to top button with smooth scroll
 */

export interface BackToTopProps {
  /** Show threshold in pixels */
  showAt?: number;
  /** Smooth scroll behavior */
  smooth?: boolean;
  /** Button position */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Custom className */
  className?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Show label */
  showLabel?: boolean;
}

const POSITION_STYLES = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
};

const SIZE_STYLES = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

export function BackToTop({
  showAt = 300,
  smooth = true,
  position = "bottom-right",
  size = "md",
  className,
  icon,
  showLabel = false,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > showAt) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility(); // Check initial state

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAt]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size={showLabel ? "default" : "icon"}
      className={cn(
        "fixed z-50 shadow-lg transition-all",
        "animate-in fade-in slide-in-from-bottom-2",
        POSITION_STYLES[position],
        !showLabel && SIZE_STYLES[size],
        className
      )}
      aria-label="Back to top"
    >
      {icon || <ArrowUp className="w-5 h-5" />}
      {showLabel && <span className="ml-2">Back to Top</span>}
    </Button>
  );
}

/* ============================================================
 * SCROLL PROGRESS - Show scroll progress
 * ============================================================ */

export interface ScrollProgressProps {
  /** Progress bar position */
  position?: "top" | "bottom";
  /** Progress bar height */
  height?: number;
  /** Progress bar color */
  color?: string;
  /** Show percentage */
  showPercentage?: boolean;
  className?: string;
}

export function ScrollProgress({
  position = "top",
  height = 3,
  color = "hsl(var(--primary))",
  showPercentage = false,
  className,
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress(); // Check initial state

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed left-0 right-0 z-50 transition-all",
          position === "top" ? "top-0" : "bottom-0",
          className
        )}
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {showPercentage && scrollProgress > 0 && (
        <div
          className={cn(
            "fixed right-4 z-50 px-2 py-1 bg-background border rounded shadow-lg text-xs font-medium",
            position === "top" ? "top-4" : "bottom-4"
          )}
        >
          {Math.round(scrollProgress)}%
        </div>
      )}
    </>
  );
}

/* ============================================================
 * SCROLL INDICATOR - Visual scroll indicator with sections
 * ============================================================ */

export interface ScrollSection {
  id: string;
  label: string;
}

export interface ScrollIndicatorProps {
  sections: ScrollSection[];
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  position?: "left" | "right";
  className?: string;
}

export function ScrollIndicator({
  sections,
  activeSection,
  onSectionClick,
  position = "right",
  className,
}: ScrollIndicatorProps) {
  const [currentSection, setCurrentSection] = React.useState(activeSection || sections[0]?.id);

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onSectionClick?.(sectionId);
  };

  return (
    <div
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2",
        position === "right" ? "right-4" : "left-4",
        className
      )}
    >
      {sections.map((section) => {
        const isActive = currentSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative"
            aria-label={section.label}
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                isActive ? "bg-primary scale-150" : "bg-muted hover:bg-muted-foreground"
              )}
            />
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 whitespace-nowrap",
                "px-2 py-1 bg-background border rounded shadow-lg text-xs",
                "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                position === "right" ? "right-full mr-2" : "left-full ml-2"
              )}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
