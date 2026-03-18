// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { isHTMLElement } from '../../internal/utils/dom';
import type { PromptInputProps } from '../interfaces';
import { calculateTokenPosition } from './caret-controller';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import {
  findAllParagraphs,
  findElement,
  generateTokenId,
  getTokenType,
  isCaretSpotType,
  isReferenceElementType,
  stripZWNJ,
} from './dom-utils';
import { detectTriggersInText, mergeConsecutiveTextTokens } from './token-utils';
import {
  isBRElement,
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
  caretPosition?: number;
}

export interface ShortcutsConfig {
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
}

export interface MenuSelectionResult {
  tokens: PromptInputProps.InputToken[];
  caretPosition: number;
  insertedToken: PromptInputProps.ReferenceToken;
}

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

/** Extracts tokens from a single paragraph element by processing each child node. */
function extractTokensFromParagraph(
  p: HTMLElement,
  menus?: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const tokens = Array.from(p.childNodes).flatMap(node => extractTokensFromNode(node, menus));
  return mergeConsecutiveTextTokens(tokens);
}

/** Converts a single DOM node into zero or more tokens. */
function extractTokensFromNode(
  node: Node,
  menus?: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  if (isTextNode(node)) {
    const text = stripZWNJ(node.textContent || '');
    return text ? [{ type: 'text', value: text }] : [];
  }

  if (!isHTMLElement(node)) {
    return [];
  }

  if (node.tagName === 'BR') {
    return [];
  }

  const tokenType = getTokenType(node);

  if (tokenType === ELEMENT_TYPES.TRIGGER) {
    return extractTriggerTokens(node, menus);
  }

  if (isReferenceElementType(tokenType)) {
    return extractReferenceToken(node, tokenType, menus);
  }

  // Unknown element — recurse into children
  return Array.from(node.childNodes).flatMap(child => extractTokensFromNode(child, menus));
}

/** Extracts trigger tokens from a trigger DOM element, handling nested triggers. */
function extractTriggerTokens(
  node: HTMLElement,
  menus?: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const tokens: PromptInputProps.InputToken[] = [];
  const id = node.id || generateTokenId();
  const fullText = node.textContent || '';

  // Find the earliest trigger character in the text content
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

  // Text before trigger character (corruption case)
  if (triggerCharIndex > 0) {
    tokens.push({ type: 'text', value: fullText.substring(0, triggerCharIndex) });
  }

  if (triggerCharIndex >= 0) {
    const value = fullText.substring(triggerCharIndex + 1);

    // Check for a nested trigger character in the filter text
    let nestedTriggerIndex = -1;
    let nestedTriggerChar = '';

    if (menus) {
      for (const menu of menus) {
        if (menu.useAtStart) {
          continue;
        }
        const index = value.indexOf(menu.trigger);
        if (index > 0 && (nestedTriggerIndex === -1 || index < nestedTriggerIndex)) {
          nestedTriggerIndex = index;
          nestedTriggerChar = menu.trigger;
        }
      }
    }

    if (nestedTriggerIndex > 0 && /\s/.test(value[nestedTriggerIndex - 1])) {
      // Split into first trigger, whitespace, and second trigger
      const firstValue = value.substring(0, nestedTriggerIndex).trim();
      const spaceBefore = value.substring(firstValue.length, nestedTriggerIndex);
      const secondValue = value.substring(nestedTriggerIndex + 1);

      tokens.push({ type: 'trigger', value: firstValue, triggerChar, id });
      if (spaceBefore) {
        tokens.push({ type: 'text', value: spaceBefore });
      }
      tokens.push({ type: 'trigger', value: secondValue, triggerChar: nestedTriggerChar, id: generateTokenId() });
    } else {
      tokens.push({ type: 'trigger', value, triggerChar, id });
    }
  } else if (fullText) {
    // No trigger character found — treat entire content as text
    tokens.push({ type: 'text', value: fullText });
  }

  return tokens;
}

/** Extracts reference and surrounding text tokens from a reference DOM element. */
function extractReferenceToken(
  node: HTMLElement,
  tokenType: string | null,
  menus?: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const tokens: PromptInputProps.InputToken[] = [];

  // Text from cursor-spot-before
  const cursorSpotBefore = findElement(node, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_BEFORE });
  if (cursorSpotBefore) {
    const beforeText = stripZWNJ(cursorSpotBefore.textContent || '');
    if (beforeText) {
      tokens.push({ type: 'text', value: beforeText });
    }
  }

  // Extract label from non-cursor-spot children
  let label = '';
  for (const child of Array.from(node.childNodes)) {
    if (isTextNode(child)) {
      label += child.textContent || '';
    } else if (isHTMLElement(child)) {
      const childType = getTokenType(child);
      if (!isCaretSpotType(childType)) {
        label += child.textContent || '';
      }
    }
  }
  label = stripZWNJ(label).trim();

  const instanceId = node.id || '';
  const menuId = node.getAttribute('data-menu-id') || '';

  // Look up option value from menu definition
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

  // Text from cursor-spot-after
  const cursorSpotAfter = findElement(node, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_AFTER });
  if (cursorSpotAfter) {
    const afterText = stripZWNJ(cursorSpotAfter.textContent || '');
    if (afterText) {
      tokens.push({ type: 'text', value: afterText });
    }
  }

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

/**
 * Scans text tokens for trigger characters and converts them to trigger tokens.
 * Trigger detection happens during token processing (not at input time) because
 * the contentEditable input event gives us raw DOM content that needs to be
 * parsed into the token model. The onTriggerDetected callback allows consumers
 * to cancel specific triggers (e.g. limiting the number of pinned tokens).
 */
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
      id: generateTokenId(),
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

    const caretPos = calculateTokenPosition(newTokens, insertIndex);

    return { tokens: newTokens, caretPosition: caretPos, insertedToken: pinnedToken };
  } else {
    const referenceToken: PromptInputProps.ReferenceToken = {
      type: 'reference',
      id: generateTokenId(),
      label: selectedOption.label || selectedOption.value || '',
      value: selectedOption.value || '',
      menuId,
    };

    newTokens.splice(triggerIndex, 1, referenceToken);

    const insertedIndex = newTokens.findIndex(t => isReferenceToken(t) && t.id === referenceToken.id);
    const caretPos = calculateTokenPosition(newTokens, insertedIndex);

    return { tokens: newTokens, caretPosition: caretPos, insertedToken: referenceToken };
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

  // Ensure all tokens have IDs — these are used as DOM element IDs for:
  // - Trigger tokens: anchoring the dropdown menu position
  // - Reference tokens: tracking which DOM element corresponds to which token during re-renders
  result = result.map(token => {
    if (isTriggerToken(token) && (!token.id || token.id === '')) {
      return { ...token, id: generateTokenId() };
    }
    if (isReferenceToken(token) && (!token.id || token.id === '')) {
      return { ...token, id: generateTokenId() };
    }
    return token;
  });

  return result;
}
