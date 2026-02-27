// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isPinnedReferenceToken, isTextToken, isTriggerToken } from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

function textToTokens(text: string, menus: readonly PromptInputProps.MenuDefinition[]): PromptInputProps.InputToken[] {
  return text.split('\n').flatMap((line, i) => {
    const tokens: PromptInputProps.InputToken[] = [];
    if (i > 0) {
      tokens.push({ type: 'break', value: '\n' });
    }
    if (!line) {
      return tokens;
    }

    const firstChar = line.charAt(0);
    const matchingMenu = menus.find(m => m.trigger === firstChar);

    tokens.push(
      matchingMenu
        ? { type: 'trigger', triggerChar: firstChar, value: line.substring(1), id: undefined }
        : { type: 'text', value: line }
    );
    return tokens;
  });
}

function getTokenLength(token: PromptInputProps.InputToken): number {
  if (isTextToken(token)) {
    return token.value.length;
  }
  if (isTriggerToken(token)) {
    return 1 + token.value.length;
  }
  return 1; // Reference/pinned are atomic
}

function insertTextIntoTokens(
  tokens: readonly PromptInputProps.InputToken[],
  text: string,
  position: number,
  menus: readonly PromptInputProps.MenuDefinition[]
): PromptInputProps.InputToken[] {
  const textTokens = textToTokens(text, menus);
  const result: PromptInputProps.InputToken[] = [];
  let currentPosition = 0;
  let inserted = false;

  for (const token of tokens) {
    const tokenLength = getTokenLength(token);

    if (!inserted && position >= currentPosition && position < currentPosition + tokenLength) {
      if (isTextToken(token)) {
        const offset = position - currentPosition;
        if (offset > 0) {
          result.push({ type: 'text', value: token.value.substring(0, offset) });
        }
        result.push(...textTokens);
        if (offset < token.value.length) {
          result.push({ type: 'text', value: token.value.substring(offset) });
        }
      } else if (isTriggerToken(token)) {
        const offset = position - currentPosition;
        if (offset === 0) {
          result.push(...textTokens, token);
        } else {
          const valueOffset = offset - 1;
          result.push({
            ...token,
            value: token.value.substring(0, valueOffset) + text + token.value.substring(valueOffset),
          });
        }
      }
      inserted = true;
    } else if (!inserted && position === currentPosition) {
      result.push(...textTokens, token);
      inserted = true;
    } else {
      result.push(token);
    }

    currentPosition += tokenLength;
  }

  if (!inserted) {
    result.push(...textTokens);
  }

  // Merge adjacent text tokens
  return result.reduce<PromptInputProps.InputToken[]>((merged, token) => {
    const last = merged[merged.length - 1];
    if (isTextToken(token) && last && isTextToken(last)) {
      last.value += token.value;
    } else {
      merged.push(token);
    }
    return merged;
  }, []);
}

export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  cursorStart: number | undefined,
  cursorEnd: number | undefined,
  tokens: readonly PromptInputProps.InputToken[],
  menus: readonly PromptInputProps.MenuDefinition[],
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void,
  tokensToText: (tokens: readonly PromptInputProps.InputToken[]) => string,
  lastKnownCursorPosition: number,
  lastKnownCursorPositionRef: React.MutableRefObject<number>
): void {
  element.focus();

  // Calculate pinned token offset
  const positionAfterPinned = tokens.filter(isPinnedReferenceToken).length;

  // Determine insertion position
  const insertPosition =
    cursorStart !== undefined
      ? cursorStart === 0
        ? positionAfterPinned
        : cursorStart
      : Math.max(lastKnownCursorPosition, positionAfterPinned);

  // Insert text and calculate final cursor position
  const textTokens = textToTokens(text, menus);
  const insertedLength = textTokens.reduce((sum, token) => sum + getTokenLength(token), 0);
  const newTokens = insertTextIntoTokens(tokens, text, insertPosition, menus);
  const finalPosition =
    cursorEnd !== undefined ? (cursorEnd === 0 ? positionAfterPinned : cursorEnd) : insertPosition + insertedLength;

  // Update cursor position ref for unified restoration
  if (lastKnownCursorPositionRef) {
    lastKnownCursorPositionRef.current = finalPosition;
  }

  // Trigger state update and re-render
  onChange({ value: tokensToText(newTokens), tokens: newTokens });
}
