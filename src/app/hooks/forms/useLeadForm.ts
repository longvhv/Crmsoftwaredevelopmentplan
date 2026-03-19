/* ============================================================
 * Lead Form Hook
 * Form management for lead creation/editing
 * ============================================================ */

import { useCallback, useMemo } from "react";
import { useFormBase } from "./useFormBase";
import { leadFormSchema, type LeadFormData } from "@/schemas/validation";
import { useCreateLead, useUpdateLead } from "@/hooks/queries";
import type { Lead } from "@/types/crm";
import type { FormMode } from "@/types/forms";
import { transformToApiFormat } from "@/utils/formUtils";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseLeadFormOptions {
  mode: FormMode;
  lead?: Lead;
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export type UseLeadFormReturn = ReturnType<typeof useLeadForm>;

/* ============================================================
 * Lead Form Hook
 * ============================================================ */

export function useLeadForm({
  mode,
  lead,
  onSuccess,
  onCancel,
}: UseLeadFormOptions) {
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  /* ============================================================
   * Default Values
   * ============================================================ */

  const defaultValues = useMemo<Partial<LeadFormData>>(() => {
    if (mode === "edit" && lead) {
      return {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        status: lead.status,
        phone: lead.phone || "",
        mobile: lead.mobile || "",
        website: lead.website || "",
        company: lead.company || "",
        jobTitle: lead.jobTitle || "",
        source: lead.source || "",
        campaign: lead.campaign || "",
        referrer: lead.referrer || "",
        leadScore: lead.leadScore,
        qualified: lead.qualified,
        interestedProducts: lead.interestedProducts || [],
        budget: lead.budget,
        timeline: lead.timeline || "",
        city: lead.city || "",
        state: lead.state || "",
        country: lead.country || "",
        ownerId: lead.ownerId || "",
        converted: lead.converted,
        convertedDate: lead.convertedDate || "",
        contactId: lead.contactId || "",
        dealId: lead.dealId || "",
        disqualifiedReason: lead.disqualifiedReason || "",
        tags: lead.tags || [],
        notes: lead.notes || "",
      };
    }

    return {
      firstName: "",
      lastName: "",
      email: "",
      status: "new",
      leadScore: 0,
      qualified: false,
      interestedProducts: [],
      converted: false,
      tags: [],
    };
  }, [mode, lead]);

  /* ============================================================
   * Submit Handler
   * ============================================================ */

  const handleSubmit = useCallback(
    async (data: LeadFormData) => {
      const apiData = transformToApiFormat(data);

      if (mode === "create") {
        const newLead = await createLead.mutateAsync(
          apiData as Parameters<typeof createLead.mutateAsync>[0]
        );
        onSuccess?.(newLead);
      } else if (mode === "edit" && lead) {
        const updatedLead = await updateLead.mutateAsync({
          id: lead.id,
          data: apiData as Parameters<typeof updateLead.mutateAsync>[0]["data"],
        });
        onSuccess?.(updatedLead);
      }
    },
    [mode, lead, createLead, updateLead, onSuccess]
  );

  /* ============================================================
   * Form Instance
   * ============================================================ */

  const formBase = useFormBase<LeadFormData>({
    schema: leadFormSchema,
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
   * Lead Scoring Weights
   * ============================================================ */

  const scoringWeights = {
    email: 10,
    phone: 10,
    mobile: 5,
    company: 15,
    jobTitle: 10,
    budget: 20,
    interestedProducts: 15,
    timeline: 10,
    website: 5,
  };

  /* ============================================================
   * Helper Methods
   * ============================================================ */

  /** Calculate lead score automatically */
  const calculateLeadScore = useCallback(() => {
    const values = formBase.form.getValues();
    let score = 0;

    // Email
    if (values.email) score += scoringWeights.email;

    // Phone
    if (values.phone) score += scoringWeights.phone;
    if (values.mobile) score += scoringWeights.mobile;

    // Company
    if (values.company) score += scoringWeights.company;

    // Job title
    if (values.jobTitle) score += scoringWeights.jobTitle;

    // Budget
    if (values.budget && values.budget > 0) {
      score += scoringWeights.budget;
    }

    // Interested products
    if (
      values.interestedProducts &&
      values.interestedProducts.length > 0
    ) {
      score += scoringWeights.interestedProducts;
    }

    // Timeline
    if (values.timeline) score += scoringWeights.timeline;

    // Website
    if (values.website) score += scoringWeights.website;

    // Cap at 100
    const finalScore = Math.min(score, 100);
    formBase.setFieldValue("leadScore", finalScore);

    return finalScore;
  }, [formBase, scoringWeights]);

  /** Check if lead is qualified */
  const checkQualification = useCallback(() => {
    const score = calculateLeadScore();
    const isQualified = score >= 70; // Qualification threshold

    formBase.setFieldValue("qualified", isQualified);

    return isQualified;
  }, [formBase, calculateLeadScore]);

  /** Update status to qualified */
  const markAsQualified = useCallback(() => {
    formBase.setFieldValue("status", "qualified");
    formBase.setFieldValue("qualified", true);
  }, [formBase]);

  /** Update status to disqualified */
  const markAsDisqualified = useCallback((reason: string) => {
    formBase.setFieldValue("status", "disqualified");
    formBase.setFieldValue("qualified", false);
    formBase.setFieldValue("disqualifiedReason", reason);
  }, [formBase]);

  /** Get full name */
  const getFullName = useCallback(() => {
    const { firstName, lastName } = formBase.form.getValues();
    return [firstName, lastName].filter(Boolean).join(" ");
  }, [formBase.form]);

  /** Get lead age in days */
  const getLeadAge = useCallback(() => {
    if (!lead) return 0;
    const createdAt = new Date(lead.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [lead]);

  /** Check if lead is stale (>30 days old, not contacted) */
  const isStale = useCallback(() => {
    if (!lead) return false;
    const age = getLeadAge();
    const status = formBase.getFieldValue("status");
    return age > 30 && status === "new";
  }, [lead, formBase, getLeadAge]);

  /** Check if lead is hot (high score, qualified) */
  const isHotLead = useCallback(() => {
    const leadScore = formBase.getFieldValue("leadScore");
    const qualified = formBase.getFieldValue("qualified");
    return leadScore >= 80 && qualified;
  }, [formBase]);

  /** Validate conversion requirements */
  const validateConversion = useCallback(() => {
    const values = formBase.form.getValues();

    const errors: string[] = [];

    if (!values.qualified) {
      errors.push("Lead must be qualified before conversion");
    }

    if (values.leadScore < 70) {
      errors.push("Lead score must be at least 70");
    }

    if (values.status === "new" || values.status === "contacted") {
      errors.push("Lead must be qualified");
    }

    if (values.converted) {
      errors.push("Lead is already converted");
    }

    return {
      canConvert: errors.length === 0,
      errors,
    };
  }, [formBase]);

  /** Prepare for conversion */
  const prepareConversion = useCallback(() => {
    const validation = validateConversion();

    if (!validation.canConvert) {
      return {
        ready: false,
        errors: validation.errors,
      };
    }

    const values = formBase.form.getValues();

    return {
      ready: true,
      contactData: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        mobile: values.mobile,
        company: values.company,
        jobTitle: values.jobTitle,
        website: values.website,
        city: values.city,
        state: values.state,
        country: values.country,
        source: values.source,
        leadScore: values.leadScore,
        tags: values.tags,
      },
      dealData: values.budget
        ? {
            name: `Deal from ${getFullName()}`,
            value: values.budget,
            stage: "qualification" as const,
            source: values.source,
            priority: values.leadScore >= 80 ? ("high" as const) : ("medium" as const),
          }
        : undefined,
    };
  }, [formBase, validateConversion, getFullName]);

  /** Mark as converted */
  const markAsConverted = useCallback(
    (contactId: string, dealId?: string) => {
      formBase.setFieldValue("converted", true);
      formBase.setFieldValue("convertedDate", new Date().toISOString());
      formBase.setFieldValue("contactId", contactId);
      if (dealId) {
        formBase.setFieldValue("dealId", dealId);
      }
      formBase.setFieldValue("status", "converted");
    },
    [formBase]
  );

  /** Get lead quality rating */
  const getQualityRating = useCallback(() => {
    const score = formBase.getFieldValue("leadScore");

    if (score >= 80) return { label: "Excellent", color: "green" };
    if (score >= 60) return { label: "Good", color: "blue" };
    if (score >= 40) return { label: "Fair", color: "yellow" };
    return { label: "Poor", color: "red" };
  }, [formBase]);

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    ...formBase,
    mode,
    lead,
    isLoading:
      createLead.isPending || updateLead.isPending || formBase.isSubmitting,
    helpers: {
      calculateLeadScore,
      checkQualification,
      markAsQualified,
      markAsDisqualified,
      getFullName,
      getLeadAge,
      isStale,
      isHotLead,
      validateConversion,
      prepareConversion,
      markAsConverted,
      getQualityRating,
    },
  };
}
