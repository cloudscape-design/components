// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ReactDOM from 'react-dom';

import Token from '../../token/internal';
import { PromptInputProps } from '../interfaces';

import styles from '../styles.css.js';

const TOKEN_DATA_PREFIX = 'data-token-';
const TOKEN_TYPE_ATTRIBUTE = `${TOKEN_DATA_PREFIX}type`;

/**
 * Creates a DOM element for a token with data attributes.
 */
function createTokenContainerElement(type: string, attributes: Record<string, string>): HTMLElement {
  const container = document.createElement('span');
  container.style.display = 'inline';
  container.contentEditable = 'false';
  container.setAttribute(TOKEN_TYPE_ATTRIBUTE, type);

  Object.entries(attributes).forEach(([key, value]) => {
    container.setAttribute(`${TOKEN_DATA_PREFIX}${key}`, value);
  });

  return container;
}

/**
 * Token renderer factory for different token types.
 */
const tokenRenderers: Record<
  PromptInputProps.InputToken['type'],
  (token: PromptInputProps.InputToken, target: HTMLElement, containers: Set<HTMLElement>) => void
> = {
  text: (token, target) => {
    if (token.type === 'text' && token.value) {
      target.appendChild(document.createTextNode(token.value));
    }
  },
  reference: (token, target, containers) => {
    if (token.type === 'reference') {
      const container = createTokenContainerElement('reference', {
        id: token.id,
        value: token.value,
      });
      target.appendChild(container);
      containers.add(container);
      ReactDOM.render(<Token key={token.id} variant="inline" label={token.label} value={token.value} />, container);
    }
  },
};

/**
 * Renders a mode token into a DOM element.
 */
function renderModeToken(mode: PromptInputProps.ModeToken, target: HTMLElement, containers: Set<HTMLElement>): void {
  const container = createTokenContainerElement('mode', {
    id: mode.id,
    value: mode.value,
  });
  target.appendChild(container);
  containers.add(container);
  ReactDOM.render(
    <Token key={mode.id} variant="inline" label={mode.label} value={mode.value} className={styles['mode-token']} />,
    container
  );
}

/**
 * Cleans up React components and DOM content from the target element.
 */
function cleanupDOM(targetElement: HTMLElement, reactContainers: Set<HTMLElement>): void {
  reactContainers.forEach(container => {
    try {
      ReactDOM.unmountComponentAtNode(container);
    } catch (error) {
      console.warn('Failed to unmount React component:', error);
    }
  });
  reactContainers.clear();
  targetElement.innerHTML = '';
}

/**
 * Ensures the contentEditable element can receive cursor at the end.
 * Adds an empty text node if the last child is an element node.
 */
function ensureCursorPlacement(targetElement: HTMLElement): void {
  if (targetElement.lastChild?.nodeType === Node.ELEMENT_NODE) {
    targetElement.appendChild(document.createTextNode(''));
  }
}

/**
 * Renders an array of tokens into a contentEditable element.
 * Handles both text tokens (as text nodes) and reference tokens (as React components).
 * Mode token is rendered separately at the beginning if provided.
 */
export function renderTokensToDOM(
  tokens: readonly PromptInputProps.InputToken[],
  mode: PromptInputProps.ModeToken | undefined,
  targetElement: HTMLElement,
  reactContainers: Set<HTMLElement>
): void {
  if (!targetElement || !(targetElement instanceof HTMLElement)) {
    throw new Error('Invalid target element provided to renderTokensToDOM');
  }

  cleanupDOM(targetElement, reactContainers);

  // Render mode token first if present
  if (mode) {
    renderModeToken(mode, targetElement, reactContainers);
  }

  // Render regular tokens
  tokens.forEach(token => {
    const renderer = tokenRenderers[token.type];
    if (renderer) {
      renderer(token, targetElement, reactContainers);
    } else {
      console.warn(`Unknown token type: ${token.type}`);
    }
  });

  ensureCursorPlacement(targetElement);
}

/**
 * Extracts all data-token-* attributes from an element.
 */
function extractTokenData(element: HTMLElement): Record<string, string> {
  return Array.from(element.attributes)
    .filter(attr => attr.name.startsWith(TOKEN_DATA_PREFIX))
    .reduce(
      (acc, attr) => {
        const key = attr.name.replace(TOKEN_DATA_PREFIX, '');
        acc[key] = attr.value;
        return acc;
      },
      {} as Record<string, string>
    );
}

/**
 * Token extractor factory for different token types.
 */
const tokenExtractors: Record<
  string,
  (element: HTMLElement, flushText: () => void) => PromptInputProps.InputToken | null
> = {
  reference: (element, flushText) => {
    flushText();
    const data = extractTokenData(element);
    return {
      type: 'reference',
      id: data.id || '',
      label: element.textContent || '',
      value: data.value || element.textContent || '',
    };
  },
};

/**
 * Extracts an array of tokens from a contentEditable DOM element.
 * Converts text nodes to TextInputToken and token elements to their respective types.
 */
export function domToTokenArray(element: HTMLElement): PromptInputProps.InputToken[] {
  if (!element || !(element instanceof HTMLElement)) {
    throw new Error('Invalid element provided to domToTokenArray');
  }

  const tokens: PromptInputProps.InputToken[] = [];
  let textBuffer = '';

  const flushTextBuffer = (): void => {
    if (textBuffer) {
      tokens.push({ type: 'text', value: textBuffer });
      textBuffer = '';
    }
  };

  const processNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      textBuffer += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tokenType = el.getAttribute(TOKEN_TYPE_ATTRIBUTE);

      if (tokenType === 'mode') {
        // Skip mode tokens - they're handled separately via the mode prop
        flushTextBuffer();
      } else if (tokenType && tokenExtractors[tokenType]) {
        const token = tokenExtractors[tokenType](el, flushTextBuffer);
        if (token) {
          tokens.push(token);
        }
      } else {
        // Recursively process children for non-token elements
        Array.from(node.childNodes).forEach(processNode);
      }
    }
  };

  Array.from(element.childNodes).forEach(processNode);
  flushTextBuffer();

  return tokens;
}

export function getPromptText(tokens: readonly PromptInputProps.InputToken[]): string {
  return tokens.map(token => token.value).join('');
}
