import * as React from "react";
import { cn } from "./utils";
import { ChevronDown, ExternalLink } from "lucide-react";

/* ============================================================
 * MEGA MENU - Multi-column dropdown menu
 * ============================================================
 * Rich navigation with icons, descriptions, and featured items
 */

/* ============================================================
 * TYPES
 * ============================================================ */

export interface MegaMenuItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string;
  external?: boolean;
  onClick?: () => void;
}

export interface MegaMenuColumn {
  id: string;
  title?: string;
  items: MegaMenuItem[];
  featured?: boolean;
}

export interface MegaMenuSection {
  id: string;
  label: string;
  columns: MegaMenuColumn[];
  footer?: React.ReactNode;
}

export interface MegaMenuProps {
  /**
   * Menu sections
   */
  sections: MegaMenuSection[];
  
  /**
   * Trigger element label
   */
  label: string;
  
  /**
   * Trigger icon
   */
  icon?: React.ReactNode;
  
  /**
   * Number of columns
   * @default 3
   */
  columns?: number;
  
  /**
   * Width
   * @default 'auto'
   */
  width?: string;
  
  /**
   * Position
   * @default 'left'
   */
  position?: 'left' | 'center' | 'right';
  
  /**
   * Trigger variant
   * @default 'default'
   */
  variant?: 'default' | 'ghost' | 'link';
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * MEGA MENU ITEM COMPONENT
 * ============================================================ */

interface MegaMenuItemComponentProps {
  item: MegaMenuItem;
  onClose: () => void;
}

const MegaMenuItemComponent: React.FC<MegaMenuItemComponentProps> = ({
  item,
  onClose,
}) => {
  const handleClick = () => {
    item.onClick?.();
    onClose();
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full group flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--muted)]/50 transition-colors text-left"
    >
      {/* Icon */}
      {item.icon && (
        <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          {item.icon}
        </span>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium group-hover:text-primary transition-colors">
            {item.label}
          </span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
              {item.badge}
            </span>
          )}
          {item.external && (
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
        
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </button>
  );
};

/* ============================================================
 * MEGA MENU COLUMN COMPONENT
 * ============================================================ */

interface MegaMenuColumnComponentProps {
  column: MegaMenuColumn;
  onClose: () => void;
}

const MegaMenuColumnComponent: React.FC<MegaMenuColumnComponentProps> = ({
  column,
  onClose,
}) => {
  return (
    <div
      className={cn(
        'space-y-1',
        column.featured && 'bg-primary/5 p-4 rounded-lg border border-primary/20'
      )}
    >
      {column.title && (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {column.title}
        </div>
      )}
      
      <div className="space-y-1">
        {column.items.map((item) => (
          <MegaMenuItemComponent
            key={item.id}
            item={item}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};

/* ============================================================
 * MEGA MENU COMPONENT
 * ============================================================ */

export function MegaMenu({
  sections,
  label,
  icon,
  columns = 3,
  width = 'auto',
  position = 'left',
  variant = 'default',
  className,
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState(sections[0]?.id);
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  const TRIGGER_VARIANTS = {
    default: 'px-4 py-2 bg-background border border-border hover:bg-[var(--muted)]/50',
    ghost: 'px-4 py-2 hover:bg-[var(--muted)]/50',
    link: 'px-2 py-1 hover:underline',
  };
  
  const POSITION_STYLES = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  };
  
  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];
  
  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg font-medium text-sm transition-colors',
          TRIGGER_VARIANTS[variant],
          isOpen && 'bg-[var(--muted)]'
        )}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 bg-background border border-border rounded-lg shadow-xl z-50',
            POSITION_STYLES[position]
          )}
          style={{ width: width === 'auto' ? undefined : width }}
        >
          <div className="flex">
            {/* Section Tabs (if multiple sections) */}
            {sections.length > 1 && (
              <div className="w-48 border-r border-border p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm rounded-lg transition-colors',
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-[var(--muted)]/50'
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 p-6">
              {currentSection && (
                <>
                  {/* Columns */}
                  <div
                    className="grid gap-6"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(
                        currentSection.columns.length,
                        columns
                      )}, minmax(0, 1fr))`,
                    }}
                  >
                    {currentSection.columns.map((column) => (
                      <MegaMenuColumnComponent
                        key={column.id}
                        column={column}
                        onClose={() => setIsOpen(false)}
                      />
                    ))}
                  </div>
                  
                  {/* Footer */}
                  {currentSection.footer && (
                    <div className="mt-6 pt-6 border-t border-border">
                      {currentSection.footer}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * SIMPLE MEGA MENU (Single Section)
 * ============================================================ */

export interface SimpleMegaMenuProps {
  label: string;
  columns: MegaMenuColumn[];
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  columnsCount?: number;
  className?: string;
}

export function SimpleMegaMenu({
  label,
  columns,
  icon,
  footer,
  columnsCount = 3,
  className,
}: SimpleMegaMenuProps) {
  return (
    <MegaMenu
      label={label}
      icon={icon}
      sections={[
        {
          id: 'default',
          label,
          columns,
          footer,
        },
      ]}
      columns={columnsCount}
      className={className}
    />
  );
}

/* ============================================================
 * MEGA MENU FEATURED CARD
 * ============================================================ */

export interface MegaMenuFeaturedCardProps {
  title: string;
  description: string;
  image?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function MegaMenuFeaturedCard({
  title,
  description,
  image,
  cta,
  className,
}: MegaMenuFeaturedCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20',
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          {cta.label}
        </button>
      )}
    </div>
  );
}
