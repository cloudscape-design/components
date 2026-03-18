// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES } from './constants';
import {
  findAllParagraphs,
  findElement,
  getTokenType,
  isCaretSpotType,
  isEmptyState,
  isReferenceElementType,
  stripZWNJ,
} from './dom-utils';
import { isBreakToken, isTextNode, isTextToken, isTriggerToken } from './type-guards';

/** Logical lengths for each token type, used for cursor position calculations. */
export const TOKEN_LENGTHS = {
  REFERENCE: 1,
  LINE_BREAK: 1,
  trigger: (filterText: string) => 1 + filterText.length,
  text: (content: string) => content.length,
} as const;

/** Calculates the logical cursor position after a given token index. */
export function calculateTokenPosition(tokens: readonly PromptInputProps.InputToken[], upToIndex: number): number {
  let pos = 0;
  for (let i = 0; i <= upToIndex && i < tokens.length; i++) {
    const token = tokens[i];
    if (isTextToken(token)) {
      pos += TOKEN_LENGTHS.text(token.value);
    } else if (isBreakToken(token)) {
      pos += TOKEN_LENGTHS.LINE_BREAK;
    } else if (isTriggerToken(token)) {
      pos += TOKEN_LENGTHS.trigger(token.value);
    } else {
      pos += TOKEN_LENGTHS.REFERENCE;
    }
  }
  return pos;
}

/** Calculates the total logical length of all tokens. */
export function calculateTotalTokenLength(tokens: readonly PromptInputProps.InputToken[]): number {
  return tokens.length === 0 ? 0 : calculateTokenPosition(tokens, tokens.length - 1);
}

interface CaretState {
  start: number;
  end: number | undefined;
  isValid: boolean;
}

interface DOMLocation {
  node: Node;
  offset: number;
}

/**
 * Manages caret positioning within a contentEditable element.
 * Translates between logical token positions and DOM Range/Selection API.
 */
export class CaretController {
  private element: HTMLElement;
  private state: CaretState;

  constructor(element: HTMLElement) {
    this.element = element;
    this.state = { start: 0, end: undefined, isValid: false };
  }

  /** Returns the logical length of a DOM node based on its token type. */
  private getNodeLength(node: Node): number {
    if (isTextNode(node)) {
      return TOKEN_LENGTHS.text(node.textContent || '');
    }

    if (isHTMLElement(node)) {
      const tokenType = getTokenType(node);
      if (tokenType === ELEMENT_TYPES.TRIGGER) {
        return TOKEN_LENGTHS.text(node.textContent || '');
      }
      if (isReferenceElementType(tokenType)) {
        return TOKEN_LENGTHS.REFERENCE;
      }
    }

    return 0;
  }

  /** Returns the current logical caret position from the DOM selection. */
  getPosition(): number {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.startContainer)) {
      return 0;
    }

    const position = this.calculatePositionFromRange(range, false);

    return position;
  }

  /** Finds the trigger element at the current caret position, if any. */
  findActiveTrigger(): HTMLElement | null {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      return null;
    }

    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      return null;
    }

    let node: Node | null = range.startContainer;

    // Walk up from cursor to find a trigger ancestor
    while (node && node !== this.element) {
      if (isHTMLElement(node) && getTokenType(node) === ELEMENT_TYPES.TRIGGER) {
        if (isTextNode(range.startContainer) && range.startContainer.parentElement === node) {
          const triggerText = node.textContent || '';
          const triggerHasFilterText = triggerText.length > 1;

          // At offset 0 with filter text means cursor is before the trigger char — not "in" the trigger
          if (range.startOffset > 0 || !triggerHasFilterText) {
            return node;
          }
        } else {
          return node;
        }
      }
      node = node.parentNode;
    }

    // Also check: cursor at offset 0 of a text node right after a trigger
    if (isTextNode(range.startContainer) && range.startOffset === 0) {
      const prevSibling = range.startContainer.previousSibling;
      if (isHTMLElement(prevSibling) && getTokenType(prevSibling) === ELEMENT_TYPES.TRIGGER) {
        return prevSibling;
      }
    }

    return null;
  }

  /**
   * Sets the caret to a logical position, or creates a selection range if end is provided.
   * Handles smart positioning around atomic reference tokens and scrolls into view.
   * @param start logical start position
   * @param end optional logical end position for range selection
   */
  setPosition(start: number, end?: number): void {
    if (document.activeElement !== this.element) {
      this.element.focus();
    }

    const startLocation = this.findDOMLocation(start);

    if (!startLocation) {
      return;
    }

    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.setStart(startLocation.node, startLocation.offset);

    if (end !== undefined && end !== start) {
      const endLocation = this.findDOMLocation(end);
      if (endLocation) {
        range.setEnd(endLocation.node, endLocation.offset);
      } else {
        range.collapse(true);
      }
    } else {
      range.collapse(true);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    this.state = { start, end, isValid: true };

    if (typeof range.getBoundingClientRect === 'function') {
      try {
        const rangeRect = range.getBoundingClientRect();
        const elementRect = this.element.getBoundingClientRect();

        const isOutOfView =
          rangeRect.top < elementRect.top ||
          rangeRect.bottom > elementRect.bottom ||
          rangeRect.left < elementRect.left ||
          rangeRect.right > elementRect.right;

        if (isOutOfView) {
          const tempSpan = document.createElement('span');
          range.insertNode(tempSpan);
          tempSpan.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          tempSpan.remove();

          range.setStart(startLocation.node, startLocation.offset);
          if (end !== undefined && end !== start) {
            const endLocation = this.findDOMLocation(end);
            if (endLocation) {
              range.setEnd(endLocation.node, endLocation.offset);
            } else {
              range.collapse(true);
            }
          } else {
            range.collapse(true);
          }
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } catch {
        /* ignore scroll errors in test environments */
      }
    }
  }

  /** Captures the current caret/selection state for later restoration. */
  capture(): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      this.state = { start: 0, end: undefined, isValid: false };
      return;
    }

    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.startContainer)) {
      this.state = { start: 0, end: undefined, isValid: false };
      return;
    }

    const start = this.calculatePositionFromRange(range, false);
    const end = range.collapsed ? undefined : this.calculatePositionFromRange(range, true);

    this.state = { start, end, isValid: true };
  }

  /** Returns the captured caret start position, or null if no valid capture exists. */
  getSavedPosition(): number | null {
    return this.state.isValid ? this.state.start : null;
  }

  /** Restores the caret to the previously captured state. */
  restore(): void {
    if (!this.state.isValid || document.activeElement !== this.element) {
      return;
    }

    this.setPosition(this.state.start, this.state.end);
  }

  /** Overrides the captured state so the next restore() positions to a calculated location. */
  setCapturedPosition(start: number, end?: number): void {
    this.state = { start, end, isValid: true };
  }

  /** Selects all content in the element. */
  selectAll(): void {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    if (isEmptyState(this.element)) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(this.element);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /** Positions the caret at the end of a text node. */
  positionAfterText(textNode: Text): void {
    const range = document.createRange();
    range.setStart(textNode, textNode.textContent?.length || 0);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  /** Moves the caret forward by a logical offset. */
  moveForward(offset: number): void {
    const currentPos = this.getPosition();
    this.setPosition(currentPos + offset);
  }

  /** Moves the caret backward by a logical offset, clamped to 0. */
  moveBackward(offset: number): void {
    const currentPos = this.getPosition();
    this.setPosition(Math.max(0, currentPos - offset));
  }

  private calculatePositionFromRange(range: Range, useEnd: boolean): number {
    const paragraphs = findAllParagraphs(this.element);
    if (paragraphs.length === 0) {
      return 0;
    }

    const container = useEnd ? range.endContainer : range.startContainer;
    const offset = useEnd ? range.endOffset : range.startOffset;

    let position = 0;

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
      const p = paragraphs[pIndex];
      if (pIndex > 0) {
        position += TOKEN_LENGTHS.LINE_BREAK;
      }

      if (!p.contains(container)) {
        position += this.countParagraphContent(p);
      } else {
        position += this.countUpToCursor(p, container, offset);
        break;
      }
    }

    return position;
  }

  private findDOMLocation(position: number): DOMLocation | null {
    const paragraphs = findAllParagraphs(this.element);
    let caretPos = 0;

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
      const p = paragraphs[pIndex];

      if (pIndex > 0) {
        caretPos += TOKEN_LENGTHS.LINE_BREAK;
        if (caretPos >= position) {
          return { node: p, offset: 0 };
        }
      }

      const paragraphLength = this.countParagraphContent(p);

      if (caretPos + paragraphLength >= position) {
        return this.findLocationInParagraph(p, position - caretPos);
      }

      caretPos += paragraphLength;
    }

    const lastP = paragraphs[paragraphs.length - 1];
    if (lastP?.lastChild && isTextNode(lastP.lastChild)) {
      return { node: lastP.lastChild, offset: lastP.lastChild.textContent?.length || 0 };
    }
    return lastP ? { node: lastP, offset: lastP.childNodes.length } : null;
  }

  private findLocationInParagraph(p: HTMLElement, targetOffset: number): DOMLocation | null {
    let offsetInParagraph = 0;

    for (const child of Array.from(p.childNodes)) {
      const childLength = this.getNodeLength(child);

      if (offsetInParagraph + childLength >= targetOffset) {
        if (isTextNode(child)) {
          return { node: child, offset: targetOffset - offsetInParagraph };
        }

        if (isHTMLElement(child)) {
          const tokenType = getTokenType(child);

          if (tokenType === ELEMENT_TYPES.TRIGGER) {
            const offsetInTrigger = targetOffset - offsetInParagraph;
            const triggerTextNode = child.childNodes[0];
            if (triggerTextNode && isTextNode(triggerTextNode)) {
              return { node: triggerTextNode, offset: offsetInTrigger };
            }
            return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
          }

          if (isReferenceElementType(tokenType)) {
            // References are atomic — position before or after, never inside
            if (offsetInParagraph === targetOffset) {
              return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
            }

            offsetInParagraph += TOKEN_LENGTHS.REFERENCE;
            if (offsetInParagraph === targetOffset) {
              const nextSibling = child.nextSibling;
              if (nextSibling) {
                return isTextNode(nextSibling)
                  ? { node: nextSibling, offset: 0 }
                  : { node: p, offset: Array.from(p.childNodes).indexOf(nextSibling) };
              }
              return { node: p, offset: p.childNodes.length };
            }

            return { node: p, offset: Array.from(p.childNodes).indexOf(child) + 1 };
          }
        }

        return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
      }

      offsetInParagraph += childLength;
    }

    if (p.lastChild && isTextNode(p.lastChild)) {
      return { node: p.lastChild, offset: p.lastChild.textContent?.length || 0 };
    }
    return { node: p, offset: p.childNodes.length };
  }

  private countParagraphContent(p: Element): number {
    let count = 0;
    for (const child of Array.from(p.childNodes)) {
      count += this.getNodeLength(child);
    }
    return count;
  }

  private countUpToCursor(p: Element, container: Node, offset: number): number {
    if (container === p) {
      let count = 0;
      for (let i = 0; i < offset && i < p.childNodes.length; i++) {
        count += this.getNodeLength(p.childNodes[i]);
      }
      return count;
    }

    let count = 0;
    for (const child of Array.from(p.childNodes)) {
      if (child === container || child.contains(container)) {
        if (isTextNode(child)) {
          return count + offset;
        }

        if (isHTMLElement(child)) {
          const tokenType = getTokenType(child);

          if (tokenType === ELEMENT_TYPES.TRIGGER) {
            const triggerTextNode = child.childNodes[0];
            if (triggerTextNode && isTextNode(triggerTextNode) && triggerTextNode === container) {
              return count + offset;
            }
          } else if (isReferenceElementType(tokenType)) {
            const caretSpotBefore = findElement(child, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_BEFORE });
            const caretSpotAfter = findElement(child, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_AFTER });

            const caretInBefore =
              caretSpotBefore && (caretSpotBefore === container || caretSpotBefore.contains(container));
            const caretInAfter = caretSpotAfter && (caretSpotAfter === container || caretSpotAfter.contains(container));

            if (caretInBefore) {
              // Caret is in the before-spot: any typed text counts from the start of the reference
              const beforeContent = stripZWNJ(caretSpotBefore!.textContent || '');
              if (beforeContent && isTextNode(container)) {
                return count + offset;
              }
            } else if (caretInAfter) {
              // Caret is in the after-spot: position is after the reference (count it first)
              count += TOKEN_LENGTHS.REFERENCE;
              const afterContent = stripZWNJ(caretSpotAfter!.textContent || '');
              if (afterContent && isTextNode(container)) {
                // offset - 1 because the ZWNJ char occupies position 0
                const contentOffset = Math.max(0, offset - 1);
                return count + contentOffset;
              }
            } else {
              return count + TOKEN_LENGTHS.REFERENCE;
            }
          }
        }
        return count + this.getNodeLength(child);
      }
      count += this.getNodeLength(child);
    }

    return count;
  }
}

let isMouseDown = false;

/** Updates the mouse-down tracking flag used to skip selection normalization during drag. */
export function setMouseDown(value: boolean): void {
  isMouseDown = value;
}

/**
 * Moves a collapsed caret out of caret spot elements into the parent paragraph.
 * Caret spots exist only for visual positioning and should not hold the caret.
 */
export function normalizeCollapsedCaret(selection: Selection | null): void {
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (!range.collapsed) {
    return;
  }

  const container = range.startContainer;

  if (isTextNode(container)) {
    const parent = container.parentElement;
    if (!parent) {
      return;
    }

    const parentType = getTokenType(parent);
    if (!isCaretSpotType(parentType)) {
      return;
    }

    const wrapper = parent.parentElement;
    if (!wrapper || !isReferenceElementType(wrapper ? getTokenType(wrapper) : null)) {
      return;
    }

    const paragraph = wrapper.parentElement;
    if (!paragraph) {
      return;
    }

    const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);

    const newOffset = parentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE ? wrapperIndex : wrapperIndex + 1;

    const newRange = document.createRange();
    newRange.setStart(paragraph, newOffset);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

/** Adjusts non-collapsed selection boundaries to exclude caret spot elements. */
export function normalizeSelection(selection: Selection | null, skipCaretSpots: boolean = false): void {
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed || isMouseDown || skipCaretSpots) {
    return;
  }

  const normalizeBoundary = (container: Node) => {
    if (!isTextNode(container)) {
      return null;
    }

    const parent = container.parentElement;
    if (!parent) {
      return null;
    }

    const parentType = getTokenType(parent);
    if (!isCaretSpotType(parentType)) {
      return null;
    }

    const wrapper = parent.parentElement;
    if (!wrapper || !isReferenceElementType(wrapper ? getTokenType(wrapper) : null)) {
      return null;
    }

    const paragraph = wrapper.parentElement;
    if (!paragraph) {
      return null;
    }

    const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);
    const newOffset = parentType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE ? wrapperIndex : wrapperIndex + 1;

    return { container: paragraph, offset: newOffset };
  };

  const normalizedStart = normalizeBoundary(range.startContainer);
  const normalizedEnd = normalizeBoundary(range.endContainer);

  if (normalizedStart || normalizedEnd) {
    const updatedRange = document.createRange();
    updatedRange.setStart(
      normalizedStart?.container ?? range.startContainer,
      normalizedStart?.offset ?? range.startOffset
    );
    updatedRange.setEnd(normalizedEnd?.container ?? range.endContainer, normalizedEnd?.offset ?? range.endOffset);
    selection.removeAllRanges();
    selection.addRange(updatedRange);
  }
}
