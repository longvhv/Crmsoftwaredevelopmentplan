/* ============================================================
 * useFocusManagement Hook
 * Keyboard navigation & focus trap for modals/panels
 * Step 110 - Phase 1.9 Final Polish
 * ============================================================ */

import { useCallback, useEffect, useRef } from "react";

/* ============================================================
 * Focus Trap Hook
 * ============================================================ */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

export function useFocusTrap(active = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus first focusable element
    const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Restore focus on unmount
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [active]);

  return containerRef;
}

/* ============================================================
 * Roving Tab Index Hook (for toolbars, menus, grids)
 * ============================================================ */

export function useRovingTabIndex(itemCount: number, orientation: "horizontal" | "vertical" | "both" = "vertical") {
  const activeIndex = useRef(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const setItemRef = useCallback((index: number) => (el: HTMLElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const prevKeys = orientation === "horizontal" ? ["ArrowLeft"] : orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"];
      const nextKeys = orientation === "horizontal" ? ["ArrowRight"] : orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"];

      let newIndex = activeIndex.current;

      if (prevKeys.includes(e.key)) {
        e.preventDefault();
        newIndex = activeIndex.current > 0 ? activeIndex.current - 1 : itemCount - 1;
      } else if (nextKeys.includes(e.key)) {
        e.preventDefault();
        newIndex = activeIndex.current < itemCount - 1 ? activeIndex.current + 1 : 0;
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = itemCount - 1;
      }

      if (newIndex !== activeIndex.current) {
        activeIndex.current = newIndex;
        itemRefs.current[newIndex]?.focus();
      }
    },
    [itemCount, orientation]
  );

  return { setItemRef, handleKeyDown, activeIndex };
}

/* ============================================================
 * Skip to Content Link Hook
 * ============================================================ */

export function useSkipToContent(targetId = "main-content") {
  const skipToContent = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetId]);

  return skipToContent;
}
