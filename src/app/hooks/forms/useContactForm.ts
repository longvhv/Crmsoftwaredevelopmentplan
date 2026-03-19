/* ============================================================
 * Contact Form Hook
 * Form management for contact creation/editing
 * ============================================================ */

import { useCallback, useMemo } from "react";
import { useFormBase } from "./useFormBase";
import { contactFormSchema, type ContactFormData } from "@/schemas/validation";
import { useCreateContact, useUpdateContact } from "@/hooks/queries";
import type { Contact } from "@/types/crm";
import type { FormMode } from "@/types/forms";
import { transformToApiFormat } from "@/utils/formUtils";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseContactFormOptions {
  mode: FormMode;
  contact?: Contact;
  onSuccess?: (contact: Contact) => void;
  onCancel?: () => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export type UseContactFormReturn = ReturnType<typeof useContactForm>;

/* ============================================================
 * Contact Form Hook
 * ============================================================ */

export function useContactForm({
  mode,
  contact,
  onSuccess,
  onCancel,
}: UseContactFormOptions) {
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  /* ============================================================
   * Default Values
   * ============================================================ */

  const defaultValues = useMemo<Partial<ContactFormData>>(() => {
    if (mode === "edit" && contact) {
      return {
        firstName: contact.firstName,
        lastName: contact.lastName,
        middleName: contact.middleName || "",
        email: contact.email,
        phone: contact.phone || "",
        mobile: contact.mobile || "",
        website: contact.website || "",
        company: contact.company || "",
        jobTitle: contact.jobTitle || "",
        department: contact.department || "",
        address: contact.address || "",
        city: contact.city || "",
        state: contact.state || "",
        postalCode: contact.postalCode || "",
        country: contact.country || "",
        contactType: contact.contactType,
        status: contact.status,
        leadScore: contact.leadScore,
        source: contact.source || "",
        ownerId: contact.ownerId || "",
        lifetimeValue: contact.lifetimeValue,
        tags: contact.tags || [],
        notes: contact.notes || "",
      };
    }

    return {
      firstName: "",
      lastName: "",
      email: "",
      contactType: "customer",
      status: "active",
      leadScore: 0,
      lifetimeValue: 0,
      tags: [],
    };
  }, [mode, contact]);

  /* ============================================================
   * Submit Handler
   * ============================================================ */

  const handleSubmit = useCallback(
    async (data: ContactFormData) => {
      const apiData = transformToApiFormat(data);

      if (mode === "create") {
        const newContact = await createContact.mutateAsync(
          apiData as Parameters<typeof createContact.mutateAsync>[0]
        );
        onSuccess?.(newContact);
      } else if (mode === "edit" && contact) {
        const updatedContact = await updateContact.mutateAsync({
          id: contact.id,
          data: apiData as Parameters<
            typeof updateContact.mutateAsync
          >[0]["data"],
        });
        onSuccess?.(updatedContact);
      }
    },
    [mode, contact, createContact, updateContact, onSuccess]
  );

  /* ============================================================
   * Form Instance
   * ============================================================ */

  const formBase = useFormBase<ContactFormData>({
    schema: contactFormSchema,
    config: {
      mode,
      defaultValues,
      onSubmit: handleSubmit,
      onCancel,
      resetOnSuccess: mode === "create",
      validateOnChange: false,
      validateOnBlur: true,
    },
  });

  /* ============================================================
   * Helper Methods
   * ============================================================ */

  /** Calculate full name */
  const getFullName = useCallback(() => {
    const { firstName, middleName, lastName } = formBase.form.getValues();
    return [firstName, middleName, lastName].filter(Boolean).join(" ");
  }, [formBase.form]);

  /** Auto-generate email from name */
  const generateEmail = useCallback(() => {
    const { firstName, lastName, company } = formBase.form.getValues();
    if (!firstName || !lastName) return;

    const domain = company
      ? company.toLowerCase().replace(/\s+/g, "") + ".com"
      : "example.com";

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    formBase.setFieldValue("email", email);
  }, [formBase]);

  /** Validate email uniqueness (mock) */
  const validateEmailUnique = useCallback(
    async (email: string): Promise<boolean> => {
      // In production, this would call an API
      // For now, just simulate async validation
      await new Promise((resolve) => setTimeout(resolve, 300));
      return true;
    },
    []
  );

  /** Update lead score based on fields */
  const recalculateLeadScore = useCallback(() => {
    const values = formBase.form.getValues();
    let score = 0;

    // Email: +20
    if (values.email) score += 20;

    // Phone: +15
    if (values.phone || values.mobile) score += 15;

    // Company: +20
    if (values.company) score += 20;

    // Job title: +15
    if (values.jobTitle) score += 15;

    // Complete address: +10
    if (values.address && values.city) score += 10;

    // Website: +10
    if (values.website) score += 10;

    // Department: +10
    if (values.department) score += 10;

    formBase.setFieldValue("leadScore", Math.min(score, 100));
  }, [formBase]);

  /** Set default country */
  const setDefaultCountry = useCallback(() => {
    const country = formBase.getFieldValue("country");
    if (!country) {
      formBase.setFieldValue("country", "Việt Nam");
    }
  }, [formBase]);

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    ...formBase,
    mode,
    contact,
    isLoading:
      createContact.isPending ||
      updateContact.isPending ||
      formBase.isSubmitting,
    helpers: {
      getFullName,
      generateEmail,
      validateEmailUnique,
      recalculateLeadScore,
      setDefaultCountry,
    },
  };
}
