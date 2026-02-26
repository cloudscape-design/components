// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { ELEMENT_TYPES, SPECIAL_CHARS } from '../core/constants';
import { getCursorPosition, getTokenCursorLength, setCursorPosition } from '../core/cursor-manager';
import { type EditableState } from '../core/event-handlers';
import { extractTokensFromDOM, getPromptText, moveForbiddenTextAfterPinnedTokens } from '../core/token-extractor';
import { renderTokensToDOM } from '../core/token-renderer';
import {
  isBreakToken,
  isBRElement,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from '../core/type-guards';
import { createParagraph, ensureEmptyState, findAllParagraphs, findElements, insertAfter } from '../core/utils';
import { PromptInputProps } from '../interfaces';

function shouldRerender(
  oldTokens: readonly PromptInputProps.InputToken[] | undefined,
  newTokens: readonly PromptInputProps.InputToken[] | undefined
): boolean {
  if (!oldTokens || !newTokens) {
    return true;
  }

  if (oldTokens.length !== newTokens.length) {
    return true;
  }

  for (let i = 0; i < oldTokens.length; i++) {
    const oldToken = oldTokens[i];
    const newToken = newTokens[i];

    if (oldToken.type !== newToken.type) {
      return true;
    }

    if (isReferenceToken(oldToken) && isReferenceToken(newToken)) {
      if (oldToken.id !== newToken.id) {
        return true;
      }
    }
  }

  return false;
}

interface UseEditableOptions {
  elementRef: React.RefObject<HTMLDivElement>;
  reactContainersRef: React.MutableRefObject<Set<HTMLElement>>;
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  adjustInputHeight: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  editableState: EditableState;
  ignoreCursorDetection: React.MutableRefObject<boolean>;
  lastKnownCursorPositionRef: React.MutableRefObject<number>;
}

interface UseEditableReturn {
  handleInput: () => void;
  editableState: EditableState;
}

export function useEditableTokens({
  elementRef,
  reactContainersRef,
  tokens,
  menus,
  tokensToText,
  onChange,
  adjustInputHeight,
  disabled = false,
  readOnly = false,
  editableState,
  ignoreCursorDetection,
  lastKnownCursorPositionRef,
}: UseEditableOptions): UseEditableReturn {
  const lastRenderedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastEmittedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastDisabledRef = useRef(disabled);
  const lastReadOnlyRef = useRef(readOnly);
  const skipNextZwnjUpdateRef = useRef(false);
  const skipCursorRestoreRef = useRef(false);

  const handleInput = useCallback(() => {
    if (!elementRef.current) {
      return;
    }

    // Capture cursor position BEFORE any DOM manipulation
    const cursorPos = getCursorPosition(elementRef.current);
    lastKnownCursorPositionRef.current = cursorPos;

    // Read flags from shared state
    if (editableState.skipNextZwnjUpdate) {
      skipNextZwnjUpdateRef.current = true;
      editableState.skipNextZwnjUpdate = false;
    }

    if (editableState.skipCursorRestore) {
      skipCursorRestoreRef.current = true;
      editableState.skipCursorRestore = false;
    }

    if (elementRef.current.children.length === 0) {
      ensureEmptyState(elementRef.current);
    }

    const paragraphs = findAllParagraphs(elementRef.current);

    paragraphs.forEach(p => {
      const cursorSpots = findElements(p, {
        tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER],
      });
      cursorSpots.forEach(spot => {
        const content = spot.textContent || '';
        const cleanContent = content.replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');

        if (cleanContent) {
          const textNode = document.createTextNode(cleanContent);
          const wrapper = spot.parentElement;
          if (wrapper) {
            if (spot.getAttribute('data-type') === ELEMENT_TYPES.CURSOR_SPOT_BEFORE) {
              wrapper.parentNode?.insertBefore(textNode, wrapper);
            } else {
              insertAfter(textNode, wrapper);
            }
          }
        }
        spot.textContent = SPECIAL_CHARS.ZWNJ;
      });
    });

    const directTextNodes = Array.from(elementRef.current.childNodes).filter(
      node => isTextNode(node) && node.textContent?.trim()
    );

    if (directTextNodes.length > 0) {
      // Find or create a paragraph to move the text into
      let targetP = findAllParagraphs(elementRef.current)[0];
      if (!targetP) {
        targetP = createParagraph();
        elementRef.current.appendChild(targetP);
      }

      // Move text nodes into the paragraph
      directTextNodes.forEach(textNode => {
        targetP!.appendChild(textNode);
      });
    }

    // Extract tokens
    let extractedTokens = extractTokensFromDOM(elementRef.current, menus);

    // If all content was deleted or only breaks remain, ensure proper empty state
    const onlyBreaks = extractedTokens.every(isBreakToken);

    if (extractedTokens.length === 0 || onlyBreaks) {
      // Ensure we have exactly one paragraph with BR
      const paragraphs = findAllParagraphs(elementRef.current);
      const hasValidEmptyState =
        paragraphs.length === 1 && isBRElement(paragraphs[0].firstChild, ELEMENT_TYPES.TRAILING_BREAK);
      if (!hasValidEmptyState) {
        ensureEmptyState(elementRef.current);
        // Cursor will be restored by unified restoration to position 0
        lastKnownCursorPositionRef.current = 0;
      }
      extractedTokens = [];
    }

    const movedTokens = moveForbiddenTextAfterPinnedTokens(extractedTokens);
    const tokensWereMoved = movedTokens.some((t, i) => t !== extractedTokens[i]);

    if (tokensWereMoved) {
      extractedTokens = movedTokens;

      // When tokens are moved, position cursor after all content
      const position = movedTokens.reduce((sum, token) => sum + getTokenCursorLength(token), 0);
      lastKnownCursorPositionRef.current = position;

      // Render immediately to avoid showing intermediate state
      renderTokensToDOM(movedTokens, elementRef.current, reactContainersRef.current, { disabled, readOnly });

      // Position cursor immediately to avoid flicker
      requestAnimationFrame(() => {
        if (elementRef.current) {
          setCursorPosition(elementRef.current, position);
        }
      });
    }

    const value = tokensToText ? tokensToText(extractedTokens) : getPromptText(extractedTokens);
    onChange({ value, tokens: extractedTokens });

    lastEmittedTokensRef.current = extractedTokens;

    adjustInputHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, adjustInputHeight, tokensToText]);

  useLayoutEffect(() => {
    if (!elementRef.current || disabled) {
      return;
    }
    if (elementRef.current.children.length === 0) {
      renderTokensToDOM(tokens ?? [], elementRef.current, reactContainersRef.current, { disabled, readOnly });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    // Check if disabled/readOnly changed - force rerender if so
    const stateChanged = lastDisabledRef.current !== disabled || lastReadOnlyRef.current !== readOnly;
    lastDisabledRef.current = disabled;
    lastReadOnlyRef.current = readOnly;

    // Check if a trigger split+merge happened (same token count, but text token value changed)
    // This is a structural change that needs cursor repositioning
    const triggerSplitAndMerged =
      lastRenderedTokensRef.current &&
      tokens &&
      lastRenderedTokensRef.current.length === tokens.length &&
      tokens.some((token, i) => {
        const oldToken = lastRenderedTokensRef.current![i];
        const prevToken = i > 0 ? tokens[i - 1] : null;
        // Detect: text token after trigger, value changed by exactly 1 space at start
        return (
          isTextToken(token) &&
          isTextToken(oldToken) &&
          prevToken &&
          isTriggerToken(prevToken) &&
          token.value.length === oldToken.value.length + 1 &&
          token.value.startsWith(' ') &&
          token.value.substring(1) === oldToken.value
        );
      });

    const needsRerender =
      stateChanged || shouldRerender(lastRenderedTokensRef.current, tokens) || triggerSplitAndMerged;

    if (!needsRerender) {
      lastRenderedTokensRef.current = tokens;
      return;
    }

    if (lastRenderedTokensRef.current && tokens && lastRenderedTokensRef.current.length === 0 && tokens.length === 0) {
      lastRenderedTokensRef.current = tokens;
      return;
    }

    if (skipNextZwnjUpdateRef.current) {
      skipNextZwnjUpdateRef.current = false;
    }

    if (editableState.skipCursorRestore) {
      skipCursorRestoreRef.current = true;
      editableState.skipCursorRestore = false;
    }

    const shouldRestoreCursor = !skipCursorRestoreRef.current;

    skipCursorRestoreRef.current = false;

    let savedCursorPosition = 0;
    if (shouldRestoreCursor) {
      // Check if we have a deletion context with a pre-calculated position
      if (editableState.deletionContext) {
        savedCursorPosition = editableState.deletionContext.cursorPosition;
        editableState.deletionContext = null;
      } else {
        savedCursorPosition = lastKnownCursorPositionRef.current;
      }
    }

    lastRenderedTokensRef.current = tokens;

    // Calculate cursor position for space-after-trigger case
    let cursorPositionToRestore: number | null = null;
    if (triggerSplitAndMerged && tokens) {
      // Special case: space was added after trigger, position after the space
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];

        if (isTriggerToken(token) && nextToken && isTextToken(nextToken) && nextToken.value.startsWith('  ')) {
          cursorPositionToRestore = tokens.slice(0, i + 1).reduce((sum, t) => sum + getTokenCursorLength(t), 0) + 1;
          break;
        }
      }
    }

    renderTokensToDOM(tokens ?? [], elementRef.current, reactContainersRef.current, { disabled, readOnly });

    // ============================================================================
    // UNIFIED CURSOR RESTORATION
    // ============================================================================
    // After renderTokensToDOM, always restore cursor position using lastKnownCursorPositionRef
    // Special cases update the ref before restoration, not position directly

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!elementRef.current) {
          return;
        }

        // Calculate target position based on special cases
        let targetPosition = savedCursorPosition;

        // Special case 1: Menu selection - position after the selected reference
        if (editableState.menuSelectionTokenId) {
          const tokenId = editableState.menuSelectionTokenId;
          const isPinned = editableState.menuSelectionIsPinned;
          editableState.menuSelectionTokenId = null;
          editableState.menuSelectionIsPinned = false;

          let targetWrapper: Element | null = null;

          if (isPinned) {
            const pinnedElements = findElements(elementRef.current, { tokenType: ELEMENT_TYPES.PINNED });
            const lastPinned = pinnedElements[pinnedElements.length - 1];
            if (lastPinned) {
              targetWrapper = lastPinned.closest(`[data-type="${ELEMENT_TYPES.PINNED}"]`);
            }
          } else {
            const wrappers = findElements(elementRef.current, {
              tokenType: ELEMENT_TYPES.REFERENCE,
              tokenId,
            });
            targetWrapper = wrappers[wrappers.length - 1];
          }

          if (targetWrapper && tokens) {
            const refIndex = tokens.findIndex(t => isReferenceToken(t) && t.id === tokenId);
            if (refIndex >= 0) {
              // Calculate position after this reference
              targetPosition = tokens
                .slice(0, refIndex + 1)
                .reduce((sum, token) => sum + getTokenCursorLength(token), 0);
            }
          }

          ignoreCursorDetection.current = false;
        }

        // Special case 2: Space after trigger - position after the space
        if (cursorPositionToRestore !== null) {
          targetPosition = cursorPositionToRestore;
        }

        // Unified restoration: set cursor to target position
        setCursorPosition(elementRef.current, targetPosition);
      })
    );

    adjustInputHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, readOnly, tokens, adjustInputHeight]);

  return {
    handleInput,
    editableState,
  };
}

export type SetCursorPositionCallback = (position: number | null) => void;
