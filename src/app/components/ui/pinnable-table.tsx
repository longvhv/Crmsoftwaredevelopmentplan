import * as React from "react";
import { cn } from "./utils";
import { Pin, PinOff } from "lucide-react";

/* ============================================================
 * PINNABLE TABLE - Columns with pinning (freeze left/right)
 * ============================================================
 * Supports pinning columns to left or right side
 * Pinned columns remain visible while scrolling
 */

export interface PinnableTableColumn<T = any> {
  key: string;
  header: string;
  width?: number;
  minWidth?: number;
  pinned?: 'left' | 'right' | false;
  pinnable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface PinnableTableProps<T = any> {
  /**
   * Data array
   */
  data: T[];
  
  /**
   * Column definitions
   */
  columns: PinnableTableColumn<T>[];
  
  /**
   * Row key extractor
   */
  getRowKey: (row: T, index: number) => string;
  
  /**
   * Storage key for persisting pin state
   */
  storageKey?: string;
  
  /**
   * Pin state change handler
   */
  onPinChange?: (key: string, pinned: 'left' | 'right' | false) => void;
  
  /**
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;
  
  /**
   * Custom row className
   */
  rowClassName?: string | ((row: T, index: number) => string);
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Empty state message
   */
  emptyMessage?: string;
  
  /**
   * Sticky header
   * @default true
   */
  stickyHeader?: boolean;
  
  /**
   * Show pin controls
   * @default true
   */
  showPinControls?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/* ============================================================
 * PIN BUTTON COMPONENT
 * ============================================================ */

interface PinButtonProps {
  isPinned: 'left' | 'right' | false;
  onPin: (side: 'left' | 'right') => void;
  onUnpin: () => void;
}

const PinButton: React.FC<PinButtonProps> = ({ isPinned, onPin, onUnpin }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  // Click outside to close
  React.useEffect(() => {
    if (!showMenu) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);
  
  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (isPinned) {
            onUnpin();
          } else {
            setShowMenu(!showMenu);
          }
        }}
        className={cn(
          'p-1 rounded transition-colors',
          isPinned
            ? 'text-primary hover:bg-primary/10'
            : 'text-muted-foreground hover:bg-[var(--muted)]'
        )}
        title={isPinned ? 'Unpin column' : 'Pin column'}
      >
        {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
      </button>
      
      {showMenu && !isPinned && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-lg shadow-xl py-1 min-w-[120px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPin('left');
              setShowMenu(false);
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--muted)] transition-colors"
          >
            Pin Left
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPin('right');
              setShowMenu(false);
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--muted)] transition-colors"
          >
            Pin Right
          </button>
        </div>
      )}
    </div>
  );
};

/* ============================================================
 * PINNABLE TABLE COMPONENT
 * ============================================================ */

export function PinnableTable<T = any>({
  data,
  columns,
  getRowKey,
  storageKey,
  onPinChange,
  onRowClick,
  rowClassName,
  loading = false,
  emptyMessage = 'No data available',
  stickyHeader = true,
  showPinControls = true,
  className,
}: PinnableTableProps<T>) {
  // Initialize pin state from storage or defaults
  const initialPinState = React.useMemo(() => {
    const pinState: Record<string, 'left' | 'right' | false> = {};
    
    // Try to load from storage
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-pin-state`);
        if (stored) {
          const parsed = JSON.parse(stored);
          Object.assign(pinState, parsed);
        }
      } catch (err) {
        console.error('Failed to load pin state:', err);
      }
    }
    
    // Set defaults for columns
    for (const col of columns) {
      if (!pinState[col.key]) {
        pinState[col.key] = col.pinned || false;
      }
    }
    
    return pinState;
  }, [columns, storageKey]);
  
  const [pinState, setPinState] = React.useState<Record<string, 'left' | 'right' | false>>(
    initialPinState
  );
  
  // Save pin state to storage
  const savePinState = React.useCallback(
    (state: Record<string, 'left' | 'right' | false>) => {
      if (storageKey) {
        try {
          localStorage.setItem(`${storageKey}-pin-state`, JSON.stringify(state));
        } catch (err) {
          console.error('Failed to save pin state:', err);
        }
      }
    },
    [storageKey]
  );
  
  // Pin/unpin column
  const togglePin = React.useCallback(
    (key: string, side: 'left' | 'right' | false) => {
      setPinState((prev) => {
        const newState = { ...prev, [key]: side };
        savePinState(newState);
        onPinChange?.(key, side);
        return newState;
      });
    },
    [savePinState, onPinChange]
  );
  
  // Group columns by pin state
  const { leftPinnedColumns, centerColumns, rightPinnedColumns } = React.useMemo(() => {
    const left: PinnableTableColumn<T>[] = [];
    const center: PinnableTableColumn<T>[] = [];
    const right: PinnableTableColumn<T>[] = [];
    
    for (const col of columns) {
      const pin = pinState[col.key];
      if (pin === 'left') {
        left.push(col);
      } else if (pin === 'right') {
        right.push(col);
      } else {
        center.push(col);
      }
    }
    
    return {
      leftPinnedColumns: left,
      centerColumns: center,
      rightPinnedColumns: right,
    };
  }, [columns, pinState]);
  
  // Calculate positions for pinned columns
  const leftPinnedWidth = React.useMemo(() => {
    return leftPinnedColumns.reduce((acc, col) => acc + (col.width || 150), 0);
  }, [leftPinnedColumns]);
  
  const rightPinnedWidth = React.useMemo(() => {
    return rightPinnedColumns.reduce((acc, col) => acc + (col.width || 150), 0);
  }, [rightPinnedColumns]);
  
  // Get row class
  const getRowClassName = React.useCallback(
    (row: T, index: number) => {
      if (typeof rowClassName === 'function') {
        return rowClassName(row, index);
      }
      return rowClassName || '';
    },
    [rowClassName]
  );
  
  // Render column header
  const renderColumnHeader = (col: PinnableTableColumn<T>, isPinned: 'left' | 'right' | false) => {
    const isPinnable = col.pinnable !== false;
    
    return (
      <div className="flex items-center gap-2">
        <span className="truncate flex-1">{col.header}</span>
        {showPinControls && isPinnable && (
          <PinButton
            isPinned={isPinned}
            onPin={(side) => togglePin(col.key, side)}
            onUnpin={() => togglePin(col.key, false)}
          />
        )}
      </div>
    );
  };
  
  // Render column group
  const renderColumnGroup = (
    cols: PinnableTableColumn<T>[],
    position: 'left' | 'center' | 'right'
  ) => {
    if (cols.length === 0) return null;
    
    const isPinned = position !== 'center';
    const pinnedClass = isPinned
      ? position === 'left'
        ? 'sticky left-0 z-10 bg-background'
        : 'sticky right-0 z-10 bg-background'
      : '';
    
    return cols.map((col, index) => {
      const width = col.width || 150;
      let left = 0;
      let right = 0;
      
      if (position === 'left') {
        left = leftPinnedColumns.slice(0, index).reduce((acc, c) => acc + (c.width || 150), 0);
      } else if (position === 'right') {
        right = rightPinnedColumns
          .slice(index + 1)
          .reduce((acc, c) => acc + (c.width || 150), 0);
      }
      
      return (
        <th
          key={col.key}
          className={cn(
            'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
            pinnedClass,
            col.headerClassName
          )}
          style={{
            width,
            minWidth: col.minWidth,
            ...(position === 'left' && { left }),
            ...(position === 'right' && { right }),
          }}
        >
          {renderColumnHeader(col, position === 'center' ? false : position)}
        </th>
      );
    });
  };
  
  // Render cell group
  const renderCellGroup = (
    row: T,
    index: number,
    cols: PinnableTableColumn<T>[],
    position: 'left' | 'center' | 'right'
  ) => {
    if (cols.length === 0) return null;
    
    const isPinned = position !== 'center';
    const pinnedClass = isPinned
      ? position === 'left'
        ? 'sticky left-0 z-10 bg-background'
        : 'sticky right-0 z-10 bg-background'
      : '';
    
    return cols.map((col, colIndex) => {
      const width = col.width || 150;
      let left = 0;
      let right = 0;
      
      if (position === 'left') {
        left = leftPinnedColumns.slice(0, colIndex).reduce((acc, c) => acc + (c.width || 150), 0);
      } else if (position === 'right') {
        right = rightPinnedColumns
          .slice(colIndex + 1)
          .reduce((acc, c) => acc + (c.width || 150), 0);
      }
      
      return (
        <td
          key={col.key}
          className={cn('px-4 py-3 text-sm', pinnedClass, col.className)}
          style={{
            width,
            minWidth: col.minWidth,
            ...(position === 'left' && { left }),
            ...(position === 'right' && { right }),
          }}
        >
          <div className="truncate">
            {col.render ? col.render(row, index) : (row as any)[col.key]}
          </div>
        </td>
      );
    });
  };
  
  return (
    <div className={cn('relative border border-border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          {/* Header */}
          <thead
            className={cn(
              'border-b border-border bg-[var(--muted)]/30',
              stickyHeader && 'sticky top-0 z-20'
            )}
          >
            <tr>
              {renderColumnGroup(leftPinnedColumns, 'left')}
              {renderColumnGroup(centerColumns, 'center')}
              {renderColumnGroup(rightPinnedColumns, 'right')}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const key = getRowKey(row, index);
                
                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-b border-border transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-[var(--muted)]/50',
                      getRowClassName(row, index)
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {renderCellGroup(row, index, leftPinnedColumns, 'left')}
                    {renderCellGroup(row, index, centerColumns, 'center')}
                    {renderCellGroup(row, index, rightPinnedColumns, 'right')}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
 * COLUMN PINNING HOOK
 * ============================================================ */

export interface UseColumnPinningOptions {
  columns: PinnableTableColumn[];
  storageKey?: string;
  onPinChange?: (key: string, pinned: 'left' | 'right' | false) => void;
}

export interface UseColumnPinningReturn {
  pinState: Record<string, 'left' | 'right' | false>;
  isPinned: (key: string) => 'left' | 'right' | false;
  pinLeft: (key: string) => void;
  pinRight: (key: string) => void;
  unpin: (key: string) => void;
  toggle: (key: string, side: 'left' | 'right') => void;
}

export function useColumnPinning({
  columns,
  storageKey,
  onPinChange,
}: UseColumnPinningOptions): UseColumnPinningReturn {
  const defaultPinState = React.useMemo(() => {
    const state: Record<string, 'left' | 'right' | false> = {};
    
    // Load from storage
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-pin-state`);
        if (stored) {
          Object.assign(state, JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load pin state:', err);
      }
    }
    
    // Set defaults
    for (const col of columns) {
      if (!state[col.key]) {
        state[col.key] = col.pinned || false;
      }
    }
    
    return state;
  }, [columns, storageKey]);
  
  const [pinState, setPinState] = React.useState<Record<string, 'left' | 'right' | false>>(
    defaultPinState
  );
  
  const saveState = React.useCallback(
    (state: Record<string, 'left' | 'right' | false>) => {
      if (storageKey) {
        try {
          localStorage.setItem(`${storageKey}-pin-state`, JSON.stringify(state));
        } catch (err) {
          console.error('Failed to save pin state:', err);
        }
      }
      onPinChange?.(Object.keys(state)[0], Object.values(state)[0]);
    },
    [storageKey, onPinChange]
  );
  
  const updatePin = React.useCallback(
    (key: string, side: 'left' | 'right' | false) => {
      setPinState((prev) => {
        const newState = { ...prev, [key]: side };
        saveState(newState);
        return newState;
      });
    },
    [saveState]
  );
  
  const isPinned = React.useCallback((key: string) => pinState[key] || false, [pinState]);
  
  const pinLeft = React.useCallback((key: string) => updatePin(key, 'left'), [updatePin]);
  
  const pinRight = React.useCallback((key: string) => updatePin(key, 'right'), [updatePin]);
  
  const unpin = React.useCallback((key: string) => updatePin(key, false), [updatePin]);
  
  const toggle = React.useCallback(
    (key: string, side: 'left' | 'right') => {
      const current = pinState[key];
      updatePin(key, current === side ? false : side);
    },
    [pinState, updatePin]
  );
  
  return {
    pinState,
    isPinned,
    pinLeft,
    pinRight,
    unpin,
    toggle,
  };
}
