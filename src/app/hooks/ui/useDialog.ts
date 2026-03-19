/* ============================================================
 * Dialog Hook
 * Programmatic dialogs (alert, confirm, prompt)
 * ============================================================ */

import { useCallback, useState } from "react";
import type { DialogType, DialogState, DialogButton } from "@/types/ui-state";

/* ============================================================
 * Dialog Options
 * ============================================================ */

export interface DialogOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

export interface AlertOptions extends Omit<DialogOptions, "confirmLabel" | "cancelLabel"> {
  okLabel?: string;
}

export interface ConfirmOptions extends DialogOptions {}

export interface PromptOptions extends DialogOptions {
  defaultValue?: string;
  placeholder?: string;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export interface UseDialogReturn {
  dialog: DialogState;
  
  // Dialog methods
  alert: (options: AlertOptions) => Promise<void>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
  custom: (state: Partial<DialogState>) => void;
  close: () => void;
}

/* ============================================================
 * Dialog Hook
 * ============================================================ */

export function useDialog(): UseDialogReturn {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    buttons: [],
  });

  /* ============================================================
   * Close Dialog
   * ============================================================ */

  const close = useCallback(() => {
    setDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));

    // Clear after animation
    setTimeout(() => {
      setDialog({
        isOpen: false,
        type: "alert",
        title: "",
        message: "",
        buttons: [],
      });
    }, 200);
  }, []);

  /* ============================================================
   * Alert Dialog
   * ============================================================ */

  const alert = useCallback(
    ({ title, message, okLabel = "OK" }: AlertOptions): Promise<void> => {
      return new Promise((resolve) => {
        setDialog({
          isOpen: true,
          type: "alert",
          title,
          message,
          buttons: [
            {
              label: okLabel,
              variant: "default",
              onClick: () => {
                close();
                resolve();
              },
            },
          ],
        });
      });
    },
    [close]
  );

  /* ============================================================
   * Confirm Dialog
   * ============================================================ */

  const confirm = useCallback(
    ({
      title,
      message,
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      variant = "default",
    }: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setDialog({
          isOpen: true,
          type: "confirm",
          title,
          message,
          buttons: [
            {
              label: cancelLabel,
              variant: "outline",
              onClick: () => {
                close();
                resolve(false);
              },
            },
            {
              label: confirmLabel,
              variant,
              onClick: () => {
                close();
                resolve(true);
              },
            },
          ],
        });
      });
    },
    [close]
  );

  /* ============================================================
   * Prompt Dialog
   * ============================================================ */

  const prompt = useCallback(
    ({
      title,
      message,
      defaultValue = "",
      placeholder = "",
      confirmLabel = "Submit",
      cancelLabel = "Cancel",
    }: PromptOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        let inputValue = defaultValue;

        setDialog({
          isOpen: true,
          type: "prompt",
          title,
          message,
          buttons: [
            {
              label: cancelLabel,
              variant: "outline",
              onClick: () => {
                close();
                resolve(null);
              },
            },
            {
              label: confirmLabel,
              variant: "default",
              onClick: () => {
                close();
                resolve(inputValue);
              },
            },
          ],
        });
      });
    },
    [close]
  );

  /* ============================================================
   * Custom Dialog
   * ============================================================ */

  const custom = useCallback((state: Partial<DialogState>) => {
    setDialog((prev) => ({
      ...prev,
      isOpen: true,
      ...state,
    }));
  }, []);

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    dialog,
    alert,
    confirm,
    prompt,
    custom,
    close,
  };
}

/* ============================================================
 * Specialized Dialog Hooks
 * ============================================================ */

/** Delete confirmation dialog */
export function useDeleteConfirmation(onConfirm: () => Promise<void>) {
  const { confirm } = useDialog();

  return useCallback(
    async (itemName?: string) => {
      const confirmed = await confirm({
        title: "Confirm Deletion",
        message: itemName
          ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
          : "Are you sure you want to delete this item? This action cannot be undone.",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        await onConfirm();
      }
    },
    [confirm, onConfirm]
  );
}

/** Bulk delete confirmation */
export function useBulkDeleteConfirmation(onConfirm: () => Promise<void>) {
  const { confirm } = useDialog();

  return useCallback(
    async (count: number) => {
      const confirmed = await confirm({
        title: "Confirm Bulk Deletion",
        message: `Are you sure you want to delete ${count} item${
          count > 1 ? "s" : ""
        }? This action cannot be undone.`,
        confirmLabel: `Delete ${count} Item${count > 1 ? "s" : ""}`,
        cancelLabel: "Cancel",
        variant: "destructive",
      });

      if (confirmed) {
        await onConfirm();
      }
    },
    [confirm, onConfirm]
  );
}

/** Unsaved changes confirmation */
export function useUnsavedChangesConfirmation(onConfirm: () => void) {
  const { confirm } = useDialog();

  return useCallback(async () => {
    const confirmed = await confirm({
      title: "Unsaved Changes",
      message:
        "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
      confirmLabel: "Leave",
      cancelLabel: "Stay",
      variant: "destructive",
    });

    if (confirmed) {
      onConfirm();
    }
  }, [confirm, onConfirm]);
}
