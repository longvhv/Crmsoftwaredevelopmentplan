/* ============================================================
 * Quick Form Hook
 * Simplified form hook for quick-create modals
 * ============================================================ */

import { useCallback } from "react";
import { useFormBase } from "./useFormBase";
import {
  quickContactSchema,
  quickDealSchema,
  quickLeadSchema,
  quickTaskSchema,
  type QuickContactData,
  type QuickDealData,
  type QuickLeadData,
  type QuickTaskData,
} from "@/schemas/validation";
import { useCreateContact, useCreateDeal, useCreateLead } from "@/hooks/queries";
import type { Contact, Deal, Lead, Activity } from "@/types/crm";
import { transformToApiFormat } from "@/utils/formUtils";
import { addDays } from "date-fns";

/* ============================================================
 * Quick Create Types
 * ============================================================ */

export type QuickCreateEntity = "contact" | "deal" | "lead" | "task";

/* ============================================================
 * Quick Contact Form
 * ============================================================ */

export interface UseQuickContactFormOptions {
  onSuccess?: (contact: Contact) => void;
  onCancel?: () => void;
}

export function useQuickContactForm({
  onSuccess,
  onCancel,
}: UseQuickContactFormOptions = {}) {
  const createContact = useCreateContact();

  const handleSubmit = useCallback(
    async (data: QuickContactData) => {
      const apiData = transformToApiFormat(data);
      const newContact = await createContact.mutateAsync(
        apiData as Parameters<typeof createContact.mutateAsync>[0]
      );
      onSuccess?.(newContact);
    },
    [createContact, onSuccess]
  );

  return useFormBase<QuickContactData>({
    schema: quickContactSchema,
    config: {
      mode: "create",
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        contactType: "customer",
      },
      onSubmit: handleSubmit,
      onCancel,
      resetOnSuccess: true,
    },
  });
}

/* ============================================================
 * Quick Deal Form
 * ============================================================ */

export interface UseQuickDealFormOptions {
  contactId?: string;
  onSuccess?: (deal: Deal) => void;
  onCancel?: () => void;
}

export function useQuickDealForm({
  contactId,
  onSuccess,
  onCancel,
}: UseQuickDealFormOptions = {}) {
  const createDeal = useCreateDeal();

  const handleSubmit = useCallback(
    async (data: QuickDealData) => {
      const apiData = transformToApiFormat(data);
      const newDeal = await createDeal.mutateAsync(
        apiData as Parameters<typeof createDeal.mutateAsync>[0]
      );
      onSuccess?.(newDeal);
    },
    [createDeal, onSuccess]
  );

  return useFormBase<QuickDealData>({
    schema: quickDealSchema,
    config: {
      mode: "create",
      defaultValues: {
        name: "",
        value: 0,
        contactId: contactId || "",
        stage: "qualification",
        expectedCloseDate: addDays(new Date(), 30).toISOString(),
      },
      onSubmit: handleSubmit,
      onCancel,
      resetOnSuccess: true,
    },
  });
}

/* ============================================================
 * Quick Lead Form
 * ============================================================ */

export interface UseQuickLeadFormOptions {
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

export function useQuickLeadForm({
  onSuccess,
  onCancel,
}: UseQuickLeadFormOptions = {}) {
  const createLead = useCreateLead();

  const handleSubmit = useCallback(
    async (data: QuickLeadData) => {
      const apiData = transformToApiFormat(data);
      const newLead = await createLead.mutateAsync(
        apiData as Parameters<typeof createLead.mutateAsync>[0]
      );
      onSuccess?.(newLead);
    },
    [createLead, onSuccess]
  );

  return useFormBase<QuickLeadData>({
    schema: quickLeadSchema,
    config: {
      mode: "create",
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        source: "",
      },
      onSubmit: handleSubmit,
      onCancel,
      resetOnSuccess: true,
    },
  });
}

/* ============================================================
 * Quick Task Form
 * ============================================================ */

export interface UseQuickTaskFormOptions {
  contactId?: string;
  dealId?: string;
  onSuccess?: (task: Activity) => void;
  onCancel?: () => void;
}

// Mock API for task creation
async function mockCreateTask(data: unknown): Promise<Activity> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: "task",
    ...(data as Omit<Activity, "id" | "type">),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Activity;
}

export function useQuickTaskForm({
  contactId,
  dealId,
  onSuccess,
  onCancel,
}: UseQuickTaskFormOptions = {}) {
  const handleSubmit = useCallback(
    async (data: QuickTaskData) => {
      const apiData = transformToApiFormat(data);
      const newTask = await mockCreateTask(apiData);
      onSuccess?.(newTask);
    },
    [onSuccess]
  );

  return useFormBase<QuickTaskData>({
    schema: quickTaskSchema,
    config: {
      mode: "create",
      defaultValues: {
        title: "",
        dueDate: addDays(new Date(), 1).toISOString(),
        priority: "medium",
        contactId: contactId || "",
        dealId: dealId || "",
      },
      onSubmit: handleSubmit,
      onCancel,
      resetOnSuccess: true,
    },
  });
}

/* ============================================================
 * Universal Quick Form Hook
 * ============================================================ */

export interface UseQuickFormOptions {
  entity: QuickCreateEntity;
  contactId?: string;
  dealId?: string;
  onSuccess?: (result: Contact | Deal | Lead | Activity) => void;
  onCancel?: () => void;
}

export function useQuickForm({
  entity,
  contactId,
  dealId,
  onSuccess,
  onCancel,
}: UseQuickFormOptions) {
  const contactForm = useQuickContactForm({
    onSuccess: onSuccess as (contact: Contact) => void,
    onCancel,
  });

  const dealForm = useQuickDealForm({
    contactId,
    onSuccess: onSuccess as (deal: Deal) => void,
    onCancel,
  });

  const leadForm = useQuickLeadForm({
    onSuccess: onSuccess as (lead: Lead) => void,
    onCancel,
  });

  const taskForm = useQuickTaskForm({
    contactId,
    dealId,
    onSuccess: onSuccess as (task: Activity) => void,
    onCancel,
  });

  // Return appropriate form based on entity type
  switch (entity) {
    case "contact":
      return contactForm;
    case "deal":
      return dealForm;
    case "lead":
      return leadForm;
    case "task":
      return taskForm;
    default:
      return contactForm;
  }
}

/* ============================================================
 * Quick Form Metadata
 * ============================================================ */

export const quickFormMetadata = {
  contact: {
    title: "Quick Create Contact",
    description: "Create a new contact quickly",
    icon: "user",
    fields: ["firstName", "lastName", "email", "phone", "company"],
  },
  deal: {
    title: "Quick Create Deal",
    description: "Create a new deal quickly",
    icon: "briefcase",
    fields: ["name", "value", "stage", "expectedCloseDate"],
  },
  lead: {
    title: "Quick Create Lead",
    description: "Create a new lead quickly",
    icon: "target",
    fields: ["firstName", "lastName", "email", "phone", "company", "source"],
  },
  task: {
    title: "Quick Create Task",
    description: "Create a new task quickly",
    icon: "check-square",
    fields: ["title", "dueDate", "priority"],
  },
} as const;

/* ============================================================
 * Utilities
 * ============================================================ */

/** Get form title based on entity */
export function getQuickFormTitle(entity: QuickCreateEntity): string {
  return quickFormMetadata[entity].title;
}

/** Get form description based on entity */
export function getQuickFormDescription(entity: QuickCreateEntity): string {
  return quickFormMetadata[entity].description;
}

/** Get form fields based on entity */
export function getQuickFormFields(entity: QuickCreateEntity): string[] {
  return quickFormMetadata[entity].fields;
}
