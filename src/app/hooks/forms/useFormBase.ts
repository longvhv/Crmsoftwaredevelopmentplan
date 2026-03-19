/* ============================================================
 * Base Form Hook
 * Generic form hook with react-hook-form + zod
 * ============================================================ */

import { useCallback, useState } from "react";
import { useForm, type UseFormProps, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import type { BaseFormConfig, FormSubmitState } from "@/types/forms";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseFormBaseOptions<T extends FieldValues>
  extends Omit<UseFormProps<T>, "resolver"> {
  schema: z.ZodSchema<T>;
  config?: BaseFormConfig<T>;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseFormBaseReturn<T extends FieldValues> {
  form: ReturnType<typeof useForm<T>>;
  submitState: FormSubmitState;
  isSubmitting: boolean;
  canSubmit: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  handleCancel: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  getFieldValue: <K extends keyof T>(field: K) => T[K];
  hasError: (field: keyof T) => boolean;
  getError: (field: keyof T) => string | undefined;
}

/* ============================================================
 * Base Form Hook
 * ============================================================ */

export function useFormBase<T extends FieldValues>({
  schema,
  config,
  ...formProps
}: UseFormBaseOptions<T>): UseFormBaseReturn<T> {
  const [submitState, setSubmitState] = useState<FormSubmitState>("idle");

  // Initialize react-hook-form with zod resolver
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: config?.validateOnChange ? "onChange" : "onBlur",
    defaultValues: config?.defaultValues as T,
    ...formProps,
  });

  const {
    handleSubmit: rhfHandleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = form;

  /* ============================================================
   * Submit Handler
   * ============================================================ */

  const handleSubmit = useCallback(() => {
    rhfHandleSubmit(async (data) => {
      try {
        setSubmitState("submitting");

        // Call onSubmit from config
        await config?.onSubmit(data);

        setSubmitState("success");

        // Call onSuccess callback
        config?.onSuccess?.(data);

        // Reset form if configured
        if (config?.resetOnSuccess) {
          reset();
        }

        // Show success toast
        toast.success(
          config?.mode === "create"
            ? "Created successfully"
            : "Updated successfully"
        );
      } catch (error) {
        setSubmitState("error");

        // Call onError callback
        const err = error instanceof Error ? error : new Error("Unknown error");
        config?.onError?.(err);

        // Show error toast
        toast.error(err.message || "Something went wrong");
      } finally {
        setTimeout(() => setSubmitState("idle"), 1000);
      }
    })();
  }, [rhfHandleSubmit, config, reset]);

  /* ============================================================
   * Reset Handler
   * ============================================================ */

  const handleReset = useCallback(() => {
    reset(config?.defaultValues as T);
    setSubmitState("idle");
  }, [reset, config?.defaultValues]);

  /* ============================================================
   * Cancel Handler
   * ============================================================ */

  const handleCancel = useCallback(() => {
    if (config?.onCancel) {
      config.onCancel();
    } else {
      handleReset();
    }
  }, [config, handleReset]);

  /* ============================================================
   * Field Utilities
   * ============================================================ */

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValue(field as string, value, {
        shouldValidate: config?.validateOnChange,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue, config?.validateOnChange]
  );

  const getFieldValue = useCallback(
    <K extends keyof T>(field: K): T[K] => {
      return getValues(field as string);
    },
    [getValues]
  );

  const hasError = useCallback(
    (field: keyof T): boolean => {
      return !!errors[field as string];
    },
    [errors]
  );

  const getError = useCallback(
    (field: keyof T): string | undefined => {
      return errors[field as string]?.message as string | undefined;
    },
    [errors]
  );

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const canSubmit =
    !isSubmitting && isDirty && isValid && submitState !== "submitting";

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    form,
    submitState,
    isSubmitting: isSubmitting || submitState === "submitting",
    canSubmit,
    handleSubmit,
    handleReset,
    handleCancel,
    setFieldValue,
    getFieldValue,
    hasError,
    getError,
  };
}

/* ============================================================
 * Typed Hook Factories
 * ============================================================ */

/** Create typed form hook */
export function createFormHook<T extends FieldValues>(schema: z.ZodSchema<T>) {
  return (config?: BaseFormConfig<T>) =>
    useFormBase<T>({
      schema,
      config,
    });
}
