// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ELEMENT_TYPES } from './constants';

import styles from '../styles.css.js';

// TOKEN TYPE UTILITIES

/**
 * Gets the token type from an element's data-type attribute.
 * @param element The element to check
 * @returns The token type string, or null if not set
 */
export function getTokenType(element: HTMLElement): string | null {
  return element.getAttribute('data-type');
}

/**
 * Inserts a node after a reference node
 */
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

// DOM CREATION

export function createParagraph(): HTMLParagraphElement {
  const p = document.createElement('p');
  p.className = styles.paragraph || 'paragraph';
  p.setAttribute('data-paragraph-id', generateTokenId('p'));
  return p;
}

export function createTrailingBreak(): HTMLBRElement {
  const br = document.createElement('br');
  br.setAttribute('data-id', ELEMENT_TYPES.TRAILING_BREAK);
  return br;
}

// DOM STATE MANAGEMENT

export function ensureEmptyState(element: HTMLElement): void {
  element.innerHTML = '';
  const p = createParagraph();
  p.appendChild(createTrailingBreak());
  element.appendChild(p);
}

export function isElementEffectivelyEmpty(element: HTMLElement): boolean {
  if (element.childNodes.length === 0) {
    return true;
  }

  for (const child of Array.from(element.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent && child.textContent.trim() !== '') {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

// SELECTION UTILITIES

export function getCurrentSelection(): Selection | null {
  return window.getSelection();
}

export function getFirstRange(): Range | null {
  const selection = getCurrentSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  return selection.getRangeAt(0);
}

export function selectAllContent(element: HTMLElement): void {
  const selection = getCurrentSelection();
  if (!selection) {
    return;
  }

  const range = document.createRange();
  range.selectNodeContents(element);

  selection.removeAllRanges();
  selection.addRange(range);
}

// ID GENERATION

/**
 * Generates a unique ID for tokens (triggers, references, etc.).
 * @param prefix The prefix for the ID (e.g., 'trigger', 'reference', 'p')
 * @returns A unique ID based on timestamp
 */
export function generateTokenId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

// DOM QUERY UTILITIES

interface TokenQueryOptions {
  tokenType?: string | string[];
  tokenId?: string;
}

/**
 * Build a CSS selector from query options
 * @param options Query options (tokenType, tokenId)
 * @returns CSS selector string, or empty string if no options provided
 */
function buildTokenSelector(options: TokenQueryOptions): string {
  const { tokenType, tokenId } = options;

  let selector = '';

  if (tokenType) {
    const types = Array.isArray(tokenType) ? tokenType : [tokenType];
    selector = types.map(type => `[data-type="${type}"]`).join(', ');
  }

  if (tokenId) {
    selector += `[data-id="${tokenId}"]`;
  }

  return selector;
}

/**
 * Find all elements matching the query options
 * @param container The container element to search within
 * @param options Query options (tokenType, tokenId)
 * @returns Array of matching elements
 *
 * @example
 * // Find all triggers
 * findElements(container, { tokenType: ELEMENT_TYPES.TRIGGER })
 *
 * // Find all cursor spots (before and after)
 * findElements(container, { tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER] })
 *
 * // Find reference wrappers by token ID
 * findElements(container, { tokenType: ELEMENT_TYPES.REFERENCE, tokenId: 'ref-123' })
 *
 * // Find trigger by ID
 * findElements(container, { tokenType: ELEMENT_TYPES.TRIGGER, tokenId: 'trigger-123' })
 */
export function findElements(container: HTMLElement, options: TokenQueryOptions): HTMLElement[] {
  const selector = buildTokenSelector(options);
  return selector ? Array.from(container.querySelectorAll<HTMLElement>(selector)) : [];
}

/**
 * Find first element matching the query options
 * @param container The container element to search within
 * @param options Query options (tokenType, tokenId)
 * @returns The first matching element, or null if not found
 *
 * @example
 * // Find first trigger
 * findElement(container, { tokenType: ELEMENT_TYPES.TRIGGER })
 *
 * // Find reference or pinned token in wrapper
 * findElement(wrapper, { tokenType: [ELEMENT_TYPES.REFERENCE, ELEMENT_TYPES.PINNED] })
 *
 * // Find cursor spot before
 * findElement(wrapper, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_BEFORE })
 */
export function findElement(container: HTMLElement, options: TokenQueryOptions): HTMLElement | null {
  const selector = buildTokenSelector(options);
  return selector ? container.querySelector<HTMLElement>(selector) : null;
}

/**
 * Find all paragraph elements in the container
 * @param container The container element to search within
 * @returns Array of all paragraph elements
 */
export function findAllParagraphs(container: HTMLElement): HTMLParagraphElement[] {
  return Array.from(container.querySelectorAll<HTMLParagraphElement>('p'));
}
