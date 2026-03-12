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

export function canDeleteToken(token: PromptInputProps.InputToken): boolean {
  return !isPinnedReferenceToken(token);
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
  precedingTokens: readonly PromptInputProps.InputToken[]
): PromptInputProps.InputToken[] {
  const results: PromptInputProps.InputToken[] = [];
  let position = 0;

  while (position < text.length) {
    let foundTrigger = false;

    for (const menu of menus) {
      const triggerIndex = text.indexOf(menu.trigger, position);
      if (triggerIndex === -1) {
        continue;
      }

      if (!validateTrigger(menu, triggerIndex, text, precedingTokens)) {
        continue;
      }

      const beforeTrigger = text.substring(position, triggerIndex);
      if (beforeTrigger) {
        results.push({ type: 'text', value: beforeTrigger });
      }

      const afterTrigger = text.substring(triggerIndex + menu.trigger.length);
      let filterText = '';
      let remainingText = afterTrigger;

      if (afterTrigger && !/^\s/.test(afterTrigger)) {
        let endIndex = 0;
        while (endIndex < afterTrigger.length && !/\s/.test(afterTrigger[endIndex])) {
          endIndex++;
        }
        filterText = afterTrigger.substring(0, endIndex);
        remainingText = afterTrigger.substring(endIndex);
      }

      results.push({
        type: 'trigger',
        value: filterText,
        triggerChar: menu.trigger,
        id: generateTokenId('trigger'),
      });

      if (remainingText) {
        results.push({ type: 'text', value: remainingText });
      }

      position = text.length; // Move to end to exit while loop
      foundTrigger = true;
      break;
    }

    if (!foundTrigger) {
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

  if (isTextNode(container)) {
    const isAtBoundary = direction === 'left' ? offset === 0 : offset === (container.textContent?.length || 0);

    if (isAtBoundary) {
      sibling = direction === 'left' ? container.previousSibling : container.nextSibling;
    }
  } else if (isHTMLElement(container)) {
    if (direction === 'left') {
      sibling = offset > 0 ? container.childNodes[offset - 1] : container.previousSibling;
    } else {
      sibling = offset < container.childNodes.length ? container.childNodes[offset] : container.nextSibling;
    }
  }

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  const isReferenceToken = siblingType === ELEMENT_TYPES.REFERENCE || siblingType === ELEMENT_TYPES.PINNED;

  return { sibling, isReferenceToken };
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

  // Constants approach: cursor moves back by TOKEN_LENGTHS.LINE_BREAK
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
