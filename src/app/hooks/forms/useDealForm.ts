/* ============================================================
 * Deal Form Hook
 * Form management for deal creation/editing
 * ============================================================ */

import { useCallback, useMemo } from "react";
import { useFormBase } from "./useFormBase";
import { dealFormSchema, type DealFormData } from "@/schemas/validation";
import { useCreateDeal, useUpdateDeal } from "@/hooks/queries";
import type { Deal, DealStage } from "@/types/crm";
import type { FormMode } from "@/types/forms";
import { transformToApiFormat } from "@/utils/formUtils";
import { addDays } from "date-fns";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseDealFormOptions {
  mode: FormMode;
  deal?: Deal;
  contactId?: string;
  onSuccess?: (deal: Deal) => void;
  onCancel?: () => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export type UseDealFormReturn = ReturnType<typeof useDealForm>;

/* ============================================================
 * Deal Form Hook
 * ============================================================ */

export function useDealForm({
  mode,
  deal,
  contactId,
  onSuccess,
  onCancel,
}: UseDealFormOptions) {
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  /* ============================================================
   * Default Values
   * ============================================================ */

  const defaultValues = useMemo<Partial<DealFormData>>(() => {
    if (mode === "edit" && deal) {
      return {
        name: deal.name,
        value: deal.value,
        stage: deal.stage,
        contactId: deal.contactId || "",
        priority: deal.priority,
        probability: deal.probability,
        expectedCloseDate: deal.expectedCloseDate || "",
        actualCloseDate: deal.actualCloseDate || "",
        ownerId: deal.ownerId || "",
        source: deal.source || "",
        discount: deal.discount || 0,
        tax: deal.tax || 0,
        productIds: deal.productIds || [],
        status: deal.status,
        lostReason: deal.lostReason || "",
        tags: deal.tags || [],
        description: deal.description || "",
        notes: deal.notes || "",
      };
    }

    // Default for new deals
    return {
      name: "",
      value: 0,
      stage: "qualification",
      contactId: contactId || "",
      priority: "medium",
      probability: 20, // Default probability for qualification stage
      expectedCloseDate: addDays(new Date(), 30).toISOString(),
      discount: 0,
      tax: 0,
      productIds: [],
      status: "open",
      tags: [],
    };
  }, [mode, deal, contactId]);

  /* ============================================================
   * Submit Handler
   * ============================================================ */

  const handleSubmit = useCallback(
    async (data: DealFormData) => {
      const apiData = transformToApiFormat(data);

      if (mode === "create") {
        const newDeal = await createDeal.mutateAsync(
          apiData as Parameters<typeof createDeal.mutateAsync>[0]
        );
        onSuccess?.(newDeal);
      } else if (mode === "edit" && deal) {
        const updatedDeal = await updateDeal.mutateAsync({
          id: deal.id,
          data: apiData as Parameters<typeof updateDeal.mutateAsync>[0]["data"],
        });
        onSuccess?.(updatedDeal);
      }
    },
    [mode, deal, createDeal, updateDeal, onSuccess]
  );

  /* ============================================================
   * Form Instance
   * ============================================================ */

  const formBase = useFormBase<DealFormData>({
    schema: dealFormSchema,
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
   * Stage Probability Mapping
   * ============================================================ */

  const stageProbabilities: Record<DealStage, number> = {
    qualification: 20,
    needs_analysis: 40,
    proposal: 60,
    negotiation: 80,
    closed_won: 100,
    closed_lost: 0,
  };

  /* ============================================================
   * Helper Methods
   * ============================================================ */

  /** Update probability based on stage */
  const updateProbabilityFromStage = useCallback(
    (stage: DealStage) => {
      const probability = stageProbabilities[stage];
      formBase.setFieldValue("probability", probability);
    },
    [formBase, stageProbabilities]
  );

  /** Calculate final value (value - discount + tax) */
  const calculateFinalValue = useCallback(() => {
    const { value, discount, tax } = formBase.form.getValues();
    return (value || 0) - (discount || 0) + (tax || 0);
  }, [formBase.form]);

  /** Get weighted value for forecasting */
  const getWeightedValue = useCallback(() => {
    const { value, probability } = formBase.form.getValues();
    return ((value || 0) * (probability || 0)) / 100;
  }, [formBase.form]);

  /** Validate expected close date */
  const validateCloseDate = useCallback(() => {
    const { expectedCloseDate, status } = formBase.form.getValues();

    if (status === "open" && expectedCloseDate) {
      const closeDate = new Date(expectedCloseDate);
      const now = new Date();

      if (closeDate <= now) {
        return "Expected close date must be in the future";
      }
    }

    return true;
  }, [formBase.form]);

  /** Auto-set actual close date when marking won/lost */
  const setCloseDate = useCallback(() => {
    const status = formBase.getFieldValue("status");

    if (status === "won" || status === "lost") {
      const actualCloseDate = formBase.getFieldValue("actualCloseDate");
      if (!actualCloseDate) {
        formBase.setFieldValue("actualCloseDate", new Date().toISOString());
      }
    }
  }, [formBase]);

  /** Calculate deal age in days */
  const getDealAge = useCallback(() => {
    if (!deal) return 0;
    const createdAt = new Date(deal.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [deal]);

  /** Get days until close */
  const getDaysUntilClose = useCallback(() => {
    const expectedCloseDate = formBase.getFieldValue("expectedCloseDate");
    if (!expectedCloseDate) return null;

    const closeDate = new Date(expectedCloseDate);
    const now = new Date();
    const diffTime = closeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [formBase]);

  /** Check if deal is overdue */
  const isOverdue = useCallback(() => {
    const daysUntilClose = getDaysUntilClose();
    const status = formBase.getFieldValue("status");
    return status === "open" && daysUntilClose !== null && daysUntilClose < 0;
  }, [formBase, getDaysUntilClose]);

  /** Update stage */
  const updateStage = useCallback(
    (newStage: DealStage) => {
      formBase.setFieldValue("stage", newStage);
      updateProbabilityFromStage(newStage);

      // Auto-update status based on stage
      if (newStage === "closed_won") {
        formBase.setFieldValue("status", "won");
        setCloseDate();
      } else if (newStage === "closed_lost") {
        formBase.setFieldValue("status", "lost");
        setCloseDate();
      }
    },
    [formBase, updateProbabilityFromStage, setCloseDate]
  );

  /** Calculate discount percentage */
  const getDiscountPercentage = useCallback(() => {
    const { value, discount } = formBase.form.getValues();
    if (!value || !discount) return 0;
    return ((discount / value) * 100).toFixed(2);
  }, [formBase.form]);

  /** Calculate tax percentage */
  const getTaxPercentage = useCallback(() => {
    const { value, tax } = formBase.form.getValues();
    if (!value || !tax) return 0;
    return ((tax / value) * 100).toFixed(2);
  }, [formBase.form]);

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    ...formBase,
    mode,
    deal,
    isLoading:
      createDeal.isPending || updateDeal.isPending || formBase.isSubmitting,
    helpers: {
      updateProbabilityFromStage,
      calculateFinalValue,
      getWeightedValue,
      validateCloseDate,
      setCloseDate,
      getDealAge,
      getDaysUntilClose,
      isOverdue,
      updateStage,
      getDiscountPercentage,
      getTaxPercentage,
    },
  };
}
