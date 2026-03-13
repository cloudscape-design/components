// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { findAllParagraphs, findElement, getTokenType, isEmptyState } from './dom-utils';
import { isHTMLElement, isTextNode } from './type-guards';

// Token length constants
export const TOKEN_LENGTHS = {
  REFERENCE: 1,
  LINE_BREAK: 1,
  trigger: (filterText: string) => 1 + filterText.length,
  text: (content: string) => content.length,
} as const;

interface CursorState {
  start: number;
  end: number | undefined;
  isValid: boolean;
}

interface DOMLocation {
  node: Node;
  offset: number;
}

/**
 * CursorController manages all cursor positioning for a contenteditable element
 */
export class CursorController {
  private element: HTMLElement;
  private state: CursorState;
  private activeTriggerElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.state = { start: 0, end: undefined, isValid: false };
  }

  private isReferenceTokenType(tokenType: string | null): boolean {
    return tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED;
  }

  /**
   * Get the length of a DOM node using TOKEN_LENGTHS constants
   */
  private getNodeLength(node: Node): number {
    if (isTextNode(node)) {
      return TOKEN_LENGTHS.text(node.textContent || '');
    }

    if (isHTMLElement(node)) {
      const tokenType = getTokenType(node);
      if (tokenType === ELEMENT_TYPES.TRIGGER) {
        const triggerText = node.textContent || '';
        // Trigger length = trigger char + filter text
        return triggerText.length;
      }
      if (this.isReferenceTokenType(tokenType)) {
        return TOKEN_LENGTHS.REFERENCE;
      }
    }

    return 0;
  }

  /**
   * Get current cursor position from DOM (returns start of selection)
   */
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

  /**
   * Get the ID of the trigger element that currently contains the cursor
   * Updates the active trigger state before checking
   */
  getActiveTriggerID(): string | null {
    this.updateActiveTrigger();
    return this.activeTriggerElement?.id || null;
  }

  /**
   * Check if cursor is currently inside a trigger element
   * Updates the active trigger state before checking
   */
  isInTrigger(): boolean {
    this.updateActiveTrigger();
    return this.activeTriggerElement !== null;
  }

  /**
   * Update the active trigger element based on current cursor position
   */
  private updateActiveTrigger(): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      this.activeTriggerElement = null;
      return;
    }

    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      this.activeTriggerElement = null;
      return;
    }

    let node: Node | null = range.startContainer;

    // Walk up the DOM tree to find trigger element
    while (node && node !== this.element) {
      if (isHTMLElement(node) && getTokenType(node) === ELEMENT_TYPES.TRIGGER) {
        // Check if cursor is after the trigger character (not at position 0)
        if (isTextNode(range.startContainer) && range.startContainer.parentElement === node) {
          if (range.startOffset > 0) {
            this.activeTriggerElement = node;
            return;
          }
        } else {
          this.activeTriggerElement = node;
          return;
        }
      }
      node = node.parentNode;
    }

    this.activeTriggerElement = null;
  }

  /**
   * Set cursor to specific position (or range if end provided)
   *
   * Smart positioning rules:
   * - Text nodes: positions within the text at exact offset
   * - Trigger tokens: positions within trigger text node (editable)
   * - Reference tokens: positions before/after (atomic, never inside)
   * - Line breaks: positions at start of next paragraph
   *
   * Maintains focus and ensures position is set correctly
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

    // If end is specified and different from start, create a selection range
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
  }

  /**
   * Capture current cursor/selection state
   */
  capture(): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      this.state = { start: 0, end: undefined, isValid: false };
      this.activeTriggerElement = null;
      return;
    }

    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.startContainer)) {
      this.state = { start: 0, end: undefined, isValid: false };
      this.activeTriggerElement = null;
      return;
    }

    const start = this.calculatePositionFromRange(range, false);
    const end = range.collapsed ? undefined : this.calculatePositionFromRange(range, true);

    this.state = { start, end, isValid: true };
  }

  /**
   * Get the captured cursor start position
   */
  getSavedPosition(): number | null {
    return this.state.isValid ? this.state.start : null;
  }

  /**
   * Restore cursor from captured state
   */
  restore(): void {
    if (!this.state.isValid || document.activeElement !== this.element) {
      return;
    }

    this.setPosition(this.state.start, this.state.end);
  }

  /**
   * Set the captured state to a specific position
   * Used when we want the next restore() to position to a calculated location
   */
  setCapturedPosition(start: number, end?: number): void {
    this.state = { start, end, isValid: true };
  }

  /**
   * Select all content in the element
   */
  selectAll(): void {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    // In empty state (only <p><br></p>), don't select anything
    if (isEmptyState(this.element)) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(this.element);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Position cursor at the end of a text node
   * Used after moving text from cursor spots
   */
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

  /**
   * Move cursor forward by a specific offset using TOKEN_LENGTHS
   */
  moveForward(offset: number): void {
    const currentPos = this.getPosition();
    this.setPosition(currentPos + offset);
  }

  /**
   * Move cursor backward by a specific offset using TOKEN_LENGTHS
   * Ensures position doesn't go below 0
   */
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
    let cursorPos = 0;

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
      const p = paragraphs[pIndex];

      if (pIndex > 0) {
        cursorPos += TOKEN_LENGTHS.LINE_BREAK;
        if (cursorPos >= position) {
          return { node: p, offset: 0 };
        }
      }

      const paragraphLength = this.countParagraphContent(p);

      if (cursorPos + paragraphLength >= position) {
        return this.findLocationInParagraph(p, position - cursorPos);
      }

      cursorPos += paragraphLength;
    }

    // Fallback: end of last paragraph
    const lastP = paragraphs[paragraphs.length - 1];
    if (lastP?.lastChild?.nodeType === Node.TEXT_NODE) {
      return { node: lastP.lastChild, offset: lastP.lastChild.textContent?.length || 0 };
    }
    return lastP ? { node: lastP, offset: lastP.childNodes.length } : null;
  }

  private findLocationInParagraph(p: HTMLElement, targetOffset: number): DOMLocation | null {
    let offsetInParagraph = 0;

    for (const child of Array.from(p.childNodes)) {
      const childLength = this.getNodeLength(child);

      // Check if target position is within this child
      if (offsetInParagraph + childLength >= targetOffset) {
        // TEXT NODE: Position within the text
        if (child.nodeType === Node.TEXT_NODE) {
          return { node: child, offset: targetOffset - offsetInParagraph };
        }

        // ELEMENT NODE: Check token type
        if (isHTMLElement(child)) {
          const tokenType = getTokenType(child);

          // TRIGGER: Position within trigger text node
          if (tokenType === ELEMENT_TYPES.TRIGGER) {
            const offsetInTrigger = targetOffset - offsetInParagraph;
            const triggerTextNode = child.childNodes[0];
            if (triggerTextNode && isTextNode(triggerTextNode)) {
              return { node: triggerTextNode, offset: offsetInTrigger };
            }
            // Fallback: position at paragraph level before trigger
            return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
          }

          // REFERENCE/PINNED: Atomic token, position before or after (never inside)
          if (this.isReferenceTokenType(tokenType)) {
            // Position exactly at start of reference
            if (offsetInParagraph === targetOffset) {
              return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
            }

            // Position after reference (targetOffset = offsetInParagraph + 1)
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

            // Should not reach here, but fallback to after reference
            return { node: p, offset: Array.from(p.childNodes).indexOf(child) + 1 };
          }
        }

        // Unknown element type: position at paragraph level
        return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
      }

      offsetInParagraph += childLength;
    }

    // Target is at end of paragraph
    if (p.lastChild?.nodeType === Node.TEXT_NODE) {
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
        if (child.nodeType === Node.TEXT_NODE) {
          return count + offset;
        }

        if (isHTMLElement(child)) {
          const tokenType = getTokenType(child);

          if (tokenType === ELEMENT_TYPES.TRIGGER) {
            const triggerTextNode = child.childNodes[0];
            if (triggerTextNode && isTextNode(triggerTextNode) && triggerTextNode === container) {
              return count + offset;
            }
          } else if (tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED) {
            const cursorSpotBefore = findElement(child, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_BEFORE });
            const cursorSpotAfter = findElement(child, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_AFTER });

            const cursorInBefore =
              cursorSpotBefore && (cursorSpotBefore === container || cursorSpotBefore.contains(container));
            const cursorInAfter =
              cursorSpotAfter && (cursorSpotAfter === container || cursorSpotAfter.contains(container));

            if (cursorInBefore) {
              const beforeContent = (cursorSpotBefore!.textContent || '').replace(
                new RegExp(SPECIAL_CHARS.ZWNJ, 'g'),
                ''
              );
              if (beforeContent && isTextNode(container)) {
                return count + offset;
              }
            } else if (cursorInAfter) {
              count += TOKEN_LENGTHS.REFERENCE;
              const afterContent = (cursorSpotAfter!.textContent || '').replace(
                new RegExp(SPECIAL_CHARS.ZWNJ, 'g'),
                ''
              );
              if (afterContent && isTextNode(container)) {
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

// SELECTION UTILITIES

declare global {
  interface Window {
    isMouseDown?: boolean;
    isMouseDownForCursor?: boolean;
  }
}

/**
 * Normalize selection boundaries to avoid cursor spots
 * This ensures selections don't start/end inside cursor spot elements
 */
export function normalizeSelection(selection: Selection | null, skipCursorSpots: boolean = false): void {
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed || window.isMouseDown || skipCursorSpots) {
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
    if (parentType !== ELEMENT_TYPES.CURSOR_SPOT_BEFORE && parentType !== ELEMENT_TYPES.CURSOR_SPOT_AFTER) {
      return null;
    }

    const wrapper = parent.parentElement;
    const wrapperType = wrapper ? getTokenType(wrapper) : null;
    if (!wrapper || (wrapperType !== ELEMENT_TYPES.REFERENCE && wrapperType !== ELEMENT_TYPES.PINNED)) {
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
