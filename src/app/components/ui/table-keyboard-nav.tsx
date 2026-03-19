import * as React from "react";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface TableKeyboardNavOptions {
  rowCount: number;
  columnCount: number;
  onCellFocus?: (rowIndex: number, columnIndex: number) => void;
  onCellActivate?: (rowIndex: number, columnIndex: number) => void;
  onSelectRow?: (rowIndex: number, addToSelection: boolean) => void;
  onSelectRange?: (startRow: number, endRow: number) => void;
  enabledColumns?: Set<number>;
  disabled?: boolean;
}

export interface TableKeyboardNavReturn {
  focusedCell: { row: number; column: number } | null;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  focusCell: (rowIndex: number, columnIndex: number) => void;
  getCellProps: (rowIndex: number, columnIndex: number) => {
    tabIndex: number;
    onFocus: () => void;
    "data-row": number;
    "data-column": number;
  };
}

/* ============================================================
 * HOOK: TABLE KEYBOARD NAVIGATION
 * ============================================================ */

export const useTableKeyboardNav = ({
  rowCount,
  columnCount,
  onCellFocus,
  onCellActivate,
  onSelectRow,
  onSelectRange,
  enabledColumns,
  disabled = false,
}: TableKeyboardNavOptions): TableKeyboardNavReturn => {
  const [focusedCell, setFocusedCell] = React.useState<{ row: number; column: number } | null>(
    null
  );
  const lastSelectedRow = React.useRef<number>(0);

  const isColumnEnabled = React.useCallback(
    (columnIndex: number) => {
      if (!enabledColumns) return true;
      return enabledColumns.has(columnIndex);
    },
    [enabledColumns]
  );

  const getNextEnabledColumn = React.useCallback(
    (currentColumn: number, direction: 1 | -1): number => {
      let nextColumn = currentColumn + direction;
      while (nextColumn >= 0 && nextColumn < columnCount) {
        if (isColumnEnabled(nextColumn)) {
          return nextColumn;
        }
        nextColumn += direction;
      }
      return currentColumn;
    },
    [columnCount, isColumnEnabled]
  );

  const focusCell = React.useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (disabled) return;
      
      // Ensure indices are within bounds
      const row = Math.max(0, Math.min(rowIndex, rowCount - 1));
      const column = Math.max(0, Math.min(columnIndex, columnCount - 1));

      // Ensure column is enabled
      if (!isColumnEnabled(column)) {
        return;
      }

      setFocusedCell({ row, column });
      onCellFocus?.(row, column);
    },
    [rowCount, columnCount, disabled, isColumnEnabled, onCellFocus]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled || !focusedCell) return;

      const { row, column } = focusedCell;
      let handled = false;

      switch (e.key) {
        // Arrow Navigation
        case "ArrowUp":
          if (row > 0) {
            focusCell(row - 1, column);
            handled = true;
          }
          break;

        case "ArrowDown":
          if (row < rowCount - 1) {
            focusCell(row + 1, column);
            handled = true;
          }
          break;

        case "ArrowLeft":
          const prevColumn = getNextEnabledColumn(column, -1);
          if (prevColumn !== column) {
            focusCell(row, prevColumn);
            handled = true;
          }
          break;

        case "ArrowRight":
          const nextColumn = getNextEnabledColumn(column, 1);
          if (nextColumn !== column) {
            focusCell(row, nextColumn);
            handled = true;
          }
          break;

        // Home/End
        case "Home":
          if (e.ctrlKey || e.metaKey) {
            // Go to first row
            focusCell(0, column);
          } else {
            // Go to first column
            const firstColumn = getNextEnabledColumn(-1, 1);
            focusCell(row, firstColumn);
          }
          handled = true;
          break;

        case "End":
          if (e.ctrlKey || e.metaKey) {
            // Go to last row
            focusCell(rowCount - 1, column);
          } else {
            // Go to last column
            const lastColumn = getNextEnabledColumn(columnCount, -1);
            focusCell(row, lastColumn);
          }
          handled = true;
          break;

        // Page Up/Down
        case "PageUp":
          focusCell(Math.max(0, row - 10), column);
          handled = true;
          break;

        case "PageDown":
          focusCell(Math.min(rowCount - 1, row + 10), column);
          handled = true;
          break;

        // Enter/Space - Activate cell
        case "Enter":
        case " ":
          onCellActivate?.(row, column);
          handled = true;
          break;

        // Selection
        case "a":
          if (e.ctrlKey || e.metaKey) {
            // Select all (handled by parent)
            handled = true;
          }
          break;
      }

      // Row selection with Shift/Ctrl
      if (onSelectRow && (e.shiftKey || e.ctrlKey || e.metaKey)) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          if (e.shiftKey && onSelectRange) {
            // Range selection
            onSelectRange(lastSelectedRow.current, row);
          } else if (e.ctrlKey || e.metaKey) {
            // Add to selection
            onSelectRow(row, true);
          }
          handled = true;
        } else if (e.key === " ") {
          onSelectRow(row, e.ctrlKey || e.metaKey);
          lastSelectedRow.current = row;
          handled = true;
        }
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [
      disabled,
      focusedCell,
      rowCount,
      columnCount,
      focusCell,
      getNextEnabledColumn,
      onCellActivate,
      onSelectRow,
      onSelectRange,
    ]
  );

  const getCellProps = React.useCallback(
    (rowIndex: number, columnIndex: number) => ({
      tabIndex:
        focusedCell?.row === rowIndex && focusedCell?.column === columnIndex ? 0 : -1,
      onFocus: () => focusCell(rowIndex, columnIndex),
      "data-row": rowIndex,
      "data-column": columnIndex,
    }),
    [focusedCell, focusCell]
  );

  return {
    focusedCell,
    handleKeyDown,
    focusCell,
    getCellProps,
  };
};

/* ============================================================
 * HOOK: RANGE SELECTION
 * ============================================================ */

export interface UseRangeSelectionOptions {
  selectedRows?: Set<number>;
  onSelectionChange?: (selectedRows: Set<number>) => void;
}

export interface UseRangeSelectionReturn {
  selectedRows: Set<number>;
  selectRow: (rowIndex: number, addToSelection?: boolean) => void;
  selectRange: (startRow: number, endRow: number) => void;
  selectAll: (rowCount: number) => void;
  clearSelection: () => void;
  isRowSelected: (rowIndex: number) => boolean;
}

export const useRangeSelection = ({
  selectedRows: controlledSelectedRows,
  onSelectionChange,
}: UseRangeSelectionOptions = {}): UseRangeSelectionReturn => {
  const [internalSelectedRows, setInternalSelectedRows] = React.useState<Set<number>>(new Set());

  const selectedRows = controlledSelectedRows ?? internalSelectedRows;

  const setSelectedRows = React.useCallback(
    (newSelectedRows: Set<number>) => {
      if (onSelectionChange) {
        onSelectionChange(newSelectedRows);
      } else {
        setInternalSelectedRows(newSelectedRows);
      }
    },
    [onSelectionChange]
  );

  const selectRow = React.useCallback(
    (rowIndex: number, addToSelection = false) => {
      const newSelectedRows = addToSelection ? new Set(selectedRows) : new Set<number>();
      
      if (newSelectedRows.has(rowIndex) && addToSelection) {
        newSelectedRows.delete(rowIndex);
      } else {
        newSelectedRows.add(rowIndex);
      }
      
      setSelectedRows(newSelectedRows);
    },
    [selectedRows, setSelectedRows]
  );

  const selectRange = React.useCallback(
    (startRow: number, endRow: number) => {
      const newSelectedRows = new Set(selectedRows);
      const min = Math.min(startRow, endRow);
      const max = Math.max(startRow, endRow);

      for (let i = min; i <= max; i++) {
        newSelectedRows.add(i);
      }

      setSelectedRows(newSelectedRows);
    },
    [selectedRows, setSelectedRows]
  );

  const selectAll = React.useCallback(
    (rowCount: number) => {
      const newSelectedRows = new Set<number>();
      for (let i = 0; i < rowCount; i++) {
        newSelectedRows.add(i);
      }
      setSelectedRows(newSelectedRows);
    },
    [setSelectedRows]
  );

  const clearSelection = React.useCallback(() => {
    setSelectedRows(new Set());
  }, [setSelectedRows]);

  const isRowSelected = React.useCallback(
    (rowIndex: number) => selectedRows.has(rowIndex),
    [selectedRows]
  );

  return {
    selectedRows,
    selectRow,
    selectRange,
    selectAll,
    clearSelection,
    isRowSelected,
  };
};
