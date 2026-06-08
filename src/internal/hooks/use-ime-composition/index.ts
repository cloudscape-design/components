// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';

export interface UseIMECompositionOptions {
  /**
   * Called synchronously when composition starts.
   */
  onCompositionStart?: () => void;
  /**
   * Called synchronously when composition ends (i.e. the user commits a composed character).
   * At the point this fires, isComposing() still returns true — which blocks the spurious
   * Enter keydown that some browsers fire immediately after compositionend. The flag is
   * cleared after the next animation frame.
   */
  onCompositionEnd?: () => void;
}

/**
 * Custom hook to handle IME composition state for preventing IME race conditions when pressing enter to end composition.
 *
 * IME generates duplicate Enter events:
 * 1. First Enter: Ends composition (isComposing=true -> false)
 * 2. Second Enter: Triggers normal action (isComposing=false)
 *
 * This hook tracks composition lifecycle to prevent the second Enter during the brief window.
 *
 * The optional `onCompositionEnd` callback fires synchronously when composition commits,
 * allowing callers to process the final composed text (e.g. trigger detection in token mode).
 */
export function useIMEComposition(
  elementRef: React.RefObject<HTMLElement>,
  { onCompositionStart, onCompositionEnd }: UseIMECompositionOptions = {}
) {
  const wasComposingRef = useRef(false);
  const onCompositionStartRef = useRef(onCompositionStart);
  onCompositionStartRef.current = onCompositionStart;
  const onCompositionEndRef = useRef(onCompositionEnd);
  onCompositionEndRef.current = onCompositionEnd;

  const handleCompositionStart = () => {
    wasComposingRef.current = true;
    onCompositionStartRef.current?.();
  };

  const handleCompositionEnd = () => {
    // Fire the callback while wasComposing is still true — this blocks the spurious
    // Enter keydown that fires synchronously after compositionend in some browsers.
    onCompositionEndRef.current?.();
    // Keep flag true briefly to catch immediate post-composition Enter events.
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
