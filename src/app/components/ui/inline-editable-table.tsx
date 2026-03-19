import * as React from "react";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "./utils";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/* ============================================================
 * TYPES
 * ============================================================ */

export type EditableType = "text" | "number" | "email" | "textarea" | "select" | "date";

export interface EditableCellProps {
  value: any;
  type?: EditableType;
  options?: Array<{ label: string; value: string }>;
  onSave: (value: any) => Promise<void> | void;
  onCancel?: () => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  className?: string;
}

export interface EditableTableCellProps extends Omit<EditableCellProps, "onSave"> {
  rowId: string | number;
  columnId: string;
  onSave: (rowId: string | number, columnId: string, value: any) => Promise<void> | void;
  renderDisplay?: (value: any) => React.ReactNode;
}

/* ============================================================
 * EDITABLE CELL COMPONENT
 * ============================================================ */

export const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  type = "text",
  options = [],
  onSave,
  onCancel,
  disabled = false,
  placeholder,
  required = false,
  maxLength,
  min,
  max,
  className,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing) {
      if (type === "textarea") {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      } else {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
  }, [isEditing, type]);

  const handleStartEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setValue(initialValue);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(initialValue);
    setError(null);
    onCancel?.();
  };

  const handleSave = async () => {
    // Validation
    if (required && !value) {
      setError("This field is required");
      return;
    }

    if (type === "number") {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        setError("Please enter a valid number");
        return;
      }
      if (min !== undefined && numValue < min) {
        setError(`Value must be at least ${min}`);
        return;
      }
      if (max !== undefined && numValue > max) {
        setError(`Value must be at most ${max}`);
        return;
      }
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid email");
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  // Display mode
  if (!isEditing) {
    return (
      <div
        className={cn(
          "group cursor-pointer px-2 py-1 -mx-2 -my-1 rounded hover:bg-accent/50 transition-colors min-h-[2rem] flex items-center",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleStartEdit}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleStartEdit();
          }
        }}
      >
        <span className={cn("flex-1", !initialValue && "text-muted-foreground italic")}>
          {initialValue || placeholder || "Click to edit"}
        </span>
        {!disabled && (
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-xs text-muted-foreground transition-opacity">
            Edit
          </span>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="relative">
      <div className="flex items-start gap-1">
        {/* Input Field */}
        <div className="flex-1 min-w-0">
          {type === "select" ? (
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === "textarea" ? (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              className={cn(
                "min-h-[5rem] text-sm",
                error && "border-[var(--error)] focus-visible:ring-[var(--error)]"
              )}
              disabled={isSaving}
            />
          ) : (
            <Input
              ref={inputRef}
              type={type === "number" ? "number" : type === "email" ? "email" : type === "date" ? "date" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              min={min}
              max={max}
              className={cn(
                "h-8 text-sm",
                error && "border-[var(--error)] focus-visible:ring-[var(--error)]"
              )}
              disabled={isSaving}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="p-1 rounded hover:bg-[var(--success)]/10 text-[var(--success)] transition-colors disabled:opacity-50"
            aria-label="Save"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="p-1 rounded hover:bg-[var(--error)]/10 text-[var(--error)] transition-colors disabled:opacity-50"
            aria-label="Cancel"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-xs text-[var(--error)]">
          {error}
        </div>
      )}
    </div>
  );
};

EditableCell.displayName = "EditableCell";

/* ============================================================
 * EDITABLE TABLE CELL (WITH ROW/COLUMN CONTEXT)
 * ============================================================ */

export const EditableTableCell: React.FC<EditableTableCellProps> = ({
  value,
  rowId,
  columnId,
  onSave,
  renderDisplay,
  ...props
}) => {
  const handleSave = async (newValue: any) => {
    await onSave(rowId, columnId, newValue);
  };

  if (!props.disabled && renderDisplay) {
    const [isEditing, setIsEditing] = React.useState(false);

    if (!isEditing) {
      return (
        <div
          className="group cursor-pointer px-2 py-1 -mx-2 -my-1 rounded hover:bg-accent/50 transition-colors min-h-[2rem] flex items-center"
          onClick={() => setIsEditing(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsEditing(true);
            }
          }}
        >
          <span className="flex-1">{renderDisplay(value)}</span>
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-xs text-muted-foreground transition-opacity">
            Edit
          </span>
        </div>
      );
    }

    return (
      <EditableCell
        value={value}
        onSave={async (newValue) => {
          await handleSave(newValue);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        {...props}
      />
    );
  }

  return (
    <EditableCell
      value={value}
      onSave={handleSave}
      {...props}
    />
  );
};

EditableTableCell.displayName = "EditableTableCell";
