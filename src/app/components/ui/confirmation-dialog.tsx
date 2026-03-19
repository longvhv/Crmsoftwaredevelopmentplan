import * as React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Modal, ModalBody, ModalFooter, useModal } from "./modal";
import { Button } from "./button";
import { cn } from "./utils";

/* ============================================================
 * TYPES
 * ============================================================ */

export type ConfirmationType = "default" | "danger" | "warning" | "info" | "success";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: ConfirmationType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  showIcon?: boolean;
  destructive?: boolean;
}

export interface UseConfirmationOptions {
  title: string;
  description?: string;
  type?: ConfirmationType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseConfirmationReturn {
  open: boolean;
  confirm: () => void;
  cancel: () => void;
  ConfirmationDialog: React.FC;
}

/* ============================================================
 * CONFIRMATION DIALOG COMPONENT
 * ============================================================ */

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  type = "default",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  icon: customIcon,
  showIcon = true,
  destructive = false,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  // Type-based styling
  const typeConfig: Record<ConfirmationType, {
    variant: "default" | "danger" | "success" | "warning" | "info";
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
  }> = {
    default: {
      variant: "default",
      icon: <Info className="size-6" />,
      iconBg: "bg-[var(--brand-primary)]/10",
      iconColor: "text-[var(--brand-primary)]",
    },
    danger: {
      variant: "danger",
      icon: <XCircle className="size-6" />,
      iconBg: "bg-[var(--error)]/10",
      iconColor: "text-[var(--error)]",
    },
    warning: {
      variant: "warning",
      icon: <AlertTriangle className="size-6" />,
      iconBg: "bg-[var(--warning)]/10",
      iconColor: "text-[var(--warning)]",
    },
    info: {
      variant: "info",
      icon: <Info className="size-6" />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    success: {
      variant: "success",
      icon: <CheckCircle className="size-6" />,
      iconBg: "bg-[var(--success)]/10",
      iconColor: "text-[var(--success)]",
    },
  };

  const config = typeConfig[type];
  const displayIcon = customIcon || config.icon;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      variant={config.variant}
      showCloseButton={!isLoading && !loading}
      closeOnOverlayClick={!isLoading && !loading}
      closeOnEscape={!isLoading && !loading}
    >
      <ModalBody>
        <div className="flex gap-4">
          {showIcon && (
            <div className={cn("shrink-0 p-3 rounded-full", config.iconBg, config.iconColor)}>
              {displayIcon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading || loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={destructive || type === "danger" ? "destructive" : "primary"}
            onClick={handleConfirm}
            loading={isLoading || loading}
            disabled={isLoading || loading}
          >
            {confirmText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

ConfirmationDialog.displayName = "ConfirmationDialog";

/* ============================================================
 * HOOK: USE CONFIRMATION
 * ============================================================ */

export const useConfirmation = ({
  title,
  description,
  type = "default",
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: UseConfirmationOptions): UseConfirmationReturn => {
  const { open, openModal, closeModal } = useModal();

  const confirm = React.useCallback(() => {
    openModal();
  }, [openModal]);

  const cancel = React.useCallback(() => {
    onCancel?.();
    closeModal();
  }, [onCancel, closeModal]);

  const ConfirmationDialogComponent = React.useCallback(
    () => (
      <ConfirmationDialog
        open={open}
        onOpenChange={closeModal}
        title={title}
        description={description}
        type={type}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    ),
    [open, closeModal, title, description, type, confirmText, cancelText, onConfirm, onCancel]
  );

  return {
    open,
    confirm,
    cancel,
    ConfirmationDialog: ConfirmationDialogComponent,
  };
};

/* ============================================================
 * ALERT DIALOG COMPONENT
 * ============================================================ */

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  type?: ConfirmationType;
  buttonText?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  buttonText = "OK",
  onClose,
  icon: customIcon,
  showIcon = true,
}) => {
  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  // Type-based styling
  const typeConfig: Record<ConfirmationType, {
    variant: "default" | "danger" | "success" | "warning" | "info";
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
  }> = {
    default: {
      variant: "default",
      icon: <Info className="size-6" />,
      iconBg: "bg-[var(--brand-primary)]/10",
      iconColor: "text-[var(--brand-primary)]",
    },
    danger: {
      variant: "danger",
      icon: <XCircle className="size-6" />,
      iconBg: "bg-[var(--error)]/10",
      iconColor: "text-[var(--error)]",
    },
    warning: {
      variant: "warning",
      icon: <AlertTriangle className="size-6" />,
      iconBg: "bg-[var(--warning)]/10",
      iconColor: "text-[var(--warning)]",
    },
    info: {
      variant: "info",
      icon: <Info className="size-6" />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    success: {
      variant: "success",
      icon: <CheckCircle className="size-6" />,
      iconBg: "bg-[var(--success)]/10",
      iconColor: "text-[var(--success)]",
    },
  };

  const config = typeConfig[type];
  const displayIcon = customIcon || config.icon;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      variant={config.variant}
    >
      <ModalBody>
        <div className="flex gap-4">
          {showIcon && (
            <div className={cn("shrink-0 p-3 rounded-full", config.iconBg, config.iconColor)}>
              {displayIcon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleClose}>
            {buttonText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

AlertDialog.displayName = "AlertDialog";

/* ============================================================
 * HOOK: USE ALERT
 * ============================================================ */

export interface UseAlertOptions {
  title: string;
  description?: string;
  type?: ConfirmationType;
  buttonText?: string;
  onClose?: () => void;
}

export interface UseAlertReturn {
  open: boolean;
  showAlert: () => void;
  hideAlert: () => void;
  AlertDialog: React.FC;
}

export const useAlert = ({
  title,
  description,
  type = "info",
  buttonText,
  onClose,
}: UseAlertOptions): UseAlertReturn => {
  const { open, openModal, closeModal } = useModal();

  const showAlert = React.useCallback(() => {
    openModal();
  }, [openModal]);

  const hideAlert = React.useCallback(() => {
    closeModal();
  }, [closeModal]);

  const AlertDialogComponent = React.useCallback(
    () => (
      <AlertDialog
        open={open}
        onOpenChange={closeModal}
        title={title}
        description={description}
        type={type}
        buttonText={buttonText}
        onClose={onClose}
      />
    ),
    [open, closeModal, title, description, type, buttonText, onClose]
  );

  return {
    open,
    showAlert,
    hideAlert,
    AlertDialog: AlertDialogComponent,
  };
};
