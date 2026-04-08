// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { PromptInputProps } from '../interfaces';
import { ElementType } from './constants';
import {
  findAllParagraphs,
  findElement,
  getTokenType,
  isEmptyState,
  isReferenceElementType,
  stripZeroWidthCharacters,
} from './dom-utils';
import { isBreakTextToken, isTextNode, isTextToken, isTriggerToken } from './type-guards';

/** Returns the Selection from the element's owning window, supporting iframe contexts. */
export function getOwnerSelection(element: Node): Selection | null {
  return (element.ownerDocument?.defaultView ?? window).getSelection();
}

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
    } else if (isBreakTextToken(token)) {
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

/** A resolved position within the DOM: a node and an offset into it. */
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

  private get ownerDoc(): Document {
    return this.element.ownerDocument ?? document;
  }

  /**
   * Creates a DOM Range from resolved start/end locations and applies it to the given selection.
   * Returns the created Range for further use (e.g. scroll-into-view checks).
   */
  applyRange(
    ownerDocument: Document,
    selection: Selection,
    startLocation: DOMLocation,
    endLocation?: DOMLocation
  ): Range {
    const range = ownerDocument.createRange();
    range.setStart(startLocation.node, startLocation.offset);

    if (endLocation) {
      range.setEnd(endLocation.node, endLocation.offset);
    } else {
      range.collapse(true);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    return range;
  }

  /** Returns the logical length of a DOM node based on its token type. */
  private getNodeLength(node: Node): number {
    const tokenType = isHTMLElement(node) ? getTokenType(node) : null;

    if (isTextNode(node) || tokenType === ElementType.Trigger) {
      return TOKEN_LENGTHS.text(node.textContent || '');
    } else if (tokenType && isReferenceElementType(tokenType)) {
      return TOKEN_LENGTHS.REFERENCE;
    }

    return 0;
  }

  /** Returns the current logical caret position from the DOM selection. */
  getPosition(): number {
    const selection = getOwnerSelection(this.element);
    if (!selection?.rangeCount) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.startContainer)) {
      return 0;
    }

    return this.calculatePositionFromRange(range, false);
  }

  /** Finds the trigger element at the current caret position, if any. */
  findActiveTrigger(): HTMLElement | null {
    const selection = getOwnerSelection(this.element);
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
      if (isHTMLElement(node) && getTokenType(node) === ElementType.Trigger) {
        if (isTextNode(range.startContainer) && range.startContainer.parentElement === node) {
          // Caret must be after the trigger character (offset > 0) to be considered "in" the trigger
          if (range.startOffset > 0) {
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
      if (isHTMLElement(prevSibling) && getTokenType(prevSibling) === ElementType.Trigger) {
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
    const ownerDocument = this.ownerDoc;
    if (ownerDocument.activeElement !== this.element) {
      this.element.focus();
    }

    const startLocation = this.findDOMLocation(start);

    if (!startLocation) {
      return;
    }

    const selection = getOwnerSelection(this.element);
    if (!selection) {
      return;
    }

    const endLocation = end !== undefined && end !== start ? (this.findDOMLocation(end) ?? undefined) : undefined;

    this.applyRange(ownerDocument, selection, startLocation, endLocation);

    this.state = { start, end, isValid: true };

    ownerDocument.dispatchEvent(new Event('selectionchange'));
  }

  /** Captures the current caret/selection state for later restoration. */
  capture(): void {
    const selection = getOwnerSelection(this.element);
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
  restore(offset = 0): void {
    if (!this.state.isValid || this.ownerDoc.activeElement !== this.element) {
      return;
    }

    this.setPosition(this.state.start + offset, this.state.end !== undefined ? this.state.end + offset : undefined);
  }

  /** Overrides the captured state so the next restore() positions to a calculated location.
   *  Currently used only in tests — consider removing if no production use case emerges.
   */
  setCapturedPosition(start: number, end?: number): void {
    this.state = { start, end, isValid: true };
  }

  /** Selects all content in the element. */
  selectAll(): void {
    const selection = getOwnerSelection(this.element);
    if (!selection) {
      return;
    }

    if (isEmptyState(this.element)) {
      return;
    }

    if (this.ownerDoc.activeElement !== this.element) {
      this.element.focus();
    }

    const paragraphs = findAllParagraphs(this.element);
    if (paragraphs.length === 0) {
      return;
    }

    const firstP = paragraphs[0];
    const lastP = paragraphs[paragraphs.length - 1];

    const range = this.ownerDoc.createRange();
    range.setStart(firstP, 0);
    range.setEnd(lastP, lastP.childNodes.length);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /** Positions the caret at the end of a text node. */
  positionAfterText(textNode: Text): void {
    const range = this.ownerDoc.createRange();
    range.setStart(textNode, textNode.textContent?.length || 0);
    range.collapse(true);

    const selection = getOwnerSelection(this.element);
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

  /** Resolves a DOM location for a specific child node at the given offset within a paragraph. */
  private resolveChildLocation(p: HTMLElement, child: ChildNode, offsetInChild: number): DOMLocation {
    if (isTextNode(child)) {
      return { node: child, offset: offsetInChild };
    }

    if (!isHTMLElement(child)) {
      return { node: p, offset: Array.from(p.childNodes).indexOf(child) };
    }

    const tokenType = getTokenType(child);
    const childIndex = Array.from(p.childNodes).indexOf(child);

    if (tokenType === ElementType.Trigger) {
      if (offsetInChild === 0) {
        return { node: p, offset: childIndex };
      }
      const triggerTextNode = child.childNodes[0];
      if (triggerTextNode && isTextNode(triggerTextNode)) {
        return { node: triggerTextNode, offset: offsetInChild };
      }
      return { node: p, offset: childIndex };
    }

    if (isReferenceElementType(tokenType)) {
      if (offsetInChild === 0) {
        return { node: p, offset: childIndex };
      }
      const nextSibling = child.nextSibling;
      if (nextSibling) {
        return isTextNode(nextSibling) ? { node: nextSibling, offset: 0 } : { node: p, offset: childIndex + 1 };
      }
      return { node: p, offset: p.childNodes.length };
    }

    return { node: p, offset: childIndex };
  }

  private findLocationInParagraph(p: HTMLElement, targetOffset: number): DOMLocation | null {
    let offsetInParagraph = 0;

    for (const child of Array.from(p.childNodes)) {
      const childLength = this.getNodeLength(child);

      if (offsetInParagraph + childLength >= targetOffset) {
        return this.resolveChildLocation(p, child, targetOffset - offsetInParagraph);
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

          if (tokenType === ElementType.Trigger) {
            const triggerTextNode = child.childNodes[0];
            if (triggerTextNode && isTextNode(triggerTextNode) && triggerTextNode === container) {
              return count + offset;
            }
          } else if (isReferenceElementType(tokenType)) {
            const caretSpotBefore = findElement(child, { tokenType: ElementType.CaretSpotBefore });
            const caretSpotAfter = findElement(child, { tokenType: ElementType.CaretSpotAfter });

            const caretInBefore =
              caretSpotBefore && (caretSpotBefore === container || caretSpotBefore.contains(container));
            const caretInAfter = caretSpotAfter && (caretSpotAfter === container || caretSpotAfter.contains(container));

            if (caretInBefore) {
              // Caret is in the before-spot: any typed text counts from the start of the reference
              const beforeContent = stripZeroWidthCharacters(caretSpotBefore!.textContent || '');
              if (beforeContent && isTextNode(container)) {
                return count + offset;
              }
              // No real content — caret is logically before the reference
              return count;
            } else if (caretInAfter) {
              // Caret is in the after-spot: position is after the reference (count it first)
              count += TOKEN_LENGTHS.REFERENCE;
              const afterContent = stripZeroWidthCharacters(caretSpotAfter!.textContent || '');
              if (afterContent && isTextNode(container)) {
                // offset - 1 because the zero-width character occupies position 0
                const contentOffset = Math.max(0, offset - 1);
                return count + contentOffset;
              }
              // No real content — caret is logically after the reference
              return count;
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
