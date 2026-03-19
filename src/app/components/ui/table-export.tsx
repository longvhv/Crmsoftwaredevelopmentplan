import * as React from "react";
import { cn } from "./utils";
import { Download, FileText, FileSpreadsheet, FileImage } from "lucide-react";

/* ============================================================
 * TABLE EXPORT - Export table data to various formats
 * ============================================================
 * Supports CSV, Excel (XLSX simulation), and PDF (via print)
 * No external dependencies - pure browser APIs
 */

export interface ExportColumn<T = any> {
  key: string;
  header: string;
  getValue?: (row: T, index: number) => string | number;
  width?: number;
}

export interface ExportOptions<T = any> {
  /**
   * Data to export
   */
  data: T[];
  
  /**
   * Columns to export
   */
  columns: ExportColumn<T>[];
  
  /**
   * File name (without extension)
   * @default 'export'
   */
  filename?: string;
  
  /**
   * Include header row
   * @default true
   */
  includeHeaders?: boolean;
  
  /**
   * Date format for filename
   * @default 'YYYY-MM-DD'
   */
  dateFormat?: string;
}

/* ============================================================
 * CSV EXPORT
 * ============================================================ */

export function exportToCSV<T = any>({
  data,
  columns,
  filename = 'export',
  includeHeaders = true,
}: ExportOptions<T>): void {
  // Build CSV content
  const rows: string[] = [];
  
  // Add headers
  if (includeHeaders) {
    const headers = columns.map((col) => escapeCSV(col.header));
    rows.push(headers.join(','));
  }
  
  // Add data rows
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const cells = columns.map((col) => {
      let value: string | number;
      
      if (col.getValue) {
        value = col.getValue(row, i);
      } else {
        value = (row as any)[col.key] ?? '';
      }
      
      return escapeCSV(String(value));
    });
    
    rows.push(cells.join(','));
  }
  
  // Create CSV blob
  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Download
  downloadBlob(blob, `${filename}_${getDateString()}.csv`);
}

function escapeCSV(value: string): string {
  // Escape quotes and wrap in quotes if necessary
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/* ============================================================
 * EXCEL (XLSX) EXPORT - HTML TABLE METHOD
 * ============================================================
 * Creates an Excel-compatible HTML table and downloads as .xls
 * For true .xlsx, use a library like xlsx/sheetjs
 */

export function exportToExcel<T = any>({
  data,
  columns,
  filename = 'export',
  includeHeaders = true,
}: ExportOptions<T>): void {
  // Build HTML table
  let html = '<html><head><meta charset="utf-8"/></head><body><table>';
  
  // Add headers
  if (includeHeaders) {
    html += '<thead><tr>';
    for (const col of columns) {
      html += `<th>${escapeHTML(col.header)}</th>`;
    }
    html += '</tr></thead>';
  }
  
  // Add data rows
  html += '<tbody>';
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    html += '<tr>';
    
    for (const col of columns) {
      let value: string | number;
      
      if (col.getValue) {
        value = col.getValue(row, i);
      } else {
        value = (row as any)[col.key] ?? '';
      }
      
      html += `<td>${escapeHTML(String(value))}</td>`;
    }
    
    html += '</tr>';
  }
  html += '</tbody></table></body></html>';
  
  // Create blob with Excel MIME type
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  
  // Download
  downloadBlob(blob, `${filename}_${getDateString()}.xls`);
}

function escapeHTML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
 * PDF EXPORT - PRINT TO PDF
 * ============================================================
 * Opens print dialog which allows saving as PDF
 */

export function exportToPDF<T = any>({
  data,
  columns,
  filename = 'export',
  includeHeaders = true,
}: ExportOptions<T>): void {
  // Create a temporary div
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }
  
  // Build HTML
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>${filename}</title>
      <style>
        @media print {
          @page { margin: 0.5in; }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          margin: 20px;
        }
        h1 {
          font-size: 18px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background-color: #f9fafb;
        }
      </style>
    </head>
    <body>
      <h1>${filename}</h1>
      <table>
  `;
  
  // Add headers
  if (includeHeaders) {
    html += '<thead><tr>';
    for (const col of columns) {
      html += `<th>${escapeHTML(col.header)}</th>`;
    }
    html += '</tr></thead>';
  }
  
  // Add data rows
  html += '<tbody>';
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    html += '<tr>';
    
    for (const col of columns) {
      let value: string | number;
      
      if (col.getValue) {
        value = col.getValue(row, i);
      } else {
        value = (row as any)[col.key] ?? '';
      }
      
      html += `<td>${escapeHTML(String(value))}</td>`;
    }
    
    html += '</tr>';
  }
  html += `
      </tbody>
      </table>
    </body>
    </html>
  `;
  
  // Write to print window
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
  };
}

/* ============================================================
 * JSON EXPORT
 * ============================================================ */

export function exportToJSON<T = any>({
  data,
  columns,
  filename = 'export',
}: ExportOptions<T>): void {
  // Convert data using column definitions
  const jsonData = data.map((row, index) => {
    const obj: Record<string, any> = {};
    
    for (const col of columns) {
      let value: string | number;
      
      if (col.getValue) {
        value = col.getValue(row, index);
      } else {
        value = (row as any)[col.key] ?? '';
      }
      
      obj[col.key] = value;
    }
    
    return obj;
  });
  
  // Create JSON blob
  const jsonContent = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  // Download
  downloadBlob(blob, `${filename}_${getDateString()}.json`);
}

/* ============================================================
 * UTILITIES
 * ============================================================ */

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/* ============================================================
 * EXPORT BUTTON COMPONENT
 * ============================================================ */

export interface ExportButtonProps<T = any> {
  /**
   * Data to export
   */
  data: T[];
  
  /**
   * Columns to export
   */
  columns: ExportColumn<T>[];
  
  /**
   * Filename
   * @default 'export'
   */
  filename?: string;
  
  /**
   * Allowed formats
   * @default ['csv', 'excel', 'pdf', 'json']
   */
  formats?: ('csv' | 'excel' | 'pdf' | 'json')[];
  
  /**
   * Button variant
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  
  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Custom button text
   */
  label?: string;
}

export function ExportButton<T = any>({
  data,
  columns,
  filename = 'export',
  formats = ['csv', 'excel', 'pdf', 'json'],
  variant = 'default',
  size = 'md',
  className,
  label = 'Export',
}: ExportButtonProps<T>) {
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
  
  const handleExport = (format: string) => {
    const options = { data, columns, filename };
    
    switch (format) {
      case 'csv':
        exportToCSV(options);
        break;
      case 'excel':
        exportToExcel(options);
        break;
      case 'pdf':
        exportToPDF(options);
        break;
      case 'json':
        exportToJSON(options);
        break;
    }
    
    setShowMenu(false);
  };
  
  const formatIcons = {
    csv: FileText,
    excel: FileSpreadsheet,
    pdf: FileImage,
    json: FileText,
  };
  
  const formatLabels = {
    csv: 'Export as CSV',
    excel: 'Export as Excel',
    pdf: 'Export as PDF',
    json: 'Export as JSON',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };
  
  const variantClasses = {
    default: 'bg-background border border-border hover:bg-[var(--muted)]',
    primary: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'hover:bg-[var(--muted)]',
  };
  
  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg font-medium transition-colors',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        <Download className="w-4 h-4" />
        <span>{label}</span>
      </button>
      
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-xl py-1 min-w-[180px]">
          {formats.map((format) => {
            const Icon = formatIcons[format];
            const formatLabel = formatLabels[format];
            
            return (
              <button
                key={format}
                type="button"
                onClick={() => handleExport(format)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--muted)] transition-colors flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span>{formatLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * EXPORT HOOK
 * ============================================================ */

export interface UseTableExportOptions<T = any> {
  data: T[];
  columns: ExportColumn<T>[];
  filename?: string;
}

export interface UseTableExportReturn {
  exportCSV: () => void;
  exportExcel: () => void;
  exportPDF: () => void;
  exportJSON: () => void;
  isExporting: boolean;
}

export function useTableExport<T = any>({
  data,
  columns,
  filename = 'export',
}: UseTableExportOptions<T>): UseTableExportReturn {
  const [isExporting, setIsExporting] = React.useState(false);
  
  const options = { data, columns, filename };
  
  const exportCSV = React.useCallback(() => {
    setIsExporting(true);
    try {
      exportToCSV(options);
    } finally {
      setIsExporting(false);
    }
  }, [options]);
  
  const exportExcel = React.useCallback(() => {
    setIsExporting(true);
    try {
      exportToExcel(options);
    } finally {
      setIsExporting(false);
    }
  }, [options]);
  
  const exportPDF = React.useCallback(() => {
    setIsExporting(true);
    try {
      exportToPDF(options);
    } finally {
      setIsExporting(false);
    }
  }, [options]);
  
  const exportJSON = React.useCallback(() => {
    setIsExporting(true);
    try {
      exportToJSON(options);
    } finally {
      setIsExporting(false);
    }
  }, [options]);
  
  return {
    exportCSV,
    exportExcel,
    exportPDF,
    exportJSON,
    isExporting,
  };
}
