// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';

interface UseTokenListFocusOptions {
  tokenListRef: React.RefObject<HTMLUListElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  tokenListLength: number;
  effectiveVisible: number;
}

interface UseTokenListFocusResult {
  focusTokenAtIndex: (absoluteIndex: number) => void;
}

/**
 * Provides imperative focus management for the inline token list.
 *
 * `focusTokenAtIndex` translates an absolute token index (0-based within the full
 * token array) to a position-in-visible index, then focuses the corresponding dismiss
 * button. If the token is not visible (index falls before the visible window), focus
 * is sent to the input instead.
 *
 * The snapshot ref is updated on every render so that keyboard handlers, which close
 * over a stale `effectiveVisible`, always see the latest value.
 */
export function useTokenListFocus({
  tokenListRef,
  inputRef,
  tokenListLength,
  effectiveVisible,
}: UseTokenListFocusOptions): UseTokenListFocusResult {
  const snapshotRef = useRef({ tokenListLength, effectiveVisible });
  // Mutate every render so keyboard-handler callbacks capture the live values.
  snapshotRef.current = { tokenListLength, effectiveVisible };

  const focusTokenAtIndex = (absoluteIndex: number) => {
    const { tokenListLength: len, effectiveVisible: ev } = snapshotRef.current;
    const visibleStart = len - ev;
    const positionInVisible = absoluteIndex - visibleStart;
    if (positionInVisible < 0) {
      inputRef.current?.focus();
      return;
    }
    const dismissButtons = tokenListRef.current?.querySelectorAll<HTMLButtonElement>('[data-token-item] button');
    if (dismissButtons && dismissButtons[positionInVisible]) {
      dismissButtons[positionInVisible].focus();
    }
  };

  return { focusTokenAtIndex };
}
