import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface ExpandableRowProps {
  isExpanded: boolean;
  onToggle: () => void;
  expandedContent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  expandedClassName?: string;
  level?: number;
}

export interface UseExpandableRowsOptions {
  defaultExpandedRows?: Set<string | number>;
  expandedRows?: Set<string | number>;
  onExpandedChange?: (expandedRows: Set<string | number>) => void;
  singleExpand?: boolean;
}

export interface UseExpandableRowsReturn {
  expandedRows: Set<string | number>;
  isExpanded: (rowId: string | number) => boolean;
  toggleRow: (rowId: string | number) => void;
  expandRow: (rowId: string | number) => void;
  collapseRow: (rowId: string | number) => void;
  expandAll: (rowIds: Array<string | number>) => void;
  collapseAll: () => void;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useExpandableRows = ({
  defaultExpandedRows = new Set(),
  expandedRows: controlledExpandedRows,
  onExpandedChange,
  singleExpand = false,
}: UseExpandableRowsOptions = {}): UseExpandableRowsReturn => {
  const [internalExpandedRows, setInternalExpandedRows] = React.useState<Set<string | number>>(
    defaultExpandedRows
  );

  const expandedRows = controlledExpandedRows ?? internalExpandedRows;

  const setExpandedRows = React.useCallback(
    (newExpandedRows: Set<string | number>) => {
      if (onExpandedChange) {
        onExpandedChange(newExpandedRows);
      } else {
        setInternalExpandedRows(newExpandedRows);
      }
    },
    [onExpandedChange]
  );

  const isExpanded = React.useCallback(
    (rowId: string | number) => expandedRows.has(rowId),
    [expandedRows]
  );

  const toggleRow = React.useCallback(
    (rowId: string | number) => {
      const newExpandedRows = new Set(expandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
      } else {
        if (singleExpand) {
          newExpandedRows.clear();
        }
        newExpandedRows.add(rowId);
      }
      setExpandedRows(newExpandedRows);
    },
    [expandedRows, setExpandedRows, singleExpand]
  );

  const expandRow = React.useCallback(
    (rowId: string | number) => {
      const newExpandedRows = new Set(expandedRows);
      if (singleExpand) {
        newExpandedRows.clear();
      }
      newExpandedRows.add(rowId);
      setExpandedRows(newExpandedRows);
    },
    [expandedRows, setExpandedRows, singleExpand]
  );

  const collapseRow = React.useCallback(
    (rowId: string | number) => {
      const newExpandedRows = new Set(expandedRows);
      newExpandedRows.delete(rowId);
      setExpandedRows(newExpandedRows);
    },
    [expandedRows, setExpandedRows]
  );

  const expandAll = React.useCallback(
    (rowIds: Array<string | number>) => {
      setExpandedRows(new Set(rowIds));
    },
    [setExpandedRows]
  );

  const collapseAll = React.useCallback(() => {
    setExpandedRows(new Set());
  }, [setExpandedRows]);

  return {
    expandedRows,
    isExpanded,
    toggleRow,
    expandRow,
    collapseRow,
    expandAll,
    collapseAll,
  };
};

/* ============================================================
 * EXPANDABLE ROW COMPONENT
 * ============================================================ */

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  isExpanded,
  onToggle,
  expandedContent,
  children,
  className,
  expandedClassName,
  level = 0,
}) => {
  return (
    <>
      {/* Main Row */}
      <tr
        className={cn(
          "border-b border-border transition-colors hover:bg-accent/50",
          isExpanded && "bg-accent/30",
          className
        )}
      >
        {children}
      </tr>

      {/* Expanded Content Row */}
      {isExpanded && (
        <tr
          className={cn(
            "border-b border-border bg-accent/20",
            expandedClassName
          )}
        >
          <td colSpan={100} className="p-0">
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                isExpanded ? "animate-in slide-in-from-top-2" : "animate-out slide-out-to-top-2"
              )}
              style={{
                paddingLeft: `${(level + 1) * 1.5}rem`,
              }}
            >
              <div className="p-4">
                {expandedContent}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

ExpandableRow.displayName = "ExpandableRow";

/* ============================================================
 * EXPAND TOGGLE BUTTON
 * ============================================================ */

export interface ExpandToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export const ExpandToggle: React.FC<ExpandToggleProps> = ({
  isExpanded,
  onToggle,
  disabled = false,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center p-1 rounded hover:bg-accent transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isExpanded ? "Collapse row" : "Expand row"}
      aria-expanded={isExpanded}
    >
      {isExpanded ? (
        <ChevronDown className="size-4 text-muted-foreground" />
      ) : (
        <ChevronRight className="size-4 text-muted-foreground" />
      )}
    </button>
  );
};

ExpandToggle.displayName = "ExpandToggle";

/* ============================================================
 * NESTED TABLE ROW (WITH CHILDREN)
 * ============================================================ */

export interface NestedRowData {
  id: string | number;
  children?: NestedRowData[];
  [key: string]: any;
}

export interface RenderNestedRowProps<T extends NestedRowData> {
  row: T;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  renderCell: (row: T, level: number) => React.ReactNode;
}

export const RenderNestedRow = <T extends NestedRowData>({
  row,
  level,
  isExpanded,
  onToggle,
  renderCell,
}: RenderNestedRowProps<T>): React.ReactElement => {
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      {/* Parent Row */}
      <tr
        className={cn(
          "border-b border-border transition-colors hover:bg-accent/50",
          isExpanded && hasChildren && "bg-accent/30"
        )}
        style={{
          paddingLeft: `${level * 1.5}rem`,
        }}
      >
        <td className="p-2" style={{ paddingLeft: `${level * 1.5}rem` }}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <ExpandToggle isExpanded={isExpanded} onToggle={onToggle} />
            ) : (
              <div className="size-6" />
            )}
            {renderCell(row, level)}
          </div>
        </td>
      </tr>

      {/* Children Rows */}
      {hasChildren && isExpanded && row.children!.map((child) => (
        <RenderNestedRow
          key={child.id}
          row={child as T}
          level={level + 1}
          isExpanded={false}
          onToggle={() => {}}
          renderCell={renderCell}
        />
      ))}
    </>
  );
};

/* ============================================================
 * UTILITY: FLATTEN TREE
 * ============================================================ */

export const flattenTree = <T extends NestedRowData>(
  data: T[],
  level = 0
): Array<T & { level: number; hasChildren: boolean }> => {
  const result: Array<T & { level: number; hasChildren: boolean }> = [];

  for (const item of data) {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    result.push({
      ...item,
      level,
      hasChildren,
    });

    if (hasChildren) {
      result.push(...flattenTree(item.children as T[], level + 1));
    }
  }

  return result;
};
