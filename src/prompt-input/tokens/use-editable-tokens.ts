// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { PromptInputProps } from '../interfaces';
import { createCursorManager } from '../utils/cursor-utils';
import { domToTokenArray, getPromptText, renderTokensToDOM } from './token-utils';

interface UseEditableOptions {
  elementRef: React.RefObject<HTMLDivElement>;
  reactContainersRef: React.MutableRefObject<Set<HTMLElement>>;
  tokens?: readonly PromptInputProps.InputToken[];
  mode?: PromptInputProps.ModeToken;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  onModeRemoved?: () => void;
  adjustInputHeight: () => void;
  disabled?: boolean;
  // Optional cursor position to set when tokens change
  cursorPosition?: number | null;
}

// Helper to compare token arrays for equality
function tokensEqual(
  a: readonly PromptInputProps.InputToken[] | undefined,
  b: readonly PromptInputProps.InputToken[] | undefined
): boolean {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    const tokenA = a[i];
    const tokenB = b[i];

    if (tokenA.type !== tokenB.type || tokenA.value !== tokenB.value) {
      return false;
    }

    if (tokenA.type === 'reference' && tokenB.type === 'reference') {
      if (tokenA.id !== tokenB.id || tokenA.label !== tokenB.label) {
        return false;
      }
    }
  }

  return true;
}

interface UseEditableReturn {
  // Input event handler
  handleInput: () => void;
}

/**
 * Custom hook for managing contentEditable elements with token support.
 * Follows the use-editable package pattern - focuses on DOM synchronization
 * and cursor management while leaving state management to the parent component.
 */
export function useEditableTokens({
  elementRef,
  reactContainersRef,
  tokens,
  mode,
  tokensToText,
  onChange,
  onModeRemoved,
  adjustInputHeight,
  disabled = false,
  cursorPosition = null,
}: UseEditableOptions): UseEditableReturn {
  const lastRenderedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastCursorPositionRef = useRef<number | null>(null);

  // Create cursor manager instance
  const cursorManager = useMemo(
    () => (elementRef.current ? createCursorManager(elementRef.current) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elementRef.current]
  );

  // Cursor position utilities using the cursor manager
  const getCursorPosition = useCallback((): number => {
    if (!cursorManager) {
      return 0;
    }
    return cursorManager.getPosition();
  }, [cursorManager]);

  const setCursorPosition = useCallback(
    (position: number) => {
      if (disabled || !cursorManager) {
        return;
      }
      cursorManager.setPosition(position);
    },
    [disabled, cursorManager]
  );

  // Handle input events directly - simpler than MutationObserver
  const handleInput = useCallback(() => {
    if (!elementRef.current) {
      return;
    }

    // Extract tokens from DOM
    const extractedTokens = domToTokenArray(elementRef.current);

    // Check if mode element still exists in DOM
    const modeElement = elementRef.current.querySelector('[data-token-type="mode"]');
    const currentMode = modeElement ? true : false;

    // Check if mode was removed
    if (mode && !currentMode && onModeRemoved) {
      onModeRemoved();
    }

    // Notify parent component of changes
    const value = tokensToText ? tokensToText(extractedTokens) : getPromptText(extractedTokens);
    onChange({
      value,
      tokens: extractedTokens,
    });

    // Update last rendered tokens
    lastRenderedTokensRef.current = extractedTokens;

    adjustInputHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, onModeRemoved, onChange, adjustInputHeight, tokensToText]);

  // Sync React props to DOM (like a controlled component)
  // This is the ONLY place that updates the DOM - tokens prop is the source of truth
  const lastRenderedModeRef = useRef<PromptInputProps.ModeToken | undefined>(undefined);

  useEffect(() => {
    if (disabled || !elementRef.current) {
      return;
    }

    // Only update DOM if tokens actually changed (avoid re-rendering on every state update)
    // Use deep comparison to avoid rebuilding DOM when tokens content is the same
    const tokensChanged = !tokensEqual(lastRenderedTokensRef.current, tokens);

    // Check if mode changed
    const modeChanged = lastRenderedModeRef.current !== mode;

    // Only consider cursor changed if it's explicitly set (not null)
    // null means "preserve current cursor" which shouldn't trigger DOM rebuild
    const explicitCursorChange = cursorPosition !== null && lastCursorPositionRef.current !== cursorPosition;

    // Skip DOM rebuild if nothing changed
    if (!tokensChanged && !modeChanged && !explicitCursorChange) {
      // Still update refs even when skipping rebuild
      lastRenderedTokensRef.current = tokens;
      lastRenderedModeRef.current = mode;
      lastCursorPositionRef.current = cursorPosition;
      return;
    }

    // Update refs before rebuilding
    lastRenderedTokensRef.current = tokens;
    lastRenderedModeRef.current = mode;
    lastCursorPositionRef.current = cursorPosition;

    // Save current cursor position BEFORE any DOM changes (for normal typing)
    const savedCursorPosition = getCursorPosition();

    // Render tokens to DOM - this clears and rebuilds the entire DOM
    const hasContent = mode || (tokens && tokens.length > 0);
    if (hasContent) {
      renderTokensToDOM(tokens ?? [], mode, elementRef.current, reactContainersRef.current);
    } else {
      // Clear DOM if no tokens
      elementRef.current.innerHTML = '';
    }

    // Restore cursor position after DOM update
    requestAnimationFrame(() => {
      if (!elementRef.current || !hasContent) {
        return;
      }

      // Use explicit cursor position if provided (from menu selection, etc.)
      // Otherwise restore the saved position (from normal typing)
      const positionToSet = cursorPosition !== null ? cursorPosition : savedCursorPosition;

      // Focus BEFORE setting cursor position
      elementRef.current.focus();

      // Try to set cursor position
      try {
        setCursorPosition(positionToSet);
      } catch {
        // If cursor positioning fails (e.g., position beyond text nodes),
        // fall back to positioning at the end
        const range = document.createRange();
        range.selectNodeContents(elementRef.current);
        range.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });

    adjustInputHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, tokens, mode, cursorPosition, adjustInputHeight]);

  return {
    handleInput,
  };
}

// Export the interface for the cursor position callback
export type SetCursorPositionCallback = (position: number | null) => void;
