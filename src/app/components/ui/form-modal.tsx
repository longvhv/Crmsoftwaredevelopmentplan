import * as React from "react";
import { Modal, ModalBody, ModalFooter } from "./modal";
import { Button } from "./button";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export interface FormModalProps<T = any> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  loading?: boolean;
  disabled?: boolean;
  formId?: string;
  className?: string;
}

export interface UseFormModalOptions<T = any> {
  defaultOpen?: boolean;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseFormModalReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  isSubmitting: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

/* ============================================================
 * HOOKS
 * ============================================================ */

export const useFormModal = <T = any,>({
  defaultOpen = false,
  onSubmit,
  onCancel,
}: UseFormModalOptions<T>): UseFormModalReturn => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const openModal = React.useCallback(() => setOpen(true), []);
  const closeModal = React.useCallback(() => {
    if (!isSubmitting) {
      onCancel?.();
      setOpen(false);
    }
  }, [isSubmitting, onCancel]);

  const handleSubmit = React.useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
        setOpen(false);
      } catch (error) {
        console.error("Form submission failed:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  return {
    open,
    setOpen,
    openModal,
    closeModal,
    isSubmitting,
    handleSubmit,
  };
};

/* ============================================================
 * FORM MODAL COMPONENT
 * ============================================================ */

export const FormModal = <T = any,>({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  size = "md",
  loading = false,
  disabled = false,
  formId = "form-modal",
  className,
}: FormModalProps<T>) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as T;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting && !loading) {
      onCancel?.();
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      showCloseButton={!isSubmitting && !loading}
      closeOnOverlayClick={!isSubmitting && !loading}
      closeOnEscape={!isSubmitting && !loading}
      className={className}
    >
      <form id={formId} onSubmit={handleSubmit}>
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || loading || disabled}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || loading}
              disabled={isSubmitting || loading || disabled}
            >
              {submitText}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

FormModal.displayName = "FormModal";

/* ============================================================
 * MULTI-STEP FORM MODAL
 * ============================================================ */

export interface Step {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  optional?: boolean;
}

export interface MultiStepFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  steps: Step[];
  onComplete: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showStepIndicator?: boolean;
  allowSkipOptional?: boolean;
}

export const MultiStepFormModal: React.FC<MultiStepFormModalProps> = ({
  open,
  onOpenChange,
  title,
  steps,
  onComplete,
  onCancel,
  size = "lg",
  showStepIndicator = true,
  allowSkipOptional = true,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canSkip = currentStepData.optional && allowSkipOptional;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (canSkip) {
      handleNext();
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      onOpenChange(false);
      setCurrentStep(0);
      setFormData({});
    } catch (error) {
      console.error("Form completion failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onCancel?.();
      onOpenChange(false);
      setCurrentStep(0);
      setFormData({});
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size={size}
      showCloseButton={!isSubmitting}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      {/* Step Indicator */}
      {showStepIndicator && (
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors",
                      index < currentStep
                        ? "bg-[var(--success)] text-white"
                        : index === currentStep
                        ? "bg-[var(--brand-primary)] text-white"
                        : "bg-accent text-muted-foreground"
                    )}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <div className="hidden sm:block">
                    <div className={cn("text-sm font-medium", index === currentStep && "text-[var(--brand-primary)]")}>
                      {step.title}
                    </div>
                    {step.optional && (
                      <div className="text-xs text-muted-foreground">Optional</div>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 transition-colors",
                      index < currentStep ? "bg-[var(--success)]" : "bg-accent"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <ModalBody>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            {currentStepData.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentStepData.description}
              </p>
            )}
          </div>
          {currentStepData.content}
        </div>
      </ModalBody>

      {/* Navigation */}
      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={isFirstStep ? handleCancel : handleBack}
              disabled={isSubmitting}
            >
              {isFirstStep ? "Cancel" : "Back"}
            </Button>
            
            {canSkip && !isLastStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            )}
            
            <Button
              type="button"
              variant="primary"
              onClick={isLastStep ? handleComplete : handleNext}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isLastStep ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

MultiStepFormModal.displayName = "MultiStepFormModal";

/* ============================================================
 * HOOK: USE MULTI-STEP FORM
 * ============================================================ */

export interface UseMultiStepFormOptions {
  steps: Step[];
  onComplete: (data: any) => void | Promise<void>;
}

export interface UseMultiStepFormReturn {
  currentStep: number;
  formData: Record<string, any>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Record<string, any>) => void;
  resetForm: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const useMultiStepForm = ({
  steps,
}: UseMultiStepFormOptions): UseMultiStepFormReturn => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
      }
    },
    [steps.length]
  );

  const nextStep = React.useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const updateFormData = React.useCallback((data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = React.useCallback(() => {
    setCurrentStep(0);
    setFormData({});
  }, []);

  return {
    currentStep,
    formData,
    goToStep,
    nextStep,
    prevStep,
    updateFormData,
    resetForm,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };
};
