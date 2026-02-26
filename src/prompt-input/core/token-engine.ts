// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { PromptInputProps } from '../interfaces';
import { getCursorPositionAtIndex, getTokenCursorLength } from './cursor-manager';
import { isPinnedReferenceToken, isReferenceToken, isTextToken, isTriggerToken } from './type-guards';
import { generateTokenId } from './utils';

// TYPES

export type UpdateSource = 'user-input' | 'external' | 'menu-selection' | 'internal';

export interface TokenUpdate {
  tokens: PromptInputProps.InputToken[];
  source: UpdateSource;
  cursorPosition?: number;
}

export interface ShortcutsConfig {
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
}

export interface MenuSelectionResult {
  tokens: PromptInputProps.InputToken[];
  cursorPosition: number;
  insertedToken: PromptInputProps.ReferenceToken;
}

// HELPER FUNCTIONS

function areAllTokensPinned(tokens: readonly PromptInputProps.InputToken[]): boolean {
  return tokens.every(isPinnedReferenceToken);
}

function isTriggerValid(
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

// TRIGGER DETECTION

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

      if (!isTriggerValid(menu, triggerIndex, text, precedingTokens)) {
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

      position = text.length;
      foundTrigger = true;
      break;
    }

    if (!foundTrigger) {
      const remaining = text.substring(position);
      if (remaining) {
        results.push({ type: 'text', value: remaining });
      }
      break;
    }
  }

  return results.length > 0 ? results : [{ type: 'text', value: text }];
}

export function detectTriggersInTokens(
  tokens: readonly PromptInputProps.InputToken[],
  menus: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const result: PromptInputProps.InputToken[] = [];

  for (const token of tokens) {
    if (isTextToken(token)) {
      const detectedTokens = detectTriggersInText(token.value, menus, result);
      result.push(...detectedTokens);
    } else {
      result.push(token);
    }
  }

  return result;
}

// MENU SELECTION

export function handleMenuSelection(
  tokens: readonly PromptInputProps.InputToken[],
  selectedOption: {
    value: string;
    label?: string;
  },
  menuId: string,
  isPinned: boolean,
  activeTrigger: PromptInputProps.TriggerToken
): MenuSelectionResult {
  const newTokens = [...tokens];

  const triggerIndex = newTokens.findIndex(t => isTriggerToken(t) && t.id === activeTrigger.id);

  if (isPinned) {
    const pinnedToken: PromptInputProps.ReferenceToken = {
      type: 'reference',
      id: generateTokenId('ref'),
      label: selectedOption.label || selectedOption.value || '',
      value: selectedOption.value || '',
      menuId,
      pinned: true,
    };

    newTokens.splice(triggerIndex, 1);

    let insertIndex = 0;
    while (insertIndex < newTokens.length && isPinnedReferenceToken(newTokens[insertIndex])) {
      insertIndex++;
    }

    newTokens.splice(insertIndex, 0, pinnedToken);

    const cursorPos = getCursorPositionAtIndex(newTokens, insertIndex);
    return { tokens: newTokens, cursorPosition: cursorPos, insertedToken: pinnedToken };
  } else {
    const referenceToken: PromptInputProps.ReferenceToken = {
      type: 'reference',
      id: generateTokenId('ref'),
      label: selectedOption.label || selectedOption.value || '',
      value: selectedOption.value || '',
      menuId,
    };

    newTokens.splice(triggerIndex, 1, referenceToken);

    let cursorPos = 0;
    for (const token of newTokens) {
      cursorPos += getTokenCursorLength(token);

      if (isReferenceToken(token) && token.id === selectedOption.value) {
        break;
      }
    }

    return { tokens: newTokens, cursorPosition: cursorPos, insertedToken: referenceToken };
  }
}

// TOKEN PROCESSING

export function processTokens(
  tokens: readonly PromptInputProps.InputToken[],
  config: ShortcutsConfig,
  options: {
    source: UpdateSource;
    detectTriggers?: boolean;
  }
): PromptInputProps.InputToken[] {
  let result = [...tokens];

  if (options.detectTriggers && config.menus) {
    result = detectTriggersInTokens(result, config.menus);
  }

  return result;
}
