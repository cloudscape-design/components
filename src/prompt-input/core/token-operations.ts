// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import type { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { TOKEN_LENGTHS } from './cursor-controller';
import { findAllParagraphs, findElement, generateTokenId, getTokenType } from './dom-utils';
import { detectTriggersInText } from './token-utils';
import {
  isBreakToken,
  isBRElement,
  isHTMLElement,
  isPinnedReferenceToken,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from './type-guards';

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

// DOM EXTRACTION HELPERS

function findOptionInMenu(
  options: readonly (OptionDefinition | OptionGroup)[],
  labelOrValue: string
): OptionDefinition | undefined {
  const key: keyof OptionGroup = 'options';
  for (const item of options) {
    if (key in item) {
      // It's a group, search in its options
      const found = item.options?.find(opt => opt.value === labelOrValue || opt.label === labelOrValue);
      if (found) {
        return found;
      }
    } else if (item.value === labelOrValue || item.label === labelOrValue) {
      // It's an option
      return item;
    }
  }
  return undefined;
}

export function extractTokensFromDOM(
  element: HTMLElement,
  menus?: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const paragraphs = findAllParagraphs(element);

  if (paragraphs.length === 0) {
    return [];
  }

  // Special case: single empty paragraph = empty input
  if (paragraphs.length === 1) {
    const p = paragraphs[0];
    const hasOnlyTrailingBr = p.childNodes.length === 1 && isBRElement(p.firstChild, ELEMENT_TYPES.TRAILING_BREAK);

    if (hasOnlyTrailingBr) {
      return [];
    }
  }

  const allTokens: PromptInputProps.InputToken[] = [];

  paragraphs.forEach((p, pIndex) => {
    const paragraphTokens = extractTokensFromParagraph(p, menus);

    if (pIndex > 0) {
      allTokens.push({ type: 'break', value: SPECIAL_CHARS.NEWLINE });
    }

    allTokens.push(...paragraphTokens);
  });

  return allTokens;
}

function extractTokensFromParagraph(
  p: HTMLElement,
  menus?: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const tokens: PromptInputProps.InputToken[] = [];
  let textBuffer = '';

  const flushText = () => {
    if (textBuffer) {
      tokens.push({ type: 'text', value: textBuffer });
      textBuffer = '';
    }
  };

  const processNode = (node: Node) => {
    if (isTextNode(node)) {
      const text = (node.textContent || '').replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');
      if (text) {
        textBuffer += text;
      }
    } else if (isHTMLElement(node)) {
      if (node.tagName === 'BR') {
        return;
      }

      const tokenType = getTokenType(node);

      if (tokenType === ELEMENT_TYPES.TRIGGER) {
        flushText();
        const id = node.id || generateTokenId('trigger');
        const fullText = node.textContent || '';

        // Check if there's text before the trigger character (corruption case)
        let triggerCharIndex = -1;
        let triggerChar = '';

        if (menus) {
          for (const menu of menus) {
            const index = fullText.indexOf(menu.trigger);
            if (index >= 0 && (triggerCharIndex === -1 || index < triggerCharIndex)) {
              triggerCharIndex = index;
              triggerChar = menu.trigger;
            }
          }
        }

        if (triggerCharIndex > 0) {
          // Text before trigger - extract it as separate text token
          const textBefore = fullText.substring(0, triggerCharIndex);
          tokens.push({ type: 'text', value: textBefore });
        }

        if (triggerCharIndex >= 0) {
          // Extract trigger
          const value = fullText.substring(triggerCharIndex + 1);

          // Check if the value contains ANY trigger character (nested trigger)
          // Find the earliest trigger character in the value
          let nestedTriggerIndex = -1;
          let nestedTriggerChar = '';

          if (menus) {
            for (const menu of menus) {
              const index = value.indexOf(menu.trigger);
              if (index > 0 && (nestedTriggerIndex === -1 || index < nestedTriggerIndex)) {
                nestedTriggerIndex = index;
                nestedTriggerChar = menu.trigger;
              }
            }
          }

          if (nestedTriggerIndex > 0) {
            // Split: first trigger + space + second trigger
            const firstValue = value.substring(0, nestedTriggerIndex).trim();
            const afterFirst = value.substring(nestedTriggerIndex);

            // First trigger
            tokens.push({
              type: 'trigger',
              value: firstValue,
              triggerChar,
              id,
            });

            // Space before second trigger
            const spaceBefore = value.substring(firstValue.length, nestedTriggerIndex);
            if (spaceBefore) {
              tokens.push({ type: 'text', value: spaceBefore });
            }

            // Second trigger (without the trigger char)
            const secondValue = afterFirst.substring(1);
            tokens.push({
              type: 'trigger',
              value: secondValue,
              triggerChar: nestedTriggerChar,
              id: generateTokenId('trigger'),
            });
          } else {
            // Normal trigger, no nesting
            tokens.push({
              type: 'trigger',
              value,
              triggerChar,
              id,
            });
          }
        } else {
          // No trigger character found - treat entire content as text
          if (fullText) {
            tokens.push({ type: 'text', value: fullText });
          }
        }
      } else if (tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED) {
        flushText();

        const cursorSpotBefore = findElement(node, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_BEFORE });
        if (cursorSpotBefore) {
          const beforeText = (cursorSpotBefore.textContent || '').replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');
          if (beforeText) {
            tokens.push({ type: 'text', value: beforeText });
          }
        }

        // Extract label from token's text content (excluding cursor spots)
        let label = '';
        for (const child of Array.from(node.childNodes)) {
          if (isTextNode(child)) {
            label += child.textContent || '';
          } else if (isHTMLElement(child)) {
            const childType = getTokenType(child);
            if (childType !== ELEMENT_TYPES.CURSOR_SPOT_BEFORE && childType !== ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
              label += child.textContent || '';
            }
          }
        }
        label = label.replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '').trim();

        const instanceId = node.id || '';
        const menuId = node.getAttribute('data-menu-id') || '';

        // Look up option from menu definition using the label
        let value = '';
        if (menuId && menus && label) {
          const menu = menus.find(m => m.id === menuId);
          if (menu) {
            const option = findOptionInMenu(menu.options, label);
            if (option) {
              value = option.value || '';
              label = option.label || option.value || label;
            }
          }
        }

        const token: PromptInputProps.ReferenceToken = {
          type: 'reference',
          id: instanceId,
          value,
          label,
          menuId,
        };
        if (tokenType === ELEMENT_TYPES.PINNED) {
          token.pinned = true;
        }

        // Only add reference token if it has a label (skip empty/corrupted tokens)
        if (label) {
          tokens.push(token);
        }

        const cursorSpotAfter = findElement(node, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_AFTER });
        if (cursorSpotAfter) {
          const afterText = (cursorSpotAfter.textContent || '').replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');
          if (afterText) {
            tokens.push({ type: 'text', value: afterText });
          }
        }
      } else {
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  };

  Array.from(p.childNodes).forEach(processNode);
  flushText();

  return tokens;
}

export function getPromptText(tokens: readonly PromptInputProps.InputToken[]): string {
  return tokens
    .map(token => {
      if (isTriggerToken(token)) {
        return token.triggerChar + token.value;
      }
      return token.value;
    })
    .join('');
}

export function findLastPinnedTokenIndex(tokens: readonly PromptInputProps.InputToken[]): number {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (isPinnedReferenceToken(tokens[i])) {
      return i;
    }
  }
  return -1;
}

export function detectTriggersInTokens(
  tokens: readonly PromptInputProps.InputToken[],
  menus: readonly PromptInputProps.MenuDefinition[],
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean
): PromptInputProps.InputToken[] {
  const result: PromptInputProps.InputToken[] = [];

  for (const token of tokens) {
    if (isTextToken(token)) {
      const detectedTokens = detectTriggersInText(token.value, menus, result, onTriggerDetected);
      result.push(...detectedTokens);
    } else {
      result.push(token);
    }
  }

  return result;
}

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

    // Calculate cursor position: sum of all tokens before insert + the inserted token
    let cursorPos = 0;
    for (let i = 0; i <= insertIndex; i++) {
      const token = newTokens[i];
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

    // Calculate cursor position after inserted reference using TOKEN_LENGTHS
    let cursorPos = 0;
    for (const token of newTokens) {
      if (isTextToken(token)) {
        cursorPos += TOKEN_LENGTHS.text(token.value);
      } else if (isBreakToken(token)) {
        cursorPos += TOKEN_LENGTHS.LINE_BREAK;
      } else if (isTriggerToken(token)) {
        cursorPos += TOKEN_LENGTHS.trigger(token.value);
      } else {
        cursorPos += TOKEN_LENGTHS.REFERENCE;
      }

      // Stop after the inserted reference token
      if (isReferenceToken(token) && token.id === referenceToken.id) {
        break;
      }
    }

    return { tokens: newTokens, cursorPosition: cursorPos, insertedToken: referenceToken };
  }
}

export function processTokens(
  tokens: readonly PromptInputProps.InputToken[],
  config: ShortcutsConfig,
  options: {
    source: UpdateSource;
    detectTriggers?: boolean;
  },
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean
): PromptInputProps.InputToken[] {
  let result = [...tokens];

  if (options.detectTriggers && config.menus) {
    result = detectTriggersInTokens(result, config.menus, onTriggerDetected);
  }

  // Ensure all tokens have IDs
  result = result.map(token => {
    if (isTriggerToken(token) && (!token.id || token.id === '')) {
      return { ...token, id: generateTokenId('trigger') };
    }
    if (isReferenceToken(token) && (!token.id || token.id === '')) {
      return { ...token, id: generateTokenId('ref') };
    }
    return token;
  });

  return result;
}
