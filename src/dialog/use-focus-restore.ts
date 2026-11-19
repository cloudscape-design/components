// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useRef } from 'react';

import { getFirstFocusable } from '../internal/components/focus-lock/utils';

/**
 * Moves focus into Dialog when it mounts and restores it on unmount unless the
 * consumer has already moved focus outside Dialog.
 */
export function useFocusRestore() {
  const containerRef = useRef<HTMLElement | null>(null);
  const restoreFocusTargetRef = useRef<HTMLElement | SVGElement | null>(null);

  return useCallback((container: HTMLElement | null) => {
    if (container) {
      containerRef.current = container;
      restoreFocusTargetRef.current = null;

      // ownerDocument keeps this working when rendered inside an iframe.
      const activeElement = container.ownerDocument.activeElement;
      if (activeElement && !container.contains(activeElement)) {
        restoreFocusTargetRef.current = activeElement as HTMLElement | SVGElement;
      }
      getFirstFocusable(container)?.focus();
      return;
    }

    const mountedContainer = containerRef.current;
    const activeElement = mountedContainer?.ownerDocument.activeElement;
    if (mountedContainer && activeElement && mountedContainer.contains(activeElement)) {
      restoreFocusTargetRef.current?.focus();
    }

    containerRef.current = null;
    restoreFocusTargetRef.current = null;
  }, []);
}
