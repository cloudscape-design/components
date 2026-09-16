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

  return useCallback(
    (container: HTMLElement | null) => {
      if (container) {
        if (autoFocus) {
          // ownerDocument keeps this working when rendered inside an iframe.
          const activeElement = container.ownerDocument.activeElement;
          if (activeElement && !container.contains(activeElement)) {
            restoreFocusTargetRef.current = activeElement as HTMLElement;
          }
          getFirstFocusable(container)?.focus();
        }
      } else if (restoreFocus) {
        restoreFocusTargetRef.current?.focus();
        restoreFocusTargetRef.current = null;
      }
    },
    [autoFocus, restoreFocus]
  );
}
