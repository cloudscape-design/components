// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';
import { calculateTotalTokenLength, TOKEN_LENGTHS } from './caret-controller';
import { generateTokenId } from './dom-utils';
import { findLastPinnedTokenIndex } from './token-operations';
import { isBreakTextToken, isPinnedReferenceToken, isReferenceToken, isTextToken, isTriggerToken } from './type-guards';

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
  const restTokens: PromptInputProps.InputToken[] = [];

  for (const token of tokens) {
    if (isPinnedReferenceToken(token)) {
      pinnedTokens.push(token);
    } else {
      restTokens.push(token);
    }
  }

  return [...pinnedTokens, ...restTokens];
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

/** Checks if a trigger is valid given the menu config, position, and preceding tokens. */
export function validateTrigger(
  menu: PromptInputProps.MenuDefinition,
  triggerIndex: number,
  text: string,
  precedingTokens: readonly PromptInputProps.InputToken[]
): boolean {
  const isAtStart = triggerIndex === 0;
  const charBefore = triggerIndex > 0 ? text[triggerIndex - 1] : '';
  const isAfterWhitespace = charBefore.trim() === '';

  if (menu.useAtStart) {
    return isAtStart && areAllTokensPinned(precedingTokens);
  }

  return isAtStart || isAfterWhitespace;
}

interface TriggerMatch {
  index: number;
  menu: PromptInputProps.MenuDefinition;
  cancelled: boolean;
}

/** Finds the earliest valid trigger character in text starting from the given position. */
function findEarliestTrigger(
  text: string,
  position: number,
  menus: readonly PromptInputProps.MenuDefinition[],
  precedingTokens: readonly PromptInputProps.InputToken[],
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean
): TriggerMatch | null {
  let best: TriggerMatch | null = null;

  for (const menu of menus) {
    let searchPos = position;
    while (searchPos < text.length) {
      const idx = text.indexOf(menu.trigger, searchPos);
      if (idx === -1) {
        break;
      }
      if (!validateTrigger(menu, idx, text, precedingTokens)) {
        searchPos = idx + menu.trigger.length;
        continue;
      }
      const cancelled = onTriggerDetected?.({ menuId: menu.id, triggerChar: menu.trigger, position: idx }) ?? false;
      if (!best || idx < best.index) {
        best = { index: idx, menu, cancelled };
      }
      break;
    }
  }

  return best;
}

/** Extracts filter text after a trigger character, stopping at whitespace or another trigger char. */
function extractFilterText(text: string, menus: readonly PromptInputProps.MenuDefinition[]): string {
  let end = 0;
  while (end < text.length && text[end].trim() !== '') {
    if (menus.some(m => text[end] === m.trigger)) {
      break;
    }
    end++;
  }
  return text.substring(0, end);
}

/** Scans text for trigger characters and splits it into text and trigger tokens. */
export function detectTriggersInText(
  text: string,
  menus: readonly PromptInputProps.MenuDefinition[],
  precedingTokens: readonly PromptInputProps.InputToken[],
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean,
  cancelledIds?: Set<string>
): PromptInputProps.InputToken[] {
  const results: PromptInputProps.InputToken[] = [];
  let position = 0;

  while (position < text.length) {
    const match = findEarliestTrigger(text, position, menus, precedingTokens, onTriggerDetected);

    if (!match) {
      results.push({ type: 'text', value: text.substring(position) });
      break;
    }

    const beforeTrigger = text.substring(position, match.index);
    if (beforeTrigger) {
      results.push({ type: 'text', value: beforeTrigger });
    }

    if (match.cancelled) {
      const cancelledId = generateTokenId();
      cancelledIds?.add(cancelledId);
      results.push({
        type: 'trigger',
        value: '',
        triggerChar: match.menu.trigger,
        id: cancelledId,
      });
      position = match.index + match.menu.trigger.length;
    } else {
      const afterTrigger = text.substring(match.index + match.menu.trigger.length);
      const filterText = afterTrigger && !afterTrigger.startsWith(' ') ? extractFilterText(afterTrigger, menus) : '';

      results.push({
        type: 'trigger',
        value: filterText,
        triggerChar: match.menu.trigger,
        id: generateTokenId(),
      });
      position = match.index + match.menu.trigger.length + filterText.length;
    }
  }

  return results.length > 0 ? results : [{ type: 'text', value: text }];
}

/** Calculates the correct caret position after pinned tokens have been reordered to the front. */
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

/** Maps a caret position from an old token structure to the correct position after structural changes. */
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
    if (
      isReferenceToken(prevTokens[i]) &&
      isReferenceToken(newTokens[i]) &&
      (prevTokens[i] as PromptInputProps.ReferenceToken).id !== (newTokens[i] as PromptInputProps.ReferenceToken).id
    ) {
      break;
    }
    if (
      isTriggerToken(prevTokens[i]) &&
      isTriggerToken(newTokens[i]) &&
      (prevTokens[i] as PromptInputProps.TriggerToken).id !== (newTokens[i] as PromptInputProps.TriggerToken).id
    ) {
      break;
    }
    // Trigger value changed — let cc.restore() handle it
    if (
      isTriggerToken(prevTokens[i]) &&
      isTriggerToken(newTokens[i]) &&
      (prevTokens[i] as PromptInputProps.TriggerToken).id === (newTokens[i] as PromptInputProps.TriggerToken).id &&
      (prevTokens[i] as PromptInputProps.TriggerToken).value !== (newTokens[i] as PromptInputProps.TriggerToken).value
    ) {
      return null;
    }
    if (isTextToken(prevTokens[i])) {
      diffPosition += prevTokens[i].value.length;
    } else if (isBreakTextToken(prevTokens[i])) {
      diffPosition += TOKEN_LENGTHS.LINE_BREAK;
    } else if (isTriggerToken(prevTokens[i])) {
      diffPosition += TOKEN_LENGTHS.trigger(prevTokens[i].value);
    } else {
      diffPosition += TOKEN_LENGTHS.REFERENCE;
    }
  }

  // Tokens were removed — use the saved position if it's plausible
  // (within the old token range, meaning capture() read a valid DOM state),
  // otherwise fall back to the divergence point.
  if (lengthDelta > 0) {
    if (savedPosition <= prevTotalLength && savedPosition <= totalLength) {
      return savedPosition;
    }
    return Math.min(diffPosition, totalLength);
  }

  return null;
}

/**
 * Removes a logical range [start, end) from the token array.
 * Tokens fully within the range are removed. Text tokens partially within
 * the range are trimmed. Reference and trigger tokens are removed if any
 * part of them falls within the range (they're atomic).
 */
export function removeTokenRange(
  tokens: readonly PromptInputProps.InputToken[],
  start: number,
  end: number
): PromptInputProps.InputToken[] {
  if (start >= end) {
    return [...tokens];
  }

  const result: PromptInputProps.InputToken[] = [];
  let pos = 0;

  for (const token of tokens) {
    let tokenLength: number;
    if (isTextToken(token)) {
      tokenLength = token.value.length;
    } else if (isBreakTextToken(token)) {
      tokenLength = TOKEN_LENGTHS.LINE_BREAK;
    } else if (isTriggerToken(token)) {
      tokenLength = TOKEN_LENGTHS.trigger(token.value);
    } else {
      tokenLength = TOKEN_LENGTHS.REFERENCE;
    }

    const tokenStart = pos;
    const tokenEnd = pos + tokenLength;
    pos = tokenEnd;

    // Fully outside the range — keep as-is
    if (tokenEnd <= start || tokenStart >= end) {
      result.push(token);
      continue;
    }

    // Text token — trim the overlapping portion
    if (isTextToken(token)) {
      const keepBefore = token.value.substring(0, Math.max(0, start - tokenStart));
      const keepAfter = token.value.substring(Math.min(token.value.length, end - tokenStart));
      const remaining = keepBefore + keepAfter;
      if (remaining.length > 0) {
        result.push({ type: 'text', value: remaining });
      }
      continue;
    }

    // Atomic tokens (reference, trigger, break) — remove entirely if any overlap
  }

  return result;
}
