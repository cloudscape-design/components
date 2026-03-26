// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { isHTMLElement } from '../../internal/utils/dom';
import type { PromptInputProps } from '../interfaces';
import { ElementType, SPECIAL_CHARS } from './constants';
import {
  findAllParagraphs,
  findElement,
  generateTokenId,
  getTokenType,
  hasOnlyTrailingBR,
  isCaretSpotType,
  isReferenceElementType,
  stripZeroWidthCharacters,
} from './dom-utils';
import { detectTriggersInText, mergeConsecutiveTextTokens } from './token-utils';
import {
  isBreakTextToken,
  isPinnedReferenceToken,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from './type-guards';

export type UpdateSource = 'user-input' | 'external' | 'menu-selection' | 'internal';

export interface ShortcutsConfig {
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
}

/**
 * Looks up an option's value from menu definitions by label. Used during DOM extraction
 * to recover reference token values — we store only the label in the DOM, not the value.
 */
function findOptionInMenu(
  options: readonly (OptionDefinition | OptionGroup)[],
  labelOrValue: string
): OptionDefinition | undefined {
  const key: keyof OptionGroup = 'options';
  for (const item of options) {
    if (key in item) {
      const found = item.options?.find(opt => opt.value === labelOrValue || opt.label === labelOrValue);
      if (found) {
        return found;
      }
    } else if (item.value === labelOrValue || item.label === labelOrValue) {
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
    if (hasOnlyTrailingBR(paragraphs[0])) {
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
    const text = stripZeroWidthCharacters(node.textContent || '');
    return text ? [{ type: 'text', value: text }] : [];
  }

  if (!isHTMLElement(node)) {
    return [];
  }

  if (node.tagName === 'BR') {
    return [];
  }

  const tokenType = getTokenType(node);

  if (tokenType === ElementType.Trigger) {
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
  menus: readonly PromptInputProps.MenuDefinition[] = []
): PromptInputProps.InputToken[] {
  const tokens: PromptInputProps.InputToken[] = [];
  const id = node.id || generateTokenId();
  const fullText = node.textContent || '';

  // Find the earliest trigger character in the text content
  let triggerCharIndex = -1;
  let triggerChar = '';

  for (const menu of menus) {
    const index = fullText.indexOf(menu.trigger);
    if (index >= 0 && (triggerCharIndex === -1 || index < triggerCharIndex)) {
      triggerCharIndex = index;
      triggerChar = menu.trigger;
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

    for (const menu of menus) {
      if (menu.useAtStart) {
        continue;
      }
      const index = value.indexOf(menu.trigger);
      if (index >= 0 && (nestedTriggerIndex === -1 || index < nestedTriggerIndex)) {
        nestedTriggerIndex = index;
        nestedTriggerChar = menu.trigger;
      }
    }

    if (nestedTriggerIndex === 0) {
      // Adjacent trigger characters — first trigger has empty filter, second is a new trigger
      tokens.push({ type: 'trigger', value: '', triggerChar, id });
      tokens.push({
        type: 'trigger',
        value: value.substring(1),
        triggerChar: nestedTriggerChar,
        id: generateTokenId(),
      });
    } else if (nestedTriggerIndex > 0 && value[nestedTriggerIndex - 1].trim() === '') {
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
    // No trigger character found — treat as text
  } else if (fullText) {
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
  const cursorSpotBefore = findElement(node, { tokenType: ElementType.CaretSpotBefore });
  if (cursorSpotBefore) {
    const beforeText = stripZeroWidthCharacters(cursorSpotBefore.textContent || '');
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
  label = stripZeroWidthCharacters(label).trim();

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
  if (tokenType === ElementType.Pinned) {
    token.pinned = true;
  }

  // Only add reference token if it has a label (skip empty/corrupted tokens)
  if (label) {
    tokens.push(token);
  }

  // Text from cursor-spot-after
  const cursorSpotAfter = findElement(node, { tokenType: ElementType.CaretSpotAfter });
  if (cursorSpotAfter) {
    const afterText = stripZeroWidthCharacters(cursorSpotAfter.textContent || '');
    if (afterText) {
      tokens.push({ type: 'text', value: afterText });
    }
  }

  return tokens;
}

/** Default plain text serialization for tokens. */
export function getPromptText(tokens: readonly PromptInputProps.InputToken[]): string {
  let result = '';
  let prevToken: PromptInputProps.InputToken | null = null;

  for (const token of tokens) {
    if (isBreakTextToken(token)) {
      result += '\n';
      prevToken = token;
      continue;
    }

    let segment: string;
    if (isTriggerToken(token)) {
      segment = token.triggerChar + token.value;
    } else if (isReferenceToken(token)) {
      segment = token.label || token.value;
    } else {
      segment = (token as PromptInputProps.TextToken).value;
    }

    if (segment.length === 0) {
      continue;
    }

    // Insert a space between a reference and its neighbor when neither side has whitespace
    const needsSpace =
      result.length > 0 &&
      !result.endsWith(' ') &&
      !result.endsWith('\n') &&
      !segment.startsWith(' ') &&
      (isReferenceToken(token) || (prevToken && isReferenceToken(prevToken)));

    if (needsSpace) {
      result += ' ';
    }

    result += segment;
    prevToken = token;
  }

  return result;
}

export function findLastPinnedTokenIndex(tokens: readonly PromptInputProps.InputToken[]): number {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (isPinnedReferenceToken(tokens[i])) {
      return i;
    }
  }
  return -1;
}

/** Scans text tokens for trigger characters and converts them to trigger tokens. */
export function detectTriggersInTokens(
  tokens: readonly PromptInputProps.InputToken[],
  menus: readonly PromptInputProps.MenuDefinition[],
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean
): PromptInputProps.InputToken[] {
  const result: PromptInputProps.InputToken[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip cancelled triggers — don't re-parse their adjacent text
    if (isTriggerToken(token) && token.id?.endsWith('-cancelled')) {
      result.push(token);
      continue;
    }

    // Collapse empty trigger + adjacent text back into a text token for re-parsing.
    // Don't fire onTriggerDetected — the trigger already exists.
    if (isTriggerToken(token) && token.value === '' && i !== tokens.length - 1) {
      const next = tokens[i + 1];
      if (isTextToken(next) && next.value.length > 0 && !next.value.startsWith(' ')) {
        const detected = detectTriggersInText(token.triggerChar + next.value, menus, result);
        const reusedTrigger = detected.find(isTriggerToken);
        if (reusedTrigger && token.id) {
          reusedTrigger.id = token.id;
        }
        result.push(...detected);
        i++;
        continue;
      }
    }

    // Merge non-empty trigger + adjacent text when the separator was removed.
    // Don't fire onTriggerDetected — the trigger already exists.
    if (isTriggerToken(token) && token.value.length > 0 && i !== tokens.length - 1) {
      const next = tokens[i + 1];
      if (isTextToken(next) && next.value.length > 0 && !next.value.startsWith(' ')) {
        const combined = token.triggerChar + token.value + next.value;
        const detected = detectTriggersInText(combined, menus, result);
        const reusedTrigger = detected.find(isTriggerToken);
        if (reusedTrigger && token.id) {
          reusedTrigger.id = token.id;
        }
        result.push(...detected);
        i++;
        continue;
      }
    }

    if (isTextToken(token)) {
      result.push(...detectTriggersInText(token.value, menus, result, onTriggerDetected));
    } else {
      result.push(token);
    }
  }

  return result;
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

  // Ensure all tokens have IDs for DOM element tracking
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
