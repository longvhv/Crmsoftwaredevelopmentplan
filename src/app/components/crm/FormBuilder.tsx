/* ============================================================
 * FormBuilder Component
 * Dynamic form builder with validation and layouts
 * ============================================================ */

import { useCallback, useMemo } from "react";
import { Controller, type FieldValues, type Path } from "react-hook-form";
import type { UseFormBaseReturn } from "@/hooks/forms/useFormBase";
import type { FieldType, FormSection, FormTab } from "@/types/forms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ValidationDisplay } from "./ValidationDisplay";

/* ============================================================
 * Field Configuration
 * ============================================================ */

export interface FieldConfig<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: unknown;
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  render?: (props: {
    field: {
      value: unknown;
      onChange: (value: unknown) => void;
      onBlur: () => void;
    };
    error?: string;
  }) => React.ReactNode;
}

/* ============================================================
 * Section/Layout Configuration
 * ============================================================ */

export interface FormBuilderSection {
  id: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  columns?: 1 | 2 | 3;
  className?: string;
}

export interface FormBuilderTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  sections: FormBuilderSection[];
}

/* ============================================================
 * Component Props
 * ============================================================ */

export interface FormBuilderProps<T extends FieldValues> {
  formHook: UseFormBaseReturn<T>;
  sections?: FormBuilderSection[];
  tabs?: FormBuilderTab[];
  columns?: 1 | 2 | 3;
  showSubmit?: boolean;
  showReset?: boolean;
  showCancel?: boolean;
  submitText?: string;
  resetText?: string;
  cancelText?: string;
  className?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

/* ============================================================
 * Field Renderer
 * ============================================================ */

function FieldRenderer<T extends FieldValues>({
  config,
  formHook,
}: {
  config: FieldConfig<T>;
  formHook: UseFormBaseReturn<T>;
}) {
  const { form } = formHook;
  const error = form.formState.errors[config.name]?.message as
    | string
    | undefined;

  return (
    <div className={cn("space-y-2", config.className)}>
      {config.label && (
        <Label htmlFor={config.name} className="flex items-center gap-1">
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {config.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {config.description}
        </p>
      )}

      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => {
          // Custom render function
          if (config.render) {
            return config.render({ field, error });
          }

          // Standard field types
          switch (config.type) {
            case "text":
            case "email":
            case "tel":
            case "url":
            case "password":
            case "number":
              return (
                <Input
                  {...field}
                  id={config.name}
                  type={config.type}
                  placeholder={config.placeholder}
                  disabled={config.disabled}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      config.type === "number"
                        ? e.target.valueAsNumber
                        : e.target.value
                    )
                  }
                  className={cn(error && "border-red-500")}
                />
              );

            case "textarea":
              return (
                <Textarea
                  {...field}
                  id={config.name}
                  placeholder={config.placeholder}
                  disabled={config.disabled}
                  rows={config.rows ?? 4}
                  value={field.value ?? ""}
                  className={cn(error && "border-red-500")}
                />
              );

            case "select":
              return (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={config.disabled}
                >
                  <SelectTrigger
                    id={config.name}
                    className={cn(error && "border-red-500")}
                  >
                    <SelectValue placeholder={config.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );

            case "checkbox":
              return (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={config.name}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={config.disabled}
                  />
                  {config.placeholder && (
                    <label
                      htmlFor={config.name}
                      className="text-sm cursor-pointer"
                    >
                      {config.placeholder}
                    </label>
                  )}
                </div>
              );

            case "switch":
              return (
                <div className="flex items-center gap-2">
                  <Switch
                    id={config.name}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={config.disabled}
                  />
                  {config.placeholder && (
                    <label
                      htmlFor={config.name}
                      className="text-sm cursor-pointer"
                    >
                      {config.placeholder}
                    </label>
                  )}
                </div>
              );

            case "file":
              return (
                <Input
                  id={config.name}
                  type="file"
                  accept={config.accept}
                  multiple={config.multiple}
                  disabled={config.disabled}
                  onChange={(e) => {
                    const files = e.target.files;
                    field.onChange(config.multiple ? files : files?.[0]);
                  }}
                  className={cn(error && "border-red-500")}
                />
              );

            default:
              return (
                <Input
                  {...field}
                  id={config.name}
                  placeholder={config.placeholder}
                  disabled={config.disabled}
                  value={field.value ?? ""}
                  className={cn(error && "border-red-500")}
                />
              );
          }
        }}
      />

      {error && <ValidationDisplay error={error} />}
    </div>
  );
}

/* ============================================================
 * Section Renderer
 * ============================================================ */

function SectionRenderer<T extends FieldValues>({
  section,
  formHook,
}: {
  section: FormBuilderSection;
  formHook: UseFormBaseReturn<T>;
}) {
  const gridClass = useMemo(() => {
    const cols = section.columns ?? 1;
    return {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    }[cols];
  }, [section.columns]);

  const content = (
    <div className="space-y-4">
      {section.title && (
        <div>
          <h3 className="text-lg font-semibold">{section.title}</h3>
          {section.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {section.description}
            </p>
          )}
        </div>
      )}
      <div className={cn("grid gap-4", gridClass, section.className)}>
        {section.fields.map((field) => (
          <FieldRenderer key={field.name} config={field} formHook={formHook} />
        ))}
      </div>
    </div>
  );

  if (section.collapsible) {
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={section.defaultCollapsed ? undefined : section.id}
      >
        <AccordionItem value={section.id}>
          <AccordionTrigger>{section.title || "Section"}</AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return <div className="space-y-4">{content}</div>;
}

/* ============================================================
 * FormBuilder Component
 * ============================================================ */

export function FormBuilder<T extends FieldValues>({
  formHook,
  sections,
  tabs,
  columns = 1,
  showSubmit = true,
  showReset = false,
  showCancel = false,
  submitText = "Submit",
  resetText = "Reset",
  cancelText = "Cancel",
  className,
  onSubmit,
  onCancel,
}: FormBuilderProps<T>) {
  const { handleSubmit, handleReset, handleCancel, isSubmitting, canSubmit } =
    formHook;

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
      } else {
        handleSubmit();
      }
    },
    [onSubmit, handleSubmit]
  );

  const handleFormCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      handleCancel();
    }
  }, [onCancel, handleCancel]);

  // Default single-column sections if no layout provided
  const defaultSections = useMemo(() => {
    if (sections || tabs) return null;
    return [
      {
        id: "default",
        fields: [],
        columns,
      },
    ];
  }, [sections, tabs, columns]);

  return (
    <form onSubmit={handleFormSubmit} className={cn("space-y-6", className)}>
      {/* Tab-based layout */}
      {tabs && tabs.length > 0 && (
        <Tabs defaultValue={tabs[0].id}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {tab.sections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section}
                  formHook={formHook}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Section-based layout */}
      {!tabs && sections && sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              formHook={formHook}
            />
          ))}
        </div>
      )}

      {/* Default layout */}
      {!tabs && !sections && defaultSections && (
        <div className="space-y-6">
          {defaultSections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              formHook={formHook}
            />
          ))}
        </div>
      )}

      {/* Form Actions */}
      {(showSubmit || showReset || showCancel) && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleFormCancel}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
          )}
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              {resetText}
            </Button>
          )}
          {showSubmit && (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Submitting..." : submitText}
            </Button>
          )}
        </div>
      )}
    </form>
  );
}
