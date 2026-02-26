// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { isBreakToken, isHTMLElement, isTextNode, isTextToken, isTriggerToken } from './type-guards';
import { findAllParagraphs, getTokenType } from './utils';

// HELPER FUNCTIONS

function isReferenceTokenType(tokenType: string | null): boolean {
  return tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED;
}

/**
 * Gets the length of a token element in the DOM.
 * - Text nodes: their text length
 * - Trigger tokens: full text length (including trigger char, e.g., "@bob" = 4)
 * - Reference/pinned tokens: 1 (atomic)
 */
function getTokenElementLength(child: Node): number {
  if (isTextNode(child)) {
    return child.textContent?.length || 0;
  }

  if (isHTMLElement(child)) {
    const tokenType = getTokenType(child);
    if (tokenType === ELEMENT_TYPES.TRIGGER) {
      return child.textContent?.length || 0;
    }
    if (isReferenceTokenType(tokenType)) {
      return 1;
    }
  }

  return 0;
}

// BASIC CURSOR POSITIONING

/**
 * Generic function to position cursor using a range configuration callback.
 */
function positionCursor(configureRange: (range: Range) => void): void {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  configureRange(range);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function positionBefore(node: Node): void {
  positionCursor(range => range.setStartBefore(node));
}

export function positionAfter(node: Node): void {
  positionCursor(range => range.setStartAfter(node));
}

export function positionAtStartOfParagraph(paragraph: HTMLElement): void {
  positionCursor(range => range.setStart(paragraph, 0));
}

function positionCursorAtOffset(node: Node, offset: number): void {
  positionCursor(range => range.setStart(node, offset));
}

// POSITION CALCULATION

function countParagraphContent(p: Element): number {
  let count = 0;
  for (const child of Array.from(p.childNodes)) {
    count += getTokenElementLength(child);
  }
  return count;
}

function countUpToCursor(p: Element, range: Range): number {
  let count = 0;

  // Special case: cursor is at paragraph level (between child nodes)
  if (range.startContainer === p) {
    for (let i = 0; i < range.startOffset && i < p.childNodes.length; i++) {
      count += getTokenElementLength(p.childNodes[i]);
    }
    return count;
  }

  for (const child of Array.from(p.childNodes)) {
    const childContainsCursor = child === range.startContainer || child.contains(range.startContainer);

    if (childContainsCursor) {
      if (isTextNode(child)) {
        count += range.startOffset;
      } else if (isHTMLElement(child)) {
        const tokenType = getTokenType(child);

        if (tokenType === ELEMENT_TYPES.TRIGGER) {
          const triggerTextNode = child.childNodes[0];
          if (triggerTextNode && isTextNode(triggerTextNode) && triggerTextNode === range.startContainer) {
            count += range.startOffset;
          }
        } else if (tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED) {
          const cursorSpotBefore = child.querySelector(`[data-type="${ELEMENT_TYPES.CURSOR_SPOT_BEFORE}"]`);
          const cursorSpotAfter = child.querySelector(`[data-type="${ELEMENT_TYPES.CURSOR_SPOT_AFTER}"]`);

          const cursorInBefore =
            cursorSpotBefore &&
            (cursorSpotBefore === range.startContainer || cursorSpotBefore.contains(range.startContainer));
          const cursorInAfter =
            cursorSpotAfter &&
            (cursorSpotAfter === range.startContainer || cursorSpotAfter.contains(range.startContainer));

          if (cursorInBefore) {
            const beforeContent = (cursorSpotBefore!.textContent || '').replace(
              new RegExp(SPECIAL_CHARS.ZWNJ, 'g'),
              ''
            );
            if (beforeContent && isTextNode(range.startContainer)) {
              count += range.startOffset;
            }
          } else if (cursorInAfter) {
            count += 1;

            const afterContent = (cursorSpotAfter!.textContent || '').replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');
            if (afterContent && isTextNode(range.startContainer)) {
              const contentOffset = Math.max(0, range.startOffset - 1);
              count += contentOffset;
            }
          } else {
            count += 1;
          }
        }
      }
      break;
    }

    count += getTokenElementLength(child);
  }

  return count;
}

export function getCursorPosition(element: HTMLElement): number {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return 0;
  }

  const range = selection.getRangeAt(0);

  if (!element.contains(range.startContainer)) {
    return 0;
  }

  const paragraphs = findAllParagraphs(element);

  if (paragraphs.length === 0) {
    return 0;
  }

  let position = 0;

  for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
    const p = paragraphs[pIndex];

    if (pIndex > 0) {
      position += 1; // Line break
    }

    if (!p.contains(range.startContainer)) {
      position += countParagraphContent(p);
    } else {
      position += countUpToCursor(p, range);
      break;
    }
  }

  return position;
}

// NUMERIC POSITION TO DOM LOCATION

interface DOMLocation {
  node: Node;
  offset: number;
}

function findPositionInDOM(element: HTMLElement, position: number): DOMLocation | null {
  const paragraphs = findAllParagraphs(element);
  let cursorPos = 0;

  for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
    const p = paragraphs[pIndex];

    if (pIndex > 0) {
      cursorPos += 1;
      if (cursorPos >= position) {
        return { node: p, offset: 0 };
      }
    }

    const paragraphLength = countParagraphContent(p);

    if (cursorPos + paragraphLength >= position) {
      const targetOffset = position - cursorPos;
      let offsetInParagraph = 0;

      for (const child of Array.from(p.childNodes)) {
        if (isTextNode(child)) {
          const textLength = child.textContent?.length || 0;

          if (offsetInParagraph + textLength >= targetOffset) {
            return { node: child, offset: targetOffset - offsetInParagraph };
          }

          offsetInParagraph += textLength;
        } else if (isHTMLElement(child)) {
          const tokenType = getTokenType(child);

          if (tokenType === ELEMENT_TYPES.TRIGGER) {
            const triggerLength = child.textContent?.length || 0;

            if (offsetInParagraph + triggerLength >= targetOffset) {
              const offsetInTrigger = targetOffset - offsetInParagraph;
              const triggerTextNode = child.childNodes[0];
              if (triggerTextNode && isTextNode(triggerTextNode)) {
                return { node: triggerTextNode, offset: offsetInTrigger };
              }
            }

            offsetInParagraph += triggerLength;
          } else if (isReferenceTokenType(tokenType)) {
            if (offsetInParagraph === targetOffset) {
              return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
            }

            offsetInParagraph += 1;

            if (offsetInParagraph === targetOffset) {
              const nextSibling = child.nextSibling;
              if (nextSibling) {
                return isTextNode(nextSibling)
                  ? { node: nextSibling, offset: 0 }
                  : { node: p, offset: Array.from(p.childNodes).indexOf(nextSibling) };
              }
              return { node: p, offset: p.childNodes.length };
            }
          }
        }
      }

      return p.lastChild && isTextNode(p.lastChild)
        ? { node: p.lastChild, offset: p.lastChild.textContent?.length || 0 }
        : { node: p, offset: p.childNodes.length };
    }

    cursorPos += paragraphLength;
  }

  const lastP = paragraphs[paragraphs.length - 1];
  if (lastP) {
    return lastP.lastChild && isTextNode(lastP.lastChild)
      ? { node: lastP.lastChild, offset: lastP.lastChild.textContent?.length || 0 }
      : { node: lastP, offset: lastP.childNodes.length };
  }

  return null;
}

export function setCursorPosition(element: HTMLElement, position: number): void {
  const location = findPositionInDOM(element, position);
  if (location) {
    positionCursorAtOffset(location.node, location.offset);
  }
}

export function setCursorRange(element: HTMLElement, start: number, end: number): void {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  const startLocation = findPositionInDOM(element, start);
  const endLocation = findPositionInDOM(element, end);

  if (!startLocation || !endLocation) {
    return;
  }

  const range = document.createRange();
  range.setStart(startLocation.node, startLocation.offset);
  range.setEnd(endLocation.node, endLocation.offset);
  selection.removeAllRanges();
  selection.addRange(range);
}

// TOKEN CURSOR CALCULATIONS

export function getTokenCursorLength(token: PromptInputProps.InputToken): number {
  if (isTextToken(token)) {
    return token.value.length;
  }
  if (isBreakToken(token)) {
    return 0;
  }
  if (isTriggerToken(token)) {
    return 1 + token.value.length; // trigger char + value
  }
  return 1; // references
}

export function getCursorPositionAtIndex(tokens: readonly PromptInputProps.InputToken[], index: number): number {
  let position = 0;

  for (let i = 0; i <= index && i < tokens.length; i++) {
    position += getTokenCursorLength(tokens[i]);
  }

  return position;
}

// TRIGGER TOKEN UTILITIES

/**
 * Checks if the current cursor position is inside a trigger token element.
 * @param element The contentEditable element
 * @returns true if cursor is inside a trigger token, false otherwise
 */
export function isCursorInTriggerToken(element: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  let node: Node | null = range.startContainer;

  // Walk up the DOM tree to check if we're inside a trigger token
  while (node && node !== element) {
    if (isHTMLElement(node) && getTokenType(node) === ELEMENT_TYPES.TRIGGER) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}
