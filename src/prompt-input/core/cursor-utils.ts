// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-editable-tokens';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { getCursorPosition, getTokenCursorLength, setCursorPosition } from './cursor-manager';
import { findElements, getTokenType, insertAfter } from './dom-utils';
import { isTextNode } from './type-guards';

declare global {
  interface Window {
    isMouseDown?: boolean;
    isMouseDownForCursor?: boolean;
  }
}

export interface CursorSpotExtractionResult {
  movedTextNode: Text | null;
}

export function extractTextFromCursorSpots(
  paragraphs: HTMLElement[],
  trackCursor: boolean = true
): CursorSpotExtractionResult {
  let movedTextNode: Text | null = null;

  paragraphs.forEach(p => {
    const cursorSpots = findElements(p, {
      tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER],
    });

    cursorSpots.forEach(spot => {
      const content = spot.textContent || '';
      const cleanContent = content.replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');

      if (cleanContent) {
        let cursorWasHere = false;
        if (trackCursor) {
          const selection = window.getSelection();
          if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            if (spot.contains(range.startContainer)) {
              cursorWasHere = true;
            }
          }
        }

        const textNode = document.createTextNode(cleanContent);
        const wrapper = spot.parentElement;

        if (wrapper) {
          if (spot.getAttribute('data-type') === ELEMENT_TYPES.CURSOR_SPOT_BEFORE) {
            wrapper.parentNode?.insertBefore(textNode, wrapper);
          } else {
            insertAfter(textNode, wrapper);
          }
        }

        if (cursorWasHere) {
          movedTextNode = textNode;
        }
      }

      spot.textContent = SPECIAL_CHARS.ZWNJ;
    });
  });

  return { movedTextNode };
}

export function positionCursorAfterMovedText(
  movedTextNode: Text,
  element: HTMLElement,
  lastKnownCursorPositionRef: React.MutableRefObject<number>
): void {
  const range = document.createRange();
  range.setStart(movedTextNode, movedTextNode.textContent?.length || 0);
  range.collapse(true);

  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const newPos = getCursorPosition(element);
  lastKnownCursorPositionRef.current = newPos;
}

export function setCursorOverride(state: EditableState, position: number, paragraphId: string | null = null): void {
  state.cursorPositionOverride = { cursorPosition: position, paragraphId };
  state.skipCursorRestore = false;
}

export function applySafariCursorFix(element: HTMLDivElement, state: EditableState, position: number): void {
  if (state.isDeleteOperation) {
    state.isDeleteOperation = false;
    setCursorPosition(element, position);

    // Collapse selection to force Safari to update cursor rendering
    // This avoids screenreader disruption from blur/focus
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      selection.collapse(range.startContainer, range.startOffset);
    }
  }
}

export function calculateTokenPosition(
  tokens: readonly PromptInputProps.InputToken[],
  targetIndex: number,
  includeTarget: boolean = false
): number {
  let position = 0;
  const endIndex = includeTarget ? targetIndex : targetIndex - 1;

  for (let i = 0; i <= endIndex && i < tokens.length; i++) {
    position += getTokenCursorLength(tokens[i]);
  }

  return position;
}

export function calculateEndPosition(tokens: readonly PromptInputProps.InputToken[]): number {
  return tokens.reduce((sum, token) => sum + getTokenCursorLength(token), 0);
}

export function getCurrentSelection(): Selection | null {
  return window.getSelection();
}

export function getFirstRange(): Range | null {
  const selection = getCurrentSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  return selection.getRangeAt(0);
}

export function selectAllContent(element: HTMLElement): void {
  const selection = getCurrentSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(element);

  selection.removeAllRanges();
  selection.addRange(range);
}

export function normalizeSelection(selection: Selection | null, skipCursorSpots: boolean = false): void {
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed || window.isMouseDown || skipCursorSpots) {
    return;
  }

  const normalizeBoundary = (container: Node) => {
    if (!isTextNode(container)) {
      return null;
    }

    const parent = container.parentElement;
    if (!parent) {
      return null;
    }

    const parentType = getTokenType(parent);
    if (parentType !== ELEMENT_TYPES.CURSOR_SPOT_BEFORE && parentType !== ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
      return null;
    }

    const wrapper = parent.parentElement;
    const wrapperType = wrapper ? getTokenType(wrapper) : null;
    if (!wrapper || (wrapperType !== ELEMENT_TYPES.REFERENCE && wrapperType !== ELEMENT_TYPES.PINNED)) {
      return null;
    }

    const paragraph = wrapper.parentElement;
    if (!paragraph) {
      return null;
    }

    const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);
    const newOffset = parentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE ? wrapperIndex : wrapperIndex + 1;

    return { container: paragraph, offset: newOffset };
  };

  const normalizedStart = normalizeBoundary(range.startContainer);
  const normalizedEnd = normalizeBoundary(range.endContainer);

  if (normalizedStart || normalizedEnd) {
    const updatedRange = document.createRange();
    updatedRange.setStart(
      normalizedStart?.container ?? range.startContainer,
      normalizedStart?.offset ?? range.startOffset
    );
    updatedRange.setEnd(normalizedEnd?.container ?? range.endContainer, normalizedEnd?.offset ?? range.endOffset);
    selection.removeAllRanges();
    selection.addRange(updatedRange);
  }
}
