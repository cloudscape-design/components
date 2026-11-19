// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { getOwnerSelection } from './caret-controller';
import { ElementType, SPECIAL_CHARS } from './constants';
import { isBRElement, isTextNode } from './type-guards';

import styles from '../styles.css.js';

/** Reads the data-type attribute from an element and returns it as a typed ElementType. */
export function getTokenType(element: HTMLElement): ElementType | null {
  const value = element.getAttribute('data-type');
  switch (value) {
    case ElementType.Reference:
    case ElementType.Pinned:
    case ElementType.CaretSpotBefore:
    case ElementType.CaretSpotAfter:
    case ElementType.Trigger:
    case ElementType.TrailingBreak:
      return value;
    default:
      return null;
  }
}
/** Checks if a token type represents a reference element (inline or pinned). */
export function isReferenceElementType(tokenType: ElementType | string | null): boolean {
  return tokenType === ElementType.Reference || tokenType === ElementType.Pinned;
}

/** Inserts a node immediately after a reference node in the DOM. */
export function insertAfter(newNode: Node, referenceNode: Node): void {
  const parent = referenceNode.parentNode;
  if (!parent) {
    return;
  }

  if (referenceNode.nextSibling) {
    parent.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    parent.appendChild(newNode);
  }
}

/** Creates a styled paragraph element for the contentEditable container. */
export function createParagraph(ownerDoc: Document = document): HTMLParagraphElement {
  const p = ownerDoc.createElement('p');
  p.className = styles.paragraph;
  return p;
}

/** Creates a trailing BR element used as a placeholder in empty paragraphs. */
export function createTrailingBreak(ownerDoc: Document = document): HTMLBRElement {
  const br = ownerDoc.createElement('br');
  br.setAttribute('data-id', ElementType.TrailingBreak);
  return br;
}

let idCounter = 0;

/**
 * Generates a unique ID for DOM elements outside of React context.
 * Uses the same format as component-toolkit's useRandomId hook, but as a plain
 * function since token IDs are generated during DOM manipulation (not in React renders).
 */
export function generateTokenId(): string {
  return `${idCounter++}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

/** Strips zero-width characters used for cursor positioning. */
export function stripZeroWidthCharacters(text: string): string {
  return text.replace(new RegExp(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER, 'g'), '');
}

interface TokenQueryOptions {
  tokenType?: string | string[];
  tokenId?: string;
}

function buildTokenSelector(options: TokenQueryOptions): string {
  const { tokenType = [], tokenId } = options;
  const types = Array.isArray(tokenType) ? tokenType : [tokenType];

  let selector = types.length > 0 ? types.map(type => `[data-type="${type}"]`).join(', ') : '';

  if (tokenId) {
    selector += `[data-id="${tokenId}"]`;
  }

  return selector;
}

/** Finds the first element matching the given token type and/or token ID within a container. */
export function findElement(container: HTMLElement, options: TokenQueryOptions): HTMLElement | null {
  const selector = buildTokenSelector(options);
  return selector ? container.querySelector<HTMLElement>(selector) : null;
}

/** Returns all paragraph elements within a container. */
export function findAllParagraphs(container: HTMLElement | DocumentFragment): HTMLParagraphElement[] {
  return Array.from(container.querySelectorAll<HTMLParagraphElement>('p'));
}

/** Checks if an element has no meaningful content (ignoring whitespace and trailing BRs). */
export function isElementEffectivelyEmpty(element: HTMLElement): boolean {
  if (element.childNodes.length === 0) {
    return true;
  }

  for (const child of Array.from(element.childNodes)) {
    if (isTextNode(child)) {
      if (child.textContent && child.textContent.trim() !== '') {
        return false;
      }
    } else if (isBRElement(child)) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

export function hasOnlyTrailingBR(paragraph: HTMLElement): boolean {
  return paragraph.childNodes.length === 1 && isBRElement(paragraph.firstChild);
}

export function isEmptyState(element: HTMLElement): boolean {
  const paragraphs = findAllParagraphs(element);
  return paragraphs.length === 0 || (paragraphs.length === 1 && hasOnlyTrailingBR(paragraphs[0]));
}

/** Resets the element to a single empty paragraph with a trailing BR. */
export function setEmptyState(element: HTMLElement): void {
  const paragraphs = findAllParagraphs(element);

  if (paragraphs.length === 1 && hasOnlyTrailingBR(paragraphs[0])) {
    return;
  }

  element.textContent = '';
  const p = createParagraph();
  p.appendChild(createTrailingBreak());
  element.appendChild(p);
}

/** Checks if a token type represents a caret spot element. */
export function isCaretSpotType(tokenType: ElementType | string | null): boolean {
  return tokenType === ElementType.CaretSpotBefore || tokenType === ElementType.CaretSpotAfter;
}

export interface AdjacentTokenResult {
  sibling: Node | null;
  isReferenceToken: boolean;
}

/**
 * Finds the adjacent sibling node in the given direction and checks if it's a reference token.
 * @param container the node where the cursor currently sits
 * @param offset cursor offset within the container
 * @param direction which direction to look
 */
export function findAdjacentToken(
  container: Node,
  offset: number,
  direction: 'backward' | 'forward'
): AdjacentTokenResult {
  let sibling: Node | null = null;

  if (isTextNode(container)) {
    const isAtBoundary = direction === 'backward' ? offset === 0 : offset === (container.textContent?.length || 0);

    if (isAtBoundary) {
      sibling = direction === 'backward' ? container.previousSibling : container.nextSibling;
    }
  } else if (isHTMLElement(container)) {
    if (direction === 'backward') {
      sibling = offset > 0 ? container.childNodes[offset - 1] : container.previousSibling;
    } else {
      sibling = offset < container.childNodes.length ? container.childNodes[offset] : container.nextSibling;
    }
  }

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  const isReferenceToken = isReferenceElementType(siblingType);

  return { sibling, isReferenceToken };
}

/**
 * When the caret lands immediately after a trigger element (e.g. at offset 0 of the
 * next text node, or at the paragraph-level offset right after the trigger), nudge it
 * inside the trigger's text node so that `findActiveTrigger` detects it correctly.
 * @param cancelledIds Set of trigger IDs that are cancelled — caret won't be nudged into these.
 */
export function normalizeCaretIntoTrigger(editableElement: HTMLElement, cancelledIds?: Set<string>): void {
  const selection = getOwnerSelection(editableElement);
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  if (!range.collapsed) {
    return;
  }

  let triggerElement: HTMLElement | null = null;

  if (isTextNode(range.startContainer) && range.startOffset === 0) {
    const prevSibling = range.startContainer.previousSibling;
    if (isHTMLElement(prevSibling) && getTokenType(prevSibling) === ElementType.Trigger) {
      // Only nudge when the text node is empty — a non-empty node means the
      // cursor is legitimately positioned at the start of user text.
      if (!range.startContainer.textContent) {
        triggerElement = prevSibling;
      }
    }

    // Caret at offset 0 inside a trigger's own text node means the cursor is
    // right before the trigger symbol. Nudge it to the end of whatever precedes
    // this trigger — either the previous trigger or a text node boundary.
    const parent = range.startContainer.parentElement;
    if (!triggerElement && parent && getTokenType(parent) === ElementType.Trigger) {
      const paragraph = parent.parentElement;
      if (paragraph) {
        const idx = Array.from(paragraph.childNodes).indexOf(parent);
        if (idx > 0) {
          range.setStart(paragraph, idx);
          range.collapse(true);
        }
      }
      return;
    }
  } else if (range.startContainer === editableElement || isHTMLElement(range.startContainer)) {
    const container = range.startContainer as HTMLElement;
    const childNodes = Array.from(container.childNodes);
    const nodeBeforeCaret = childNodes[range.startOffset - 1];

    if (isHTMLElement(nodeBeforeCaret) && getTokenType(nodeBeforeCaret) === ElementType.Trigger) {
      triggerElement = nodeBeforeCaret;
    }
  }

  if (triggerElement && !cancelledIds?.has(triggerElement.id)) {
    const triggerTextNode = triggerElement.childNodes[0];
    if (isTextNode(triggerTextNode)) {
      range.setStart(triggerTextNode, triggerTextNode.textContent?.length ?? 0);
      range.collapse(true);
    }
  }
}

/**
 * Scrolls the caret into view within a scrollable contentEditable element.
 * Inserts a temporary span at the selection to measure position, scrolls if
 * needed, then removes the span.
 */
export function scrollCaretIntoView(element: HTMLElement): void {
  if (element.scrollHeight <= element.clientHeight) {
    return;
  }

  const selection = getOwnerSelection(element);
  if (!selection?.rangeCount) {
    return;
  }

  const ownerDoc = element.ownerDocument ?? document;
  const range = selection.getRangeAt(0);

  const tempSpan = ownerDoc.createElement('span');
  range.insertNode(tempSpan);

  const spanRect = tempSpan.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const isOutOfView =
    spanRect.top < elementRect.top ||
    spanRect.bottom > elementRect.bottom ||
    spanRect.left < elementRect.left ||
    spanRect.right > elementRect.right;

  if (isOutOfView) {
    tempSpan.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  // Remove the span and merge the split text nodes back together.
  // insertNode splits a text node into [before, span, after]. After removing
  // the span, merge "after" into "before" to restore the original text node.
  const prev = tempSpan.previousSibling;
  const next = tempSpan.nextSibling;
  tempSpan.remove();

  if (prev && next && prev.nodeType === Node.TEXT_NODE && next.nodeType === Node.TEXT_NODE) {
    const mergeOffset = prev.textContent?.length ?? 0;
    prev.textContent = (prev.textContent ?? '') + (next.textContent ?? '');
    next.remove();
    // Place the caret at the merge point
    range.setStart(prev, mergeOffset);
    range.collapse(true);
  }
}
