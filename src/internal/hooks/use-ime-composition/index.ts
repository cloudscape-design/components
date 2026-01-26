// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle IME composition state for preventing IME race conditions when pressing enter to end composition.
 *
 * IME generates duplicate Enter events:
 * 1. First Enter: Ends composition (isComposing=true -> false)
 * 2. Second Enter: Triggers normal action (isComposing=false)
 *
 * This hook tracks composition lifecycle to prevent the second Enter during the brief window.
 */
export function useIMEComposition(elementRef: React.RefObject<HTMLInputElement>) {
  const wasComposingRef = useRef(false);

  const handleCompositionStart = () => {
    wasComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    // Keep flag true briefly to catch immediate post-composition Enter events
    requestAnimationFrame(() => {
      wasComposingRef.current = false;
    });
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    element.addEventListener('compositionstart', handleCompositionStart);
    element.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      element.removeEventListener('compositionstart', handleCompositionStart);
      element.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, [elementRef]);

  const isComposing = () => wasComposingRef.current;

  return { isComposing };
}
