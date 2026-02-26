// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { isBRElement, isHTMLElement, isPinnedReferenceToken, isTextNode } from './type-guards';
import { findAllParagraphs, findElement, generateTokenId, getTokenType } from './utils';

// HELPER FUNCTIONS

function findOptionInMenu(
  options: readonly (OptionDefinition | OptionGroup)[],
  labelOrValue: string
): OptionDefinition | undefined {
  for (const item of options) {
    if ('options' in item) {
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
        const id = node.getAttribute('data-id') || generateTokenId('trigger');
        const fullText = node.textContent || '';
        const triggerChar = fullText.charAt(0);
        const value = fullText.substring(1);

        const token: PromptInputProps.TriggerToken = {
          type: 'trigger',
          value,
          triggerChar,
          id,
        };
        tokens.push(token);
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

        const instanceId = node.getAttribute('data-id') || '';
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
        tokens.push(token);

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
  return tokens.map(token => token.value).join('');
}

export function findLastPinnedTokenIndex(tokens: readonly PromptInputProps.InputToken[]): number {
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (isPinnedReferenceToken(tokens[i])) {
      return i;
    }
  }
  return -1;
}

export function moveForbiddenTextAfterPinnedTokens(
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
