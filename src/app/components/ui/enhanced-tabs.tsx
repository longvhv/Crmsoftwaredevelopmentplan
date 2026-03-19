import * as React from "react";
import { cn } from "./utils";
import { X } from "lucide-react";

/* ============================================================
 * ENHANCED TABS - Advanced tab navigation
 * ============================================================
 * Step 98: Enhanced tabs with icons, badges, closeable, and vertical layout
 */

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  closeable?: boolean;
  content?: React.ReactNode;
}

export interface EnhancedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  variant?: "default" | "pills" | "underline" | "bordered";
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TAB_VARIANTS = {
  default: {
    list: "border-b",
    tab: "border-b-2 border-transparent data-[active=true]:border-primary",
    active: "text-primary",
  },
  pills: {
    list: "bg-muted p-1 rounded-lg",
    tab: "rounded-md data-[active=true]:bg-background data-[active=true]:shadow",
    active: "text-foreground",
  },
  underline: {
    list: "border-b-2 border-border",
    tab: "border-b-2 border-transparent data-[active=true]:border-primary -mb-[2px]",
    active: "text-primary",
  },
  bordered: {
    list: "border rounded-lg overflow-hidden",
    tab: "border-r last:border-r-0 data-[active=true]:bg-muted",
    active: "text-foreground",
  },
};

const TAB_SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

export function EnhancedTabs({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  variant = "default",
  orientation = "horizontal",
  size = "md",
  className,
}: EnhancedTabsProps) {
  const variantStyles = TAB_VARIANTS[variant];

  return (
    <div className={cn("w-full", orientation === "vertical" && "flex gap-4", className)}>
      {/* Tab List */}
      <div
        role="tablist"
        className={cn(
          "flex gap-1",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          variantStyles.list
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              data-active={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 font-medium transition-colors",
                "hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
                TAB_SIZES[size],
                variantStyles.tab,
                isActive ? variantStyles.active : "text-muted-foreground",
                orientation === "vertical" && "justify-start w-full"
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span className="flex-1 text-left">{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {tab.badge}
                </span>
              )}
              {tab.closeable && onTabClose && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="hover:bg-muted rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              className={cn(!isActive && "hidden")}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * SCROLLABLE TABS - Tabs with horizontal scroll
 * ============================================================ */

export interface ScrollableTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function ScrollableTabs({ tabs, activeTab, onTabChange, className }: ScrollableTabsProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide border-b pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap",
                "transition-colors font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-background/20 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * SEGMENTED CONTROL - iOS-style segmented control
 * ============================================================ */

export interface SegmentedControlProps {
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("inline-flex bg-muted p-1 rounded-lg", className)}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md font-medium transition-all",
              isActive
                ? "bg-background text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.icon && <span className="w-4 h-4">{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
