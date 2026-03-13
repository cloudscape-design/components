// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { PromptInputProps } from '../interfaces';
import { EditableState } from '../tokens/use-editable-tokens';
import { ELEMENT_TYPES } from './constants';
import { CursorController, TOKEN_LENGTHS } from './cursor-controller';
import { findAllParagraphs, generateTokenId, getTokenType } from './dom-utils';
import { getPromptText } from './token-operations';
import { isBreakToken, isHTMLElement, isPinnedReferenceToken, isTextNode } from './type-guards';

function findLastPinnedTokenIndex(tokens: readonly PromptInputProps.InputToken[]): number {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (isPinnedReferenceToken(tokens[i])) {
      return i;
    }
  }
  return -1;
}

export function enforcePinnedTokenOrdering(
  tokens: readonly PromptInputProps.InputToken[]
): PromptInputProps.InputToken[] {
  const lastPinnedIndex = findLastPinnedTokenIndex(tokens);

  if (lastPinnedIndex === -1) {
    return [...tokens];
  }

  const pinnedTokens: PromptInputProps.InputToken[] = [];
  const forbiddenContent: PromptInputProps.InputToken[] = [];
  const allowedContent: PromptInputProps.InputToken[] = [];

  tokens.forEach((token, index) => {
    if (isPinnedReferenceToken(token)) {
      pinnedTokens.push(token);
    } else if (index <= lastPinnedIndex) {
      forbiddenContent.push(token);
    } else {
      allowedContent.push(token);
    }
  });

  return [...pinnedTokens, ...forbiddenContent, ...allowedContent];
}

/**
 * Merge consecutive text tokens to avoid DOM fragmentation
 * This prevents issues with cursor positioning when text nodes are split
 */
export function mergeConsecutiveTextTokens(
  tokens: readonly PromptInputProps.InputToken[]
): PromptInputProps.InputToken[] {
  const result: PromptInputProps.InputToken[] = [];

  for (const token of tokens) {
    const lastToken = result[result.length - 1];

    // If both current and last tokens are text tokens, merge them
    if (lastToken && lastToken.type === 'text' && token.type === 'text') {
      lastToken.value += token.value;
    } else {
      result.push({ ...token });
    }
  }

  return result;
}

export function areAllTokensPinned(tokens: readonly PromptInputProps.InputToken[]): boolean {
  return tokens.every(isPinnedReferenceToken);
}

export function validateTriggerWithPinnedTokens(
  menu: PromptInputProps.MenuDefinition,
  precedingTokens: readonly PromptInputProps.InputToken[]
): boolean {
  if (menu.useAtStart) {
    return areAllTokensPinned(precedingTokens);
  }
  return true;
}

export function validateTrigger(
  menu: PromptInputProps.MenuDefinition,
  triggerIndex: number,
  text: string,
  precedingTokens: readonly PromptInputProps.InputToken[]
): boolean {
  const isAtStart = triggerIndex === 0;
  const charBefore = triggerIndex > 0 ? text[triggerIndex - 1] : '';
  const isAfterWhitespace = /\s/.test(charBefore);

  if (menu.useAtStart) {
    return isAtStart && areAllTokensPinned(precedingTokens);
  }

  return isAtStart || isAfterWhitespace;
}

export function detectTriggersInText(
  text: string,
  menus: readonly PromptInputProps.MenuDefinition[],
  precedingTokens: readonly PromptInputProps.InputToken[],
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean
): PromptInputProps.InputToken[] {
  const results: PromptInputProps.InputToken[] = [];
  let position = 0;

  while (position < text.length) {
    let earliestTriggerIndex = -1;
    let earliestMenu: PromptInputProps.MenuDefinition | null = null;

    // Find the earliest VALID trigger in the remaining text
    for (const menu of menus) {
      let searchPos = position;

      // Keep searching for this trigger character until we find a valid one or run out
      while (searchPos < text.length) {
        const triggerIndex = text.indexOf(menu.trigger, searchPos);
        if (triggerIndex === -1) {
          break;
        }

        const isValid = validateTrigger(menu, triggerIndex, text, precedingTokens);

        if (isValid) {
          // Fire onTriggerDetected event to allow consumer to cancel
          if (onTriggerDetected) {
            const wasPrevented = onTriggerDetected({
              menuId: menu.id,
              triggerChar: menu.trigger,
              position: triggerIndex,
            });

            if (wasPrevented) {
              // Consumer cancelled this trigger, continue searching
              searchPos = triggerIndex + menu.trigger.length;
              continue;
            }
          }

          // Found a valid trigger - check if it's the earliest
          if (earliestTriggerIndex === -1 || triggerIndex < earliestTriggerIndex) {
            earliestTriggerIndex = triggerIndex;
            earliestMenu = menu;
          }
          break;
        }

        // This trigger was invalid, continue searching after it
        searchPos = triggerIndex + menu.trigger.length;
      }
    }

    if (earliestMenu && earliestTriggerIndex !== -1) {
      // Add text before trigger
      const beforeTrigger = text.substring(position, earliestTriggerIndex);
      if (beforeTrigger) {
        results.push({ type: 'text', value: beforeTrigger });
      }

      // Process trigger
      const afterTrigger = text.substring(earliestTriggerIndex + earliestMenu.trigger.length);
      let filterText = '';
      let endOfTrigger = earliestTriggerIndex + earliestMenu.trigger.length;

      if (afterTrigger && !/^\s/.test(afterTrigger)) {
        let endIndex = 0;
        while (endIndex < afterTrigger.length && !/\s/.test(afterTrigger[endIndex])) {
          endIndex++;
        }
        filterText = afterTrigger.substring(0, endIndex);
        endOfTrigger += endIndex;
      }

      results.push({
        type: 'trigger',
        value: filterText,
        triggerChar: earliestMenu.trigger,
        id: generateTokenId('trigger'),
      });

      // Continue from after this trigger
      position = endOfTrigger;
    } else {
      // No valid trigger found from current position - add remaining text and exit
      const remainingText = text.substring(position);
      if (remainingText) {
        results.push({ type: 'text', value: remainingText });
      }
      break;
    }
  }

  return results.length > 0 ? results : [{ type: 'text', value: text }];
}

export type ArrowDirection = 'left' | 'right';

export interface AdjacentTokenResult {
  sibling: Node | null;
  isReferenceToken: boolean;
}

export function findAdjacentToken(container: Node, offset: number, direction: ArrowDirection): AdjacentTokenResult {
  let sibling: Node | null = null;

  // If we're in a cursor spot, check if we should jump over the wrapper
  if (isHTMLElement(container.parentElement)) {
    const parentType = getTokenType(container.parentElement);
    if (parentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE || parentType === ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
      // We're in a cursor spot - always jump over the entire wrapper
      const wrapper = container.parentElement.parentElement;
      const wrapperType = wrapper ? getTokenType(wrapper as HTMLElement) : null;
      const isInReferenceWrapper = wrapperType === ELEMENT_TYPES.REFERENCE || wrapperType === ELEMENT_TYPES.PINNED;

      if (isInReferenceWrapper && wrapper) {
        // Always treat being in a cursor spot as needing to jump over the wrapper
        return { sibling: wrapper, isReferenceToken: true };
      }
    }
  }

  if (isTextNode(container)) {
    const isAtBoundary = direction === 'left' ? offset === 0 : offset === (container.textContent?.length || 0);

    if (isAtBoundary) {
      sibling = direction === 'left' ? container.previousSibling : container.nextSibling;
    }
  } else if (isHTMLElement(container)) {
    // When cursor is in a paragraph at offset N, it's positioned BEFORE childNodes[N]
    // For left arrow: check childNodes[N-1] (element we're moving away from)
    // For right arrow: check childNodes[N] (element we're moving into)
    if (direction === 'left') {
      sibling = offset > 0 ? container.childNodes[offset - 1] : container.previousSibling;
    } else {
      sibling = offset < container.childNodes.length ? container.childNodes[offset] : container.nextSibling;
    }
  }

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  const isReferenceToken = siblingType === ELEMENT_TYPES.REFERENCE || siblingType === ELEMENT_TYPES.PINNED;

  // If already a reference token, return it
  if (isReferenceToken) {
    return { sibling, isReferenceToken: true };
  }

  // Check if the sibling is a cursor spot (we're about to enter a reference token)
  if (isHTMLElement(sibling)) {
    const isCursorSpot =
      siblingType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE || siblingType === ELEMENT_TYPES.CURSOR_SPOT_AFTER;
    if (isCursorSpot && sibling.parentElement) {
      const wrapperType = getTokenType(sibling.parentElement);
      const isInReferenceWrapper = wrapperType === ELEMENT_TYPES.REFERENCE || wrapperType === ELEMENT_TYPES.PINNED;
      if (isInReferenceWrapper) {
        return { sibling: sibling.parentElement, isReferenceToken: true };
      }
    }
  }

  return { sibling, isReferenceToken: false };
}

export type MergeDirection = 'forward' | 'backward';

interface MergeParagraphsParams {
  direction: MergeDirection;
  editableElement: HTMLDivElement;
  tokens: readonly PromptInputProps.InputToken[];
  currentParagraphIndex: number;
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  state?: EditableState;
  cursorController?: CursorController | null;
}

export function mergeParagraphs(params: MergeParagraphsParams): boolean {
  const { direction, editableElement, tokens, currentParagraphIndex, tokensToText, onChange, cursorController } =
    params;

  const paragraphs = findAllParagraphs(editableElement);

  if (direction === 'backward') {
    if (currentParagraphIndex <= 0) {
      return false;
    }
  } else {
    if (currentParagraphIndex >= paragraphs.length - 1) {
      return false;
    }
  }

  const breakIndexToRemove = direction === 'backward' ? currentParagraphIndex : currentParagraphIndex + 1;

  let breakCount = 0;

  const newTokens = tokens.filter(token => {
    if (isBreakToken(token)) {
      breakCount++;
      if (breakCount === breakIndexToRemove) {
        return false;
      }
    }
    return true;
  });

  const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
  onChange({ value, tokens: newTokens });

  // Position cursor at calculated position
  if (cursorController) {
    const currentPos = cursorController.getPosition();
    const newCursorPos = currentPos - TOKEN_LENGTHS.LINE_BREAK;
    cursorController.setPosition(newCursorPos);
  }

  return true;
}

export function handleBackspaceAtParagraphStart(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  tokens: readonly PromptInputProps.InputToken[],
  tokensToText: ((tokens: readonly PromptInputProps.InputToken[]) => string) | undefined,
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  state: EditableState | undefined,
  cursorController: CursorController | null
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);

  if (range.startOffset !== 0 || range.startContainer.nodeName !== 'P') {
    return false;
  }

  const paragraphs = findAllParagraphs(editableElement);
  const currentP = range.startContainer;
  const pIndex = Array.from(paragraphs).indexOf(currentP as HTMLParagraphElement);

  if (pIndex < 0) {
    return false;
  }

  event.preventDefault();

  return mergeParagraphs({
    direction: 'backward',
    editableElement,
    tokens,
    currentParagraphIndex: pIndex,
    tokensToText,
    onChange,
    state,
    cursorController,
  });
}

export function handleDeleteAtParagraphEnd(
  event: React.KeyboardEvent<HTMLDivElement>,
  editableElement: HTMLDivElement,
  tokens: readonly PromptInputProps.InputToken[],
  tokensToText: ((tokens: readonly PromptInputProps.InputToken[]) => string) | undefined,
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  state: EditableState | undefined,
  cursorController: CursorController | null
): boolean {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const container = range.startContainer;

  let isAtEndOfParagraph = false;
  let currentP: HTMLParagraphElement | null = null;

  if (container.nodeName === 'P') {
    currentP = container as HTMLParagraphElement;
    const hasOnlyTrailingBR = currentP.childNodes.length === 1 && currentP.firstChild?.nodeName === 'BR';
    isAtEndOfParagraph = hasOnlyTrailingBR || range.startOffset === currentP.childNodes.length;
  } else if (container.nodeType === Node.TEXT_NODE) {
    isAtEndOfParagraph = range.startOffset === (container.textContent?.length || 0) && !container.nextSibling;
    let node: Node | null = container;
    while (node && node.nodeName !== 'P') {
      node = node.parentNode;
    }
    currentP = node as HTMLParagraphElement;
  }

  if (!isAtEndOfParagraph || !currentP) {
    return false;
  }

  const paragraphs = findAllParagraphs(editableElement);
  const pIndex = Array.from(paragraphs).indexOf(currentP);

  if (pIndex < 0) {
    return false;
  }

  event.preventDefault();

  return mergeParagraphs({
    direction: 'forward',
    editableElement,
    tokens,
    currentParagraphIndex: pIndex,
    tokensToText,
    onChange,
    state,
    cursorController,
  });
}
