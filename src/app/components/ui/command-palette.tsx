import * as React from "react";
import { cn } from "./utils";
import { Search, Command as CommandIcon, ArrowRight, Hash, Clock } from "lucide-react";

/* ============================================================
 * COMMAND PALETTE - Quick action search (Cmd+K)
 * ============================================================
 * Keyboard-first navigation with search, groups, and shortcuts
 */

/* ============================================================
 * TYPES
 * ============================================================ */

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  onSelect: () => void;
  group?: string;
}

export interface CommandGroup {
  id: string;
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  /**
   * Open state
   */
  open: boolean;
  
  /**
   * Open state change handler
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Command items or groups
   */
  items?: CommandItem[];
  groups?: CommandGroup[];
  
  /**
   * Placeholder text
   * @default 'Type a command or search...'
   */
  placeholder?: string;
  
  /**
   * Show keyboard shortcut hint
   * @default true
   */
  showShortcutHint?: boolean;
  
  /**
   * Show recent items
   * @default true
   */
  showRecent?: boolean;
  
  /**
   * Max recent items
   * @default 5
   */
  maxRecent?: number;
  
  /**
   * Empty state message
   */
  emptyMessage?: string;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * COMMAND ITEM COMPONENT
 * ============================================================ */

interface CommandItemComponentProps {
  item: CommandItem;
  selected: boolean;
  onSelect: () => void;
}

const CommandItemComponent: React.FC<CommandItemComponentProps> = ({
  item,
  selected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        selected ? 'bg-primary/10 text-primary' : 'hover:bg-[var(--muted)]/50'
      )}
    >
      {/* Icon */}
      {item.icon && (
        <span className="w-5 h-5 flex-shrink-0 text-muted-foreground">
          {item.icon}
        </span>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium">{item.label}</div>
        {item.description && (
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {item.description}
          </div>
        )}
      </div>
      
      {/* Shortcut */}
      {item.shortcut && (
        <div className="flex items-center gap-1">
          {item.shortcut.map((key, index) => (
            <kbd
              key={index}
              className="px-2 py-1 text-xs bg-[var(--muted)] border border-border rounded"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
      
      {/* Select Indicator */}
      {selected && (
        <ArrowRight className="w-4 h-4 flex-shrink-0" />
      )}
    </button>
  );
};

/* ============================================================
 * COMMAND PALETTE COMPONENT
 * ============================================================ */

export function CommandPalette({
  open,
  onOpenChange,
  items = [],
  groups = [],
  placeholder = 'Type a command or search...',
  showShortcutHint = true,
  showRecent = true,
  maxRecent = 5,
  emptyMessage = 'No results found.',
  className,
}: CommandPaletteProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [recentItems, setRecentItems] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Combine items and groups
  const allGroups = React.useMemo(() => {
    const result: CommandGroup[] = [];
    
    // Add ungrouped items
    if (items.length > 0) {
      result.push({
        id: 'default',
        label: 'Commands',
        items,
      });
    }
    
    // Add groups
    result.push(...groups);
    
    // Add recent items group
    if (showRecent && recentItems.length > 0 && !search) {
      const recent = [...items, ...groups.flatMap((g) => g.items)]
        .filter((item) => recentItems.includes(item.id))
        .slice(0, maxRecent);
      
      if (recent.length > 0) {
        result.unshift({
          id: 'recent',
          label: 'Recent',
          items: recent,
        });
      }
    }
    
    return result;
  }, [items, groups, showRecent, recentItems, search, maxRecent]);
  
  // Filter items by search
  const filteredGroups = React.useMemo(() => {
    if (!search) return allGroups;
    
    const searchLower = search.toLowerCase();
    
    return allGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const labelMatch = item.label.toLowerCase().includes(searchLower);
          const descMatch = item.description?.toLowerCase().includes(searchLower);
          const keywordMatch = item.keywords?.some((kw) =>
            kw.toLowerCase().includes(searchLower)
          );
          
          return labelMatch || descMatch || keywordMatch;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [allGroups, search]);
  
  // Flatten filtered items
  const flatItems = React.useMemo(() => {
    return filteredGroups.flatMap((group) => group.items);
  }, [filteredGroups]);
  
  // Handle keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = flatItems[selectedIndex];
        if (item) {
          handleSelect(item);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, flatItems, onOpenChange]);
  
  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [open]);
  
  // Handle item selection
  const handleSelect = (item: CommandItem) => {
    // Add to recent
    setRecentItems((prev) => {
      const filtered = prev.filter((id) => id !== item.id);
      return [item.id, ...filtered].slice(0, maxRecent);
    });
    
    item.onSelect();
    onOpenChange(false);
  };
  
  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };
  
  if (!open) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'w-full max-w-2xl bg-background rounded-lg shadow-2xl border border-border overflow-hidden',
          className
        )}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {showShortcutHint && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-[var(--muted)] border border-border rounded">
                <CommandIcon className="w-3 h-3 inline" />
              </kbd>
              <kbd className="px-2 py-1 bg-[var(--muted)] border border-border rounded">
                K
              </kbd>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredGroups.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.id} className="py-2">
                {/* Group Header */}
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  {group.id === 'recent' && <Clock className="w-3 h-3" />}
                  {group.label}
                </div>
                
                {/* Group Items */}
                <div>
                  {group.items.map((item) => {
                    const globalIndex = flatItems.indexOf(item);
                    
                    return (
                      <CommandItemComponent
                        key={item.id}
                        item={item}
                        selected={globalIndex === selectedIndex}
                        onSelect={() => handleSelect(item)}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-[var(--muted)]/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">
                  ↵
                </kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">
                  Esc
                </kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * COMMAND PALETTE TRIGGER
 * ============================================================ */

export interface CommandPaletteTriggerProps {
  onTrigger: () => void;
  className?: string;
}

export function CommandPaletteTrigger({
  onTrigger,
  className,
}: CommandPaletteTriggerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onTrigger();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger]);
  
  return (
    <button
      type="button"
      onClick={onTrigger}
      className={cn(
        'flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground bg-[var(--muted)]/30 border border-border rounded-lg hover:bg-[var(--muted)]/50 transition-colors',
        className
      )}
    >
      <Search className="w-4 h-4" />
      <span>Search...</span>
      <kbd className="ml-auto px-2 py-1 text-xs bg-background border border-border rounded">
        <CommandIcon className="w-3 h-3 inline mr-1" />K
      </kbd>
    </button>
  );
}

/* ============================================================
 * HOOK: useCommandPalette
 * ============================================================ */

export function useCommandPalette() {
  const [open, setOpen] = React.useState(false);
  
  return {
    open,
    setOpen,
    toggle: () => setOpen(!open),
  };
}
