// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useRef } from 'react';

import { getFirstFocusable } from './utils';

export interface UseFocusRestoreOptions {
  /**
   * Move focus to the first focusable element inside the container when it mounts.
   * Defaults to `false`.
   */
  autoFocus?: boolean;
  /**
   * Return focus to the element that was focused before the container mounted when it unmounts.
   * Defaults to `false`.
   */
  restoreFocus?: boolean;
}

/**
 * Moves focus into a container when it mounts and restores it on unmount, like
 * `FocusLock` but without the tab traps. Use it for surfaces that take focus on
 * open but must not contain the tab sequence, such as a non-modal dialog where
 * Tab flows out.
 */
export function useFocusRestore({ autoFocus = false, restoreFocus = false }: UseFocusRestoreOptions = {}) {
  const restoreFocusTargetRef = useRef<HTMLElement | SVGElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  return useCallback(
    (container: HTMLElement | null) => {
      if (container) {
        containerRef.current = container;
        const activeElement = container.ownerDocument.activeElement;
        if (restoreFocus && activeElement && !container.contains(activeElement)) {
          restoreFocusTargetRef.current = activeElement as HTMLElement | SVGElement;
        }
        if (autoFocus) {
          getFirstFocusable(container)?.focus();
        }
      } else {
        const previousContainer = containerRef.current;
        const activeElement = previousContainer?.ownerDocument.activeElement;
        if (restoreFocus && activeElement && previousContainer?.contains(activeElement)) {
          restoreFocusTargetRef.current?.focus();
        }
        restoreFocusTargetRef.current = null;
        containerRef.current = null;
      }
    },
    [autoFocus, restoreFocus]
  );
}
