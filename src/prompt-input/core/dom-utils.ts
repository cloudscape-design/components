// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ELEMENT_TYPES } from './constants';

import styles from '../styles.css.js';

export function getTokenType(element: HTMLElement): string | null {
  return element.getAttribute('data-type');
}

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

export function generateTokenId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

interface TokenQueryOptions {
  tokenType?: string | string[];
  tokenId?: string;
}

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

export function findElements(container: HTMLElement, options: TokenQueryOptions): HTMLElement[] {
  const selector = buildTokenSelector(options);
  return selector ? Array.from(container.querySelectorAll<HTMLElement>(selector)) : [];
}

export function findElement(container: HTMLElement, options: TokenQueryOptions): HTMLElement | null {
  const selector = buildTokenSelector(options);
  return selector ? container.querySelector<HTMLElement>(selector) : null;
}

export function findAllParagraphs(container: HTMLElement): HTMLParagraphElement[] {
  return Array.from(container.querySelectorAll<HTMLParagraphElement>('p'));
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

export function hasOnlyTrailingBR(paragraph: HTMLElement): boolean {
  return paragraph.childNodes.length === 1 && paragraph.firstChild?.nodeName === 'BR';
}

export function isEmptyState(element: HTMLElement): boolean {
  const paragraphs = findAllParagraphs(element);
  return paragraphs.length === 0 || (paragraphs.length === 1 && hasOnlyTrailingBR(paragraphs[0]));
}

export function ensureValidEmptyState(element: HTMLElement): void {
  const paragraphs = findAllParagraphs(element);

  if (paragraphs.length === 0) {
    const p = createParagraph();
    p.appendChild(createTrailingBreak());
    element.appendChild(p);
  } else if (paragraphs.length === 1) {
    const p = paragraphs[0];

    if (hasOnlyTrailingBR(p)) {
      return;
    }

    while (p.firstChild) {
      p.removeChild(p.firstChild);
    }
    p.appendChild(createTrailingBreak());
  } else {
    while (paragraphs.length > 1) {
      paragraphs[paragraphs.length - 1].remove();
      paragraphs.pop();
    }
    const p = paragraphs[0];
    while (p.firstChild) {
      p.removeChild(p.firstChild);
    }
    p.appendChild(createTrailingBreak());
  }
}
