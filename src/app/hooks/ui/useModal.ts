/* ============================================================
 * Modal Hook
 * Generic modal state management
 * ============================================================ */

import { useCallback, useState } from "react";
import type { ModalType, ModalState, ModalActions } from "@/types/ui-state";

/* ============================================================
 * Hook Options
 * ============================================================ */

export interface UseModalOptions<T = unknown> {
  onOpen?: (type: ModalType, data?: T) => void;
  onClose?: () => void;
}

/* ============================================================
 * Hook Return Type
 * ============================================================ */

export type UseModalReturn<T = unknown> = ModalState<T> & ModalActions<T>;

/* ============================================================
 * Modal Hook
 * ============================================================ */

export function useModal<T = unknown>({
  onOpen: onOpenCallback,
  onClose: onCloseCallback,
}: UseModalOptions<T> = {}): UseModalReturn<T> {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    type: "custom",
    data: undefined,
    mode: "create",
  });

  /* ============================================================
   * Actions
   * ============================================================ */

  const open = useCallback(
    (type: ModalType, data?: T) => {
      setState({
        isOpen: true,
        type,
        data,
        mode: data ? "edit" : "create",
      });
      onOpenCallback?.(type, data);
    },
    [onOpenCallback]
  );

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
    onCloseCallback?.();

    // Clear data after animation
    setTimeout(() => {
      setState({
        isOpen: false,
        type: "custom",
        data: undefined,
        mode: "create",
      });
    }, 200);
  }, [onCloseCallback]);

  const setData = useCallback((data: T) => {
    setState((prev) => ({
      ...prev,
      data,
      mode: "edit",
    }));
  }, []);

  /* ============================================================
   * Return Value
   * ============================================================ */

  return {
    ...state,
    open,
    close,
    setData,
  };
}

/* ============================================================
 * Specialized Modal Hooks
 * ============================================================ */

/** Create modal hook */
export function useCreateModal<T = unknown>(
  onSuccess?: (data: T) => void
) {
  return useModal<T>({
    onOpen: () => {
      // Can add analytics tracking here
    },
    onClose: () => {
      // Cleanup if needed
    },
  });
}

/** Edit modal hook */
export function useEditModal<T = unknown>(
  onSuccess?: (data: T) => void
) {
  return useModal<T>();
}

/** Delete confirmation modal hook */
export function useDeleteModal<T = unknown>(
  onConfirm?: (data: T) => void
) {
  return useModal<T>();
}

/** View details modal hook */
export function useViewModal<T = unknown>() {
  return useModal<T>();
}
