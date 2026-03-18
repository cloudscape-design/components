// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { ELEMENT_TYPES, ElementType, SPECIAL_CHARS } from './constants';
import { isBRElement, isTextNode } from './type-guards';

import styles from '../styles.css.js';

/** Reads the data-type attribute from an element and returns it as a typed ElementType. */
export function getTokenType(element: HTMLElement): ElementType | null {
  const value = element.getAttribute('data-type');
  switch (value) {
    case ELEMENT_TYPES.REFERENCE:
    case ELEMENT_TYPES.PINNED:
    case ELEMENT_TYPES.CURSOR_SPOT_BEFORE:
    case ELEMENT_TYPES.CURSOR_SPOT_AFTER:
    case ELEMENT_TYPES.TRIGGER:
    case ELEMENT_TYPES.TRAILING_BREAK:
      return value;
    default:
      return null;
  }
}
/** Checks if a token type represents a reference element (inline or pinned). */
export function isReferenceElementType(tokenType: ElementType | string | null): boolean {
  return tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED;
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
export function createParagraph(): HTMLParagraphElement {
  const p = document.createElement('p');
  p.className = styles.paragraph;
  return p;
}

/** Creates a trailing BR element used as a placeholder in empty paragraphs. */
export function createTrailingBreak(): HTMLBRElement {
  const br = document.createElement('br');
  br.setAttribute('data-id', ELEMENT_TYPES.TRAILING_BREAK);
  return br;
}

let idCounter = 0;

/** Generates a unique ID for DOM elements outside of React context. */
export function generateTokenId(): string {
  return `${idCounter++}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

/** Strips zero-width non-joiner characters used for cursor positioning. */
export function stripZWNJ(text: string): string {
  return text.replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');
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

/** Finds all elements matching the given token type and/or token ID within a container. */
export function findElements(container: HTMLElement, options: TokenQueryOptions): HTMLElement[] {
  const selector = buildTokenSelector(options);
  return selector ? Array.from(container.querySelectorAll<HTMLElement>(selector)) : [];
}

/** Finds the first element matching the given token type and/or token ID within a container. */
export function findElement(container: HTMLElement, options: TokenQueryOptions): HTMLElement | null {
  const selector = buildTokenSelector(options);
  return selector ? container.querySelector<HTMLElement>(selector) : null;
}

/** Returns all paragraph elements within a container. */
export function findAllParagraphs(container: HTMLElement): HTMLParagraphElement[] {
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

/** Checks if a token type represents a caret spot element. */
export function isCaretSpotType(tokenType: ElementType | string | null): boolean {
  return tokenType === ELEMENT_TYPES.CURSOR_SPOT_BEFORE || tokenType === ELEMENT_TYPES.CURSOR_SPOT_AFTER;
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

export type ArrowDirection = 'left' | 'right';

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
export function findAdjacentToken(container: Node, offset: number, direction: ArrowDirection): AdjacentTokenResult {
  let sibling: Node | null = null;

  if (isTextNode(container)) {
    const isAtBoundary = direction === 'left' ? offset === 0 : offset === (container.textContent?.length || 0);

    if (isAtBoundary) {
      sibling = direction === 'left' ? container.previousSibling : container.nextSibling;
    }
  } else if (isHTMLElement(container)) {
    if (direction === 'left') {
      sibling = offset > 0 ? container.childNodes[offset - 1] : container.previousSibling;
    } else {
      sibling = offset < container.childNodes.length ? container.childNodes[offset] : container.nextSibling;
    }
  }

  const siblingType = isHTMLElement(sibling) ? getTokenType(sibling) : null;
  const isReferenceToken = isReferenceElementType(siblingType);

  return { sibling, isReferenceToken };
}
