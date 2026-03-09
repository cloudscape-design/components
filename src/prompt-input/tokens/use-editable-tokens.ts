// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { ELEMENT_TYPES } from '../core/constants';
import { getCursorPosition, getCursorPositionAtIndex, setCursorPosition } from '../core/cursor-manager';
import {
  applySafariCursorFix,
  calculateEndPosition,
  extractTextFromCursorSpots,
  positionCursorAfterMovedText,
} from '../core/cursor-utils';
import {
  createParagraph,
  ensureValidEmptyState,
  findAllParagraphs,
  findElements,
  isEmptyState,
} from '../core/dom-utils';
import { extractTokensFromDOM, getPromptText } from '../core/token-operations';
import { renderTokensToDOM } from '../core/token-renderer';
import { enforcePinnedTokenOrdering } from '../core/token-utils';
import { needsImmediateRenderForStyling } from '../core/trigger-utils';
import {
  isBreakToken,
  isBRElement,
  isPinnedReferenceToken,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

interface CursorPositionOverride {
  cursorPosition: number;
  paragraphId: string | null;
}

export interface EditableState {
  skipNextZwnjUpdate: boolean;
  skipNormalization: boolean;
  skipCursorRestore: boolean;
  targetParagraphId: string | null;
  cursorPositionOverride: CursorPositionOverride | null;
  menuSelectionTokenId: string | null;
  menuSelectionIsPinned: boolean;
  isDeleteOperation: boolean;
}

export function createEditableState(): EditableState {
  return {
    skipNextZwnjUpdate: false,
    skipNormalization: false,
    skipCursorRestore: false,
    targetParagraphId: null,
    cursorPositionOverride: null,
    menuSelectionTokenId: null,
    menuSelectionIsPinned: false,
    isDeleteOperation: false,
  };
}

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
  const lastInputTimeRef = useRef<number>(0);
  const isTypingIntoEmptyLineRef = useRef(false);

  const handleInput = useCallback(() => {
    lastInputTimeRef.current = Date.now();

    if (!elementRef.current) {
      return;
    }

    // Remove trailing BRs FIRST, before capturing cursor
    const allParagraphs = findAllParagraphs(elementRef.current);
    allParagraphs.forEach(p => {
      if (p.childNodes.length > 1 && isBRElement(p.firstChild, ELEMENT_TYPES.TRAILING_BREAK)) {
        p.firstChild.remove();
      }
    });

    // Capture cursor position AFTER BR removal
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
      ensureValidEmptyState(elementRef.current);
    }

    const paragraphs = findAllParagraphs(elementRef.current);

    // Extract text from cursor spots and track moved text node
    const { movedTextNode } = extractTextFromCursorSpots(paragraphs, true);

    // If cursor was in a spot, position it at the end of the moved text
    if (movedTextNode) {
      positionCursorAfterMovedText(movedTextNode, elementRef.current, lastKnownCursorPositionRef);
    }

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

    // If a new trigger was just created, render immediately to create the trigger element
    // This minimizes the window where cursor is at wrong position
    const newTriggers = extractedTokens.filter(isTriggerToken);
    const oldTriggers = lastEmittedTokensRef.current?.filter(isTriggerToken) || [];

    // Check if we need immediate rendering
    const isNewTrigger = newTriggers.length > oldTriggers.length;
    const hasStylingChange = needsImmediateRenderForStyling(
      newTriggers.filter(isTriggerToken),
      oldTriggers.filter(isTriggerToken)
    );

    if (isNewTrigger || hasStylingChange) {
      // Save cursor position before rendering
      const savedCursorPos = getCursorPosition(elementRef.current);

      // Render immediately to update trigger element
      renderTokensToDOM(extractedTokens, elementRef.current, reactContainersRef.current, { disabled, readOnly });

      if (isNewTrigger) {
        // Find the new trigger (not in oldTriggers)
        const oldTriggerIds = new Set(oldTriggers.map(t => (isTriggerToken(t) ? t.id : undefined)));
        const newTrigger = newTriggers.find(t => isTriggerToken(t) && !oldTriggerIds.has(t.id));

        // Position cursor inside the new trigger element
        if (newTrigger && isTriggerToken(newTrigger) && newTrigger.id) {
          const triggerElements = findElements(elementRef.current, {
            tokenType: ELEMENT_TYPES.TRIGGER,
            tokenId: newTrigger.id,
          });
          if (triggerElements.length > 0) {
            const triggerElement = triggerElements[0];
            const triggerTextNode = triggerElement.firstChild;
            if (triggerTextNode && isTextNode(triggerTextNode)) {
              const range = document.createRange();
              range.setStart(triggerTextNode, triggerTextNode.textContent?.length || 0);
              range.collapse(true);
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }
          }
        }
      } else {
        // Styling change only - restore cursor to saved position
        setCursorPosition(elementRef.current, savedCursorPos);
      }
    }

    // If all content was deleted, ensure proper empty state
    // Note: break tokens are valid content (newlines), don't clear them
    if (extractedTokens.length === 0) {
      // Ensure we have exactly one paragraph with BR
      if (!isEmptyState(elementRef.current)) {
        ensureValidEmptyState(elementRef.current);
        // Cursor will be restored by unified restoration to position 0
        lastKnownCursorPositionRef.current = 0;
      }
      extractedTokens = [];
    }

    const movedTokens = enforcePinnedTokenOrdering(extractedTokens);
    const tokensWereMoved = movedTokens.some((t, i) => t !== extractedTokens[i]);

    if (tokensWereMoved) {
      extractedTokens = movedTokens;

      // When tokens are moved, position cursor after all content
      const position = calculateEndPosition(movedTokens);
      lastKnownCursorPositionRef.current = position;

      // Render immediately to avoid showing intermediate state
      renderTokensToDOM(movedTokens, elementRef.current, reactContainersRef.current, { disabled, readOnly });

      // Position cursor immediately to avoid flicker
      // Only if element has focus to avoid stealing focus
      requestAnimationFrame(() => {
        if (elementRef.current && document.activeElement === elementRef.current) {
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
    let hasCursorOverride = false;

    if (shouldRestoreCursor) {
      // Check if we have a cursor position override with a pre-calculated position
      if (editableState.cursorPositionOverride) {
        savedCursorPosition = editableState.cursorPositionOverride.cursorPosition;
        hasCursorOverride = true;
        editableState.cursorPositionOverride = null;
      } else {
        savedCursorPosition = lastKnownCursorPositionRef.current;
      }
    }

    // Special case: typing into empty line OR typing after a reference
    // These cases need immediate cursor restoration to prevent jumping
    const prevLastToken = lastRenderedTokensRef.current?.[lastRenderedTokensRef.current.length - 1];
    const justStartedNewLine = prevLastToken && isBreakToken(prevLastToken);
    const wasCompletelyEmpty = !lastRenderedTokensRef.current || lastRenderedTokensRef.current.length === 0;
    const justAfterReference = prevLastToken && isReferenceToken(prevLastToken);

    // Check if CURRENT LINE (after last break) is only text
    let currentLineIsText = false;
    if (tokens && tokens.length > 0) {
      let lastBreakIndex = -1;
      for (let i = tokens.length - 1; i >= 0; i--) {
        if (isBreakToken(tokens[i])) {
          lastBreakIndex = i;
          break;
        }
      }
      const currentLineTokens = tokens.slice(lastBreakIndex + 1);
      currentLineIsText = currentLineTokens.length > 0 && currentLineTokens.every(isTextToken);
    }

    // Start tracking when typing into empty line OR after reference
    if ((justStartedNewLine || wasCompletelyEmpty || justAfterReference) && currentLineIsText) {
      isTypingIntoEmptyLineRef.current = true;
    }

    // Stop tracking when current line has non-text tokens
    if (!currentLineIsText && tokens && tokens.length > 0) {
      isTypingIntoEmptyLineRef.current = false;
    }

    // Reset when empty
    if (!tokens || tokens.length === 0) {
      isTypingIntoEmptyLineRef.current = false;
    }

    const isTypingIntoEmptyLine = isTypingIntoEmptyLineRef.current;

    lastRenderedTokensRef.current = tokens;

    if (isTypingIntoEmptyLine) {
      const renderResult = renderTokensToDOM(tokens ?? [], elementRef.current, reactContainersRef.current, {
        disabled,
        readOnly,
      });

      // If a new trigger was just created, position cursor inside it immediately
      if (renderResult.newTriggerElement) {
        const triggerTextNode = renderResult.newTriggerElement.firstChild;
        if (triggerTextNode && isTextNode(triggerTextNode)) {
          const range = document.createRange();
          range.setStart(triggerTextNode, triggerTextNode.textContent?.length || 0);
          range.collapse(true);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
          adjustInputHeight();
          return;
        }
      }

      // Otherwise restore cursor immediately (synchronously) to prevent jumping
      if (document.activeElement === elementRef.current && shouldRestoreCursor) {
        setCursorPosition(elementRef.current, savedCursorPosition);
      }

      adjustInputHeight();
      return;
    }

    // Calculate cursor position for space-after-trigger case
    let cursorPositionToRestore: number | null = null;
    if (triggerSplitAndMerged && tokens) {
      // Special case: space was added after trigger, position after the space
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];

        if (isTriggerToken(token) && nextToken && isTextToken(nextToken) && nextToken.value.startsWith('  ')) {
          cursorPositionToRestore = calculateEndPosition(tokens.slice(0, i + 1)) + 1;
          break;
        }
      }
    }

    renderTokensToDOM(tokens ?? [], elementRef.current, reactContainersRef.current, { disabled, readOnly });

    // Check if we have only pinned references (after submit)
    const onlyPinnedReferences = tokens && tokens.length > 0 && tokens.every(isPinnedReferenceToken);

    // Check if this is a special case that needs custom cursor positioning
    const needsCalculatedCursorPosition =
      editableState.menuSelectionTokenId ||
      hasCursorOverride ||
      cursorPositionToRestore !== null ||
      onlyPinnedReferences;

    // For normal structural changes, restore cursor immediately using lastKnownCursorPositionRef
    // This allows insertText and handleInput to control the final cursor position
    // For special cases, use RAF restoration with calculated position
    if (!needsCalculatedCursorPosition && document.activeElement === elementRef.current) {
      setCursorPosition(elementRef.current, lastKnownCursorPositionRef.current);
      adjustInputHeight();
      return;
    }

    // ============================================================================
    // UNIFIED CURSOR RESTORATION (RAF-based, for special cases)
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
              targetPosition = getCursorPositionAtIndex(tokens, refIndex);
            }
          }

          ignoreCursorDetection.current = false;
        }

        // Special case 2: Space after trigger - position after the space
        if (cursorPositionToRestore !== null) {
          targetPosition = cursorPositionToRestore;
        }

        // Special case 3: Only pinned references (after submit)
        // Position cursor after all pinned references
        if (onlyPinnedReferences && tokens) {
          targetPosition = calculateEndPosition(tokens);
        }

        // Unified restoration: only restore if element has focus
        // This prevents stealing focus from other elements
        if (document.activeElement === elementRef.current) {
          setCursorPosition(elementRef.current, targetPosition);

          // Apply Safari ghost cursor fix if needed
          applySafariCursorFix(elementRef.current, editableState, targetPosition);
        }
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
