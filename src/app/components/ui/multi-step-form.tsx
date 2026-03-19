import * as React from "react";
import { cn } from "./utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

/* ============================================================
 * MULTI-STEP FORM TYPES
 * ============================================================ */

export interface FormStep {
  /**
   * Step unique ID
   */
  id: string;
  
  /**
   * Step title
   */
  title: string;
  
  /**
   * Step description
   */
  description?: string;
  
  /**
   * Step icon (optional)
   */
  icon?: React.ReactNode;
  
  /**
   * Step content component
   */
  content: React.ReactNode;
  
  /**
   * Optional validation function
   * Returns true if step is valid, false otherwise
   */
  validate?: () => boolean | Promise<boolean>;
  
  /**
   * Whether step can be skipped
   * @default false
   */
  optional?: boolean;
}

export interface MultiStepFormProps {
  /**
   * Array of form steps
   */
  steps: FormStep[];
  
  /**
   * Initial step index
   * @default 0
   */
  initialStep?: number;
  
  /**
   * Callback when step changes
   */
  onStepChange?: (stepIndex: number, stepId: string) => void;
  
  /**
   * Callback when form is submitted (on last step)
   */
  onComplete?: () => void | Promise<void>;
  
  /**
   * Callback when form is cancelled
   */
  onCancel?: () => void;
  
  /**
   * Show cancel button
   * @default true
   */
  showCancel?: boolean;
  
  /**
   * Show step navigation (progress bar)
   * @default true
   */
  showProgress?: boolean;
  
  /**
   * Allow non-linear navigation
   * @default false
   */
  allowNonLinear?: boolean;
  
  /**
   * Submit button text
   * @default 'Complete'
   */
  submitText?: string;
  
  /**
   * Next button text
   * @default 'Next'
   */
  nextText?: string;
  
  /**
   * Previous button text
   * @default 'Previous'
   */
  previousText?: string;
  
  /**
   * Cancel button text
   * @default 'Cancel'
   */
  cancelText?: string;
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Vertical layout for step indicator
   * @default false
   */
  verticalLayout?: boolean;
}

/* ============================================================
 * STEP INDICATOR COMPONENT
 * ============================================================ */

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (index: number) => void;
  allowNonLinear: boolean;
  vertical?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  allowNonLinear,
  vertical = false,
}) => {
  const containerClasses = cn(
    'flex gap-2',
    vertical ? 'flex-col' : 'flex-row items-center'
  );
  
  return (
    <div className={containerClasses}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        const isCurrent = index === currentStep;
        const isClickable = allowNonLinear && (isCompleted || index <= currentStep);
        
        return (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-200',
                vertical ? 'w-full' : 'flex-col',
                isClickable && 'cursor-pointer hover:bg-[var(--muted)]',
                !isClickable && 'cursor-not-allowed opacity-60'
              )}
            >
              {/* Icon/Number */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-full transition-all duration-200',
                  vertical ? 'w-10 h-10' : 'w-8 h-8',
                  isCompleted && 'bg-[var(--success)] text-white',
                  isCurrent && !isCompleted && 'bg-primary text-white ring-4 ring-primary/20',
                  !isCurrent && !isCompleted && 'bg-[var(--muted)] text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className={cn(vertical ? 'w-5 h-5' : 'w-4 h-4')} />
                ) : step.icon ? (
                  <span className={cn(vertical ? 'w-5 h-5' : 'w-4 h-4')}>{step.icon}</span>
                ) : (
                  <span className={cn(vertical ? 'text-sm' : 'text-xs', 'font-semibold')}>
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step Info */}
              <div className={cn('flex flex-col', vertical ? 'items-start text-left' : 'items-center text-center')}>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent && 'text-foreground',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                  {step.optional && (
                    <span className="text-xs text-muted-foreground ml-1">(optional)</span>
                  )}
                </span>
                {vertical && step.description && (
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </button>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'transition-colors duration-200',
                  vertical ? 'w-0.5 h-8 ml-5' : 'flex-1 h-0.5',
                  isCompleted ? 'bg-[var(--success)]' : 'bg-[var(--muted)]'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ============================================================
 * PROGRESS BAR COMPONENT
 * ============================================================ */

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  
  return (
    <div className="w-full">
      {/* Progress Info */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Step {current + 1} of {total}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(percentage)}% Complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* ============================================================
 * MULTI-STEP FORM COMPONENT
 * ============================================================ */

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  initialStep = 0,
  onStepChange,
  onComplete,
  onCancel,
  showCancel = true,
  showProgress = true,
  allowNonLinear = false,
  submitText = 'Complete',
  nextText = 'Next',
  previousText = 'Previous',
  cancelText = 'Cancel',
  loading = false,
  className,
  verticalLayout = false,
}) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());
  const [isValidating, setIsValidating] = React.useState(false);
  
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  // Navigate to step
  const goToStep = React.useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        onStepChange?.(stepIndex, steps[stepIndex].id);
      }
    },
    [steps, onStepChange]
  );
  
  // Go to next step
  const goToNextStep = React.useCallback(async () => {
    // Validate current step
    if (currentStepData.validate) {
      setIsValidating(true);
      try {
        const isValid = await currentStepData.validate();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch (error) {
        console.error('Step validation error:', error);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }
    
    // Mark current step as completed
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    
    // Go to next step or complete
    if (isLastStep) {
      await onComplete?.();
    } else {
      goToStep(currentStep + 1);
    }
  }, [currentStep, currentStepData, isLastStep, onComplete, goToStep]);
  
  // Go to previous step
  const goToPreviousStep = React.useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, isFirstStep, goToStep]);
  
  // Handle step click (for non-linear navigation)
  const handleStepClick = React.useCallback(
    (stepIndex: number) => {
      if (allowNonLinear) {
        goToStep(stepIndex);
      }
    },
    [allowNonLinear, goToStep]
  );
  
  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastStep) {
        goToNextStep();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        goToPreviousStep();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isFirstStep, isLastStep, goToNextStep, goToPreviousStep]);
  
  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      {showProgress && !verticalLayout && (
        <div className="mb-8">
          <ProgressBar current={currentStep} total={steps.length} />
        </div>
      )}
      
      {/* Main Layout */}
      <div className={cn('flex gap-8', verticalLayout ? 'flex-row' : 'flex-col')}>
        {/* Step Indicator */}
        {verticalLayout && (
          <div className="w-64 flex-shrink-0">
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
              allowNonLinear={allowNonLinear}
              vertical={true}
            />
          </div>
        )}
        
        {!verticalLayout && (
          <div className="mb-8">
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
              allowNonLinear={allowNonLinear}
              vertical={false}
            />
          </div>
        )}
        
        {/* Step Content */}
        <div className="flex-1">
          {/* Step Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {currentStepData.title}
            </h2>
            {currentStepData.description && (
              <p className="text-muted-foreground">
                {currentStepData.description}
              </p>
            )}
          </div>
          
          {/* Step Content */}
          <div className="mb-8">
            {currentStepData.content}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Cancel Button */}
              {showCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={loading || isValidating}
                >
                  {cancelText}
                </Button>
              )}
              
              {/* Previous Button */}
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={loading || isValidating}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  {previousText}
                </Button>
              )}
            </div>
            
            {/* Next/Submit Button */}
            <Button
              type="button"
              variant="primary"
              onClick={goToNextStep}
              loading={loading || isValidating}
              disabled={loading || isValidating}
              rightIcon={!isLastStep ? <ChevronRight className="w-4 h-4" /> : undefined}
            >
              {isLastStep ? submitText : nextText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MultiStepForm };
export type { FormStep };
