// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { calculateTotalTokenLength, TOKEN_LENGTHS } from './caret-controller';
import { generateTokenId } from './dom-utils';
import { findLastPinnedTokenIndex } from './token-operations';
import { isBreakTextToken, isPinnedReferenceToken, isTextToken } from './type-guards';

export { findAdjacentToken } from './dom-utils';

/** Reorders tokens so all pinned tokens come first, preserving relative order. */
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

/** Merges consecutive text tokens into single tokens to avoid DOM fragmentation. */
export function mergeConsecutiveTextTokens(
  tokens: readonly PromptInputProps.InputToken[]
): PromptInputProps.InputToken[] {
  const result: PromptInputProps.InputToken[] = [];

  for (const token of tokens) {
    const lastToken = result[result.length - 1];

    if (lastToken && isTextToken(lastToken) && isTextToken(token)) {
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

/** Checks if a trigger is valid given the menu config, position, and preceding tokens. */
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

/**
 * Scans text for trigger characters and splits it into text and trigger tokens.
 * @param text the raw text to scan
 * @param menus menu definitions containing trigger characters
 * @param precedingTokens tokens before this text, used for useAtStart validation
 * @param onTriggerDetected optional callback that can cancel a trigger by returning true
 */
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
    let earliestCancelled = false;

    for (const menu of menus) {
      let searchPos = position;

      while (searchPos < text.length) {
        const triggerIndex = text.indexOf(menu.trigger, searchPos);
        if (triggerIndex === -1) {
          break;
        }

        const isValid = validateTrigger(menu, triggerIndex, text, precedingTokens);

        if (isValid) {
          let cancelled = false;

          if (onTriggerDetected) {
            const wasPrevented = onTriggerDetected({
              menuId: menu.id,
              triggerChar: menu.trigger,
              position: triggerIndex,
            });

            if (wasPrevented) {
              cancelled = true;
            }
          }

          if (earliestTriggerIndex === -1 || triggerIndex < earliestTriggerIndex) {
            earliestTriggerIndex = triggerIndex;
            earliestMenu = menu;
            earliestCancelled = cancelled;
          }
          break;
        }

        searchPos = triggerIndex + menu.trigger.length;
      }
    }

    if (earliestMenu && earliestTriggerIndex !== -1) {
      const beforeTrigger = text.substring(position, earliestTriggerIndex);
      if (beforeTrigger) {
        results.push({ type: 'text', value: beforeTrigger });
      }

      if (earliestCancelled) {
        // Emit as a trigger token with a '-cancelled' ID suffix so it stays in the DOM
        // as a trigger element (won't be re-scanned as text on subsequent inputs).
        // The suffixed ID won't match findTriggerTokenById, so no menu opens.
        results.push({
          type: 'trigger',
          value: '',
          triggerChar: earliestMenu.trigger,
          id: generateTokenId() + '-cancelled',
        });
        position = earliestTriggerIndex + earliestMenu.trigger.length;
      } else {
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
          id: generateTokenId(),
        });

        position = endOfTrigger;
      }
    } else {
      const remainingText = text.substring(position);
      if (remainingText) {
        results.push({ type: 'text', value: remainingText });
      }
      break;
    }
  }

  return results.length > 0 ? results : [{ type: 'text', value: text }];
}

/**
 * Calculates the correct caret position after pinned tokens have been reordered to the front.
 * Counts how many pinned tokens were originally after the caret and moved past it during reordering.
 * @param originalTokens tokens in their original (pre-reorder) order
 * @param newTokens tokens after reordering
 * @param caretPosition the logical caret position before reordering
 */
export function getCaretPositionAfterPinnedReorder(
  originalTokens: readonly PromptInputProps.InputToken[],
  newTokens: readonly PromptInputProps.InputToken[],
  caretPosition: number
): number {
  const totalPinnedCount = newTokens.filter(isPinnedReferenceToken).length;
  let pinnedBeforeCaret = 0;
  let pos = 0;

  for (const token of originalTokens) {
    if (pos >= caretPosition) {
      break;
    }
    if (isPinnedReferenceToken(token)) {
      pinnedBeforeCaret++;
    }
    if (isTextToken(token)) {
      pos += token.value.length;
    } else if (isBreakTextToken(token)) {
      pos += TOKEN_LENGTHS.LINE_BREAK;
    } else {
      pos += TOKEN_LENGTHS.REFERENCE;
    }
  }

  return caretPosition + (totalPinnedCount - pinnedBeforeCaret);
}

/**
 * Maps a caret position from an old token structure to the correct position after
 * structural changes like token removal (e.g., trigger deletion).
 * Finds where the token arrays first diverge and adjusts the caret accordingly.
 *
 * @param savedPosition the caret position captured from the old DOM (null if invalid)
 * @param prevTokens tokens from the previous render
 * @param newTokens tokens for the current render
 * @returns the adjusted position, or null when no adjustment is needed (use cc.restore())
 */
export function getCaretPositionAfterTokenRemoval(
  savedPosition: number | null,
  prevTokens: readonly PromptInputProps.InputToken[],
  newTokens: readonly PromptInputProps.InputToken[]
): number | null {
  if (savedPosition === null) {
    return null;
  }

  const totalLength = calculateTotalTokenLength(newTokens);
  const hasOnlyPinned = newTokens.length > 0 && newTokens.every(isPinnedReferenceToken);

  if (hasOnlyPinned || savedPosition > totalLength) {
    return totalLength;
  }

  const prevTotalLength = calculateTotalTokenLength(prevTokens);
  const lengthDelta = prevTotalLength - totalLength;

  if (lengthDelta === 0) {
    return null;
  }

  // Find where the token arrays first diverge
  let diffPosition = 0;
  const minLen = Math.min(prevTokens.length, newTokens.length);

  for (let i = 0; i < minLen; i++) {
    if (prevTokens[i].type !== newTokens[i].type) {
      break;
    }
    if (isTextToken(prevTokens[i])) {
      diffPosition += prevTokens[i].value.length;
    } else if (isBreakTextToken(prevTokens[i])) {
      diffPosition += TOKEN_LENGTHS.LINE_BREAK;
    } else {
      diffPosition += TOKEN_LENGTHS.REFERENCE;
    }
  }

  // When tokens were removed, place the caret at the divergence point.
  // This is where the deleted token was — the correct position regardless of what
  // cc.capture() returned (which is unreliable after browser-native deletions).
  if (lengthDelta > 0) {
    return Math.min(diffPosition, totalLength);
  }

  return null;
}
