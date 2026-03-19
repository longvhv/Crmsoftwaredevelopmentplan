/* ============================================================
 * Form Hooks - Central Export
 * All form hooks in one place
 * ============================================================ */

// Base form hook
export { useFormBase, createFormHook } from "./useFormBase";
export type { UseFormBaseOptions, UseFormBaseReturn } from "./useFormBase";

// Entity form hooks
export { useContactForm } from "./useContactForm";
export type { UseContactFormOptions, UseContactFormReturn } from "./useContactForm";

export { useDealForm } from "./useDealForm";
export type { UseDealFormOptions, UseDealFormReturn } from "./useDealForm";

export { useLeadForm } from "./useLeadForm";
export type { UseLeadFormOptions, UseLeadFormReturn } from "./useLeadForm";

export { useActivityForm } from "./useActivityForm";
export type { UseActivityFormOptions, UseActivityFormReturn } from "./useActivityForm";

// Quick form hooks
export {
  useQuickForm,
  useQuickContactForm,
  useQuickDealForm,
  useQuickLeadForm,
  useQuickTaskForm,
  quickFormMetadata,
  getQuickFormTitle,
  getQuickFormDescription,
  getQuickFormFields,
} from "./useQuickForm";
export type {
  QuickCreateEntity,
  UseQuickFormOptions,
  UseQuickContactFormOptions,
  UseQuickDealFormOptions,
  UseQuickLeadFormOptions,
  UseQuickTaskFormOptions,
} from "./useQuickForm";
