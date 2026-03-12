// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { ELEMENT_TYPES } from '../core/constants';
import { CursorController, TOKEN_LENGTHS } from '../core/cursor-controller';
import { extractTextFromCursorSpots } from '../core/cursor-spot-utils';
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
import {
  isBreakToken,
  isBRElement,
  isHTMLElement,
  isPinnedReferenceToken,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

export interface EditableState {
  skipNextZwnjUpdate: boolean;
  menuSelectionTokenId: string | null;
  menuSelectionIsPinned: boolean;
}

export function createEditableState(): EditableState {
  return {
    skipNextZwnjUpdate: false,
    menuSelectionTokenId: null,
    menuSelectionIsPinned: false,
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
  cursorController: CursorController | null;
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
  cursorController,
}: UseEditableOptions): UseEditableReturn {
  const lastRenderedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastEmittedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const lastDisabledRef = useRef(disabled);
  const lastReadOnlyRef = useRef(readOnly);
  const skipNextZwnjUpdateRef = useRef(false);
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
    if (cursorController) {
      cursorController.capture();
    }

    // Read flags from shared state
    if (editableState.skipNextZwnjUpdate) {
      skipNextZwnjUpdateRef.current = true;
      editableState.skipNextZwnjUpdate = false;
    }

    // Check if content is effectively empty (only whitespace/BRs)
    const hasRealContent = Array.from(elementRef.current.childNodes).some(node => {
      if (isTextNode(node)) {
        return (node.textContent?.trim().length ?? 0) > 0;
      }
      if (isHTMLElement(node)) {
        return node.tagName !== 'BR' && (node.textContent?.trim().length ?? 0) > 0;
      }
      return false;
    });

    if (!hasRealContent || elementRef.current.children.length === 0) {
      ensureValidEmptyState(elementRef.current);
    }

    const paragraphs = findAllParagraphs(elementRef.current);

    // Extract text from cursor spots and track moved text node
    const { movedTextNode } = extractTextFromCursorSpots(paragraphs, true);

    // If cursor was in a spot, position it at the end of the moved text
    if (movedTextNode && cursorController) {
      cursorController.positionAfterText(movedTextNode);
    }

    const directTextNodes = Array.from(elementRef.current.childNodes).filter(
      node => isTextNode(node) && node.textContent?.trim()
    );

    if (directTextNodes.length > 0) {
      // Capture cursor before moving nodes
      if (cursorController) {
        cursorController.capture();
      }

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

      // Restore cursor after moving nodes
      if (cursorController) {
        cursorController.restore();
      }
    }

    // Extract tokens
    let extractedTokens = extractTokensFromDOM(elementRef.current, menus);

    // If a new trigger was just created, render immediately to create the trigger element
    // This minimizes the window where cursor is at wrong position
    const newTriggers = extractedTokens.filter(isTriggerToken);

    // Get existing trigger IDs from DOM
    const existingTriggerElements = findElements(elementRef.current, { tokenType: ELEMENT_TYPES.TRIGGER });
    const existingTriggerIds = new Set(existingTriggerElements.map(el => el.id).filter(Boolean));

    // Check if any trigger has a NEW ID that doesn't exist in DOM
    const isNewTrigger = newTriggers.some(t => t.id && !existingTriggerIds.has(t.id));

    // Check if any trigger's filter text changed from empty to non-empty (or vice versa)
    // This needs immediate rendering to update className for underline styling
    const hasStylingChange = newTriggers.some(newT => {
      // Find the corresponding DOM element
      const domElement = existingTriggerElements.find(el => el.id === newT.id);
      if (!domElement) {
        return false;
      }

      // Check if className needs to change
      const currentHasClass = domElement.className.includes('trigger-token');
      const shouldHaveClass = newT.value.length > 0;
      return currentHasClass !== shouldHaveClass;
    });

    if (isNewTrigger || hasStylingChange) {
      // Capture cursor before rendering
      if (cursorController) {
        cursorController.capture();
      }

      // Render immediately
      renderTokensToDOM(extractedTokens, elementRef.current, reactContainersRef.current, { disabled, readOnly });

      // Restore cursor after rendering
      if (cursorController) {
        cursorController.restore();
      }
    }

    // If all content was deleted, ensure proper empty state
    // Note: break tokens are valid content (newlines), don't clear them
    if (extractedTokens.length === 0) {
      // Ensure we have exactly one paragraph with BR
      if (!isEmptyState(elementRef.current)) {
        ensureValidEmptyState(elementRef.current);
        // Cursor at position 0
        if (cursorController) {
          cursorController.setPosition(0);
        }
      }
      extractedTokens = [];
    }

    const movedTokens = enforcePinnedTokenOrdering(extractedTokens);
    const tokensWereMoved = movedTokens.some((t, i) => t !== extractedTokens[i]);

    if (tokensWereMoved) {
      extractedTokens = movedTokens;

      // When tokens are moved, position cursor after all content
      // Calculate total length using TOKEN_LENGTHS
      let position = 0;
      for (const token of movedTokens) {
        if (isTextToken(token)) {
          position += TOKEN_LENGTHS.text(token.value);
        } else if (isBreakToken(token)) {
          position += TOKEN_LENGTHS.LINE_BREAK;
        } else if (isTriggerToken(token)) {
          position += TOKEN_LENGTHS.trigger(token.value);
        } else {
          position += TOKEN_LENGTHS.REFERENCE;
        }
      }

      if (cursorController) {
        cursorController.setPosition(position);
      }

      // Render immediately to avoid showing intermediate state
      renderTokensToDOM(movedTokens, elementRef.current, reactContainersRef.current, { disabled, readOnly });

      // Position cursor after rendering (if element has focus)
      if (elementRef.current && document.activeElement === elementRef.current && cursorController) {
        cursorController.setPosition(position);
      }
    }

    const value = tokensToText ? tokensToText(extractedTokens) : getPromptText(extractedTokens);
    onChange({ value, tokens: extractedTokens });

    lastEmittedTokensRef.current = extractedTokens;

    adjustInputHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, adjustInputHeight, tokensToText, ignoreCursorDetection]);

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

    // Enforce pinned token ordering - pinned tokens must always be first
    const orderedTokens = tokens ? enforcePinnedTokenOrdering(tokens) : tokens;

    // Check if disabled/readOnly changed - force rerender if so
    const stateChanged = lastDisabledRef.current !== disabled || lastReadOnlyRef.current !== readOnly;
    lastDisabledRef.current = disabled;
    lastReadOnlyRef.current = readOnly;

    // Check if a trigger split+merge happened (same token count, but text token value changed)
    // This is a structural change that needs cursor repositioning
    const triggerSplitAndMerged =
      lastRenderedTokensRef.current &&
      orderedTokens &&
      lastRenderedTokensRef.current.length === orderedTokens.length &&
      orderedTokens.some((token, i) => {
        const oldToken = lastRenderedTokensRef.current![i];
        const prevToken = i > 0 ? orderedTokens[i - 1] : null;
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
      stateChanged || shouldRerender(lastRenderedTokensRef.current, orderedTokens) || triggerSplitAndMerged;

    if (!needsRerender) {
      // Even if no rerender, check for menu selection cursor positioning
      if (editableState.menuSelectionTokenId && cursorController) {
        const insertedTokenIndex = (orderedTokens ?? []).findIndex(
          t => isReferenceToken(t) && t.id === editableState.menuSelectionTokenId
        );

        if (insertedTokenIndex !== -1) {
          let cursorPos = 0;
          for (let i = 0; i <= insertedTokenIndex; i++) {
            const token = (orderedTokens ?? [])[i];
            if (isTextToken(token)) {
              cursorPos += TOKEN_LENGTHS.text(token.value);
            } else if (isBreakToken(token)) {
              cursorPos += TOKEN_LENGTHS.LINE_BREAK;
            } else if (isTriggerToken(token)) {
              cursorPos += TOKEN_LENGTHS.trigger(token.value);
            } else {
              cursorPos += TOKEN_LENGTHS.REFERENCE;
            }
          }

          cursorController.setPosition(cursorPos);
          editableState.menuSelectionTokenId = null;
        }
      }

      lastRenderedTokensRef.current = orderedTokens;
      return;
    }

    if (
      lastRenderedTokensRef.current &&
      orderedTokens &&
      lastRenderedTokensRef.current.length === 0 &&
      orderedTokens.length === 0
    ) {
      lastRenderedTokensRef.current = orderedTokens;
      return;
    }

    // Check for menu selection BEFORE any rendering logic
    if (editableState.menuSelectionTokenId && cursorController) {
      const insertedTokenIndex = (orderedTokens ?? []).findIndex(
        t => isReferenceToken(t) && t.id === editableState.menuSelectionTokenId
      );

      if (insertedTokenIndex !== -1) {
        // Calculate position after the inserted token
        let cursorPos = 0;
        for (let i = 0; i <= insertedTokenIndex; i++) {
          const token = (orderedTokens ?? [])[i];
          if (isTextToken(token)) {
            cursorPos += TOKEN_LENGTHS.text(token.value);
          } else if (isBreakToken(token)) {
            cursorPos += TOKEN_LENGTHS.LINE_BREAK;
          } else if (isTriggerToken(token)) {
            cursorPos += TOKEN_LENGTHS.trigger(token.value);
          } else {
            cursorPos += TOKEN_LENGTHS.REFERENCE;
          }
        }

        // Render first
        renderTokensToDOM(orderedTokens ?? [], elementRef.current, reactContainersRef.current, { disabled, readOnly });

        // Then position cursor
        cursorController.setPosition(cursorPos);

        editableState.menuSelectionTokenId = null; // Clear flag
        lastRenderedTokensRef.current = orderedTokens;
        adjustInputHeight();
        return;
      }
    }

    if (skipNextZwnjUpdateRef.current) {
      skipNextZwnjUpdateRef.current = false;
    }

    // Special case: typing into empty line OR typing after a reference
    // These cases need immediate cursor restoration to prevent jumping
    const prevLastToken = lastRenderedTokensRef.current?.[lastRenderedTokensRef.current.length - 1];
    const justStartedNewLine = prevLastToken && isBreakToken(prevLastToken);
    const wasCompletelyEmpty = !lastRenderedTokensRef.current || lastRenderedTokensRef.current.length === 0;
    const justAfterReference = prevLastToken && isReferenceToken(prevLastToken);

    // Check if CURRENT LINE (after last break) is only text
    let currentLineIsText = false;
    if (orderedTokens && orderedTokens.length > 0) {
      let lastBreakIndex = -1;
      for (let i = orderedTokens.length - 1; i >= 0; i--) {
        if (isBreakToken(orderedTokens[i])) {
          lastBreakIndex = i;
          break;
        }
      }
      const currentLineTokens = orderedTokens.slice(lastBreakIndex + 1);
      currentLineIsText = currentLineTokens.length > 0 && currentLineTokens.every(isTextToken);
    }

    // Start tracking when typing into empty line OR after reference
    if ((justStartedNewLine || wasCompletelyEmpty || justAfterReference) && currentLineIsText) {
      isTypingIntoEmptyLineRef.current = true;
    }

    // Stop tracking when current line has non-text tokens
    if (!currentLineIsText && orderedTokens && orderedTokens.length > 0) {
      isTypingIntoEmptyLineRef.current = false;
    }

    // Reset when empty
    if (!orderedTokens || orderedTokens.length === 0) {
      isTypingIntoEmptyLineRef.current = false;
    }

    const isTypingIntoEmptyLine = isTypingIntoEmptyLineRef.current;

    lastRenderedTokensRef.current = orderedTokens;

    if (isTypingIntoEmptyLine) {
      // Capture cursor before rendering
      if (cursorController) {
        cursorController.capture();
      }

      const renderResult = renderTokensToDOM(orderedTokens ?? [], elementRef.current, reactContainersRef.current, {
        disabled,
        readOnly,
      });

      // Check for menu selection in isTypingIntoEmptyLine path
      if (editableState.menuSelectionTokenId && cursorController) {
        const insertedTokenIndex = (orderedTokens ?? []).findIndex(
          t => isReferenceToken(t) && t.id === editableState.menuSelectionTokenId
        );

        if (insertedTokenIndex !== -1) {
          let cursorPos = 0;
          for (let i = 0; i <= insertedTokenIndex; i++) {
            const token = (orderedTokens ?? [])[i];
            if (isTextToken(token)) {
              cursorPos += TOKEN_LENGTHS.text(token.value);
            } else if (isBreakToken(token)) {
              cursorPos += TOKEN_LENGTHS.LINE_BREAK;
            } else if (isTriggerToken(token)) {
              cursorPos += TOKEN_LENGTHS.trigger(token.value);
            } else {
              cursorPos += TOKEN_LENGTHS.REFERENCE;
            }
          }

          cursorController.setPosition(cursorPos);
          editableState.menuSelectionTokenId = null;
          adjustInputHeight();
          return;
        }
      }

      // If a new trigger was just created (not just filter text added), position cursor
      // Check if this is truly a new trigger by comparing with old triggers
      const oldTriggerIds = new Set((lastRenderedTokensRef.current ?? []).filter(isTriggerToken).map(t => t.id));
      const newTriggerIds = (orderedTokens ?? []).filter(isTriggerToken).map(t => t.id);
      const hasNewTriggerId = newTriggerIds.some(id => !oldTriggerIds.has(id));

      if (renderResult.newTriggerElement && hasNewTriggerId && cursorController) {
        // Find the trigger token in the tokens array
        const triggerTokens = (orderedTokens ?? []).filter(isTriggerToken);
        if (triggerTokens.length > 0) {
          const lastTrigger = triggerTokens[triggerTokens.length - 1];
          const triggerIndex = (orderedTokens ?? []).indexOf(lastTrigger);

          // Calculate position before trigger using TOKEN_LENGTHS
          let positionBeforeTrigger = 0;
          for (let i = 0; i < triggerIndex; i++) {
            const token = (orderedTokens ?? [])[i];
            if (isTextToken(token)) {
              positionBeforeTrigger += TOKEN_LENGTHS.text(token.value);
            } else if (isBreakToken(token)) {
              positionBeforeTrigger += TOKEN_LENGTHS.LINE_BREAK;
            } else if (isTriggerToken(token)) {
              positionBeforeTrigger += TOKEN_LENGTHS.trigger(token.value);
            } else {
              positionBeforeTrigger += TOKEN_LENGTHS.REFERENCE;
            }
          }

          // Position after trigger = before + trigger length
          const positionAfterTrigger = positionBeforeTrigger + TOKEN_LENGTHS.trigger(lastTrigger.value);

          cursorController.setPosition(positionAfterTrigger);
          adjustInputHeight();
          return;
        }
      }

      // Restore cursor after rendering
      if (cursorController) {
        cursorController.restore();
      }

      adjustInputHeight();
      return;
    }

    // Capture cursor before rendering
    if (cursorController) {
      cursorController.capture();
    }

    renderTokensToDOM(orderedTokens ?? [], elementRef.current, reactContainersRef.current, { disabled, readOnly });

    // Check if this is a menu selection - position cursor after inserted token
    if (editableState.menuSelectionTokenId && cursorController) {
      const insertedTokenIndex = (orderedTokens ?? []).findIndex(
        t => isReferenceToken(t) && t.id === editableState.menuSelectionTokenId
      );

      if (insertedTokenIndex !== -1) {
        // Calculate position after the inserted token
        let cursorPos = 0;
        for (let i = 0; i <= insertedTokenIndex; i++) {
          const token = (orderedTokens ?? [])[i];
          if (isTextToken(token)) {
            cursorPos += TOKEN_LENGTHS.text(token.value);
          } else if (isBreakToken(token)) {
            cursorPos += TOKEN_LENGTHS.LINE_BREAK;
          } else if (isTriggerToken(token)) {
            cursorPos += TOKEN_LENGTHS.trigger(token.value);
          } else {
            cursorPos += TOKEN_LENGTHS.REFERENCE;
          }
        }

        cursorController.setPosition(cursorPos);
        editableState.menuSelectionTokenId = null; // Clear flag
        adjustInputHeight();
        return;
      }
    }

    // Restore cursor after rendering
    if (cursorController) {
      const savedPosition = cursorController.getSavedPosition();

      // Check if we just cleared to only pinned tokens (common after submission)
      const hasPinnedTokens = orderedTokens?.some(isPinnedReferenceToken) ?? false;
      const hasOnlyPinnedTokens = (hasPinnedTokens && orderedTokens?.every(t => isPinnedReferenceToken(t))) ?? false;

      // Calculate total length of current tokens
      let totalLength = 0;
      for (const token of orderedTokens ?? []) {
        if (isTextToken(token)) {
          totalLength += TOKEN_LENGTHS.text(token.value);
        } else if (isBreakToken(token)) {
          totalLength += TOKEN_LENGTHS.LINE_BREAK;
        } else if (isTriggerToken(token)) {
          totalLength += TOKEN_LENGTHS.trigger(token.value);
        } else {
          totalLength += TOKEN_LENGTHS.REFERENCE;
        }
      }

      // If saved position is beyond current content, position at end
      const savedPositionInvalid = savedPosition !== null && savedPosition > totalLength;

      if (hasOnlyPinnedTokens || savedPositionInvalid) {
        // Position cursor at end of content (after all tokens)
        cursorController.setPosition(totalLength);
      } else {
        cursorController.restore();
      }
    }

    adjustInputHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, readOnly, tokens, adjustInputHeight]);

  return {
    handleInput,
    editableState,
  };
}

export type SetCursorPositionCallback = (position: number | null) => void;
