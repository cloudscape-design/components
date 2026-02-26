// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';

import Token from '../../token/internal';
import { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { isBreakToken, isBRElement, isReferenceToken, isTextNode, isTextToken, isTriggerToken } from './type-guards';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  findElement,
  findElements,
  generateTokenId,
  getTokenType,
  insertAfter,
} from './utils';

import styles from '../styles.css.js';

// REACT COMPONENT MANAGEMENT

const rootsMap = new Map<HTMLElement, any>();

function renderComponent(element: React.ReactElement, container: HTMLElement): void {
  if ('createRoot' in ReactDOM) {
    const ReactDOMClient = ReactDOM as any;
    let root = rootsMap.get(container);
    if (!root) {
      root = ReactDOMClient.createRoot(container);
      rootsMap.set(container, root);
    }
    root.render(element);
  } else {
    ReactDOM.render(element, container);
  }
}

export function unmountComponent(container: HTMLElement): void {
  const root = rootsMap.get(container);
  if (root && 'unmount' in root) {
    root.unmount();
    rootsMap.delete(container);
  } else {
    ReactDOM.unmountComponentAtNode(container);
  }
}

// DOM NORMALIZATION

function normalizeParagraphsAfterRender(element: HTMLElement): void {
  const paragraphs = findAllParagraphs(element);

  paragraphs.forEach(p => {
    moveCursorSpotContentToParagraph(p);
    removeLeadingBrowserBRs(p);
    removeOrphanedZWNJ(p);
    ensureEmptyParagraphsHaveTrailingBR(p);
    removeTrailingBRFromStart(p);
    removeMiddleTrailingBRs(p);
    ensureCursorSpotsInWrappers(p);
    ensureWrappersHaveAllParts(p);
    ensureCursorSpotsHaveZWNJ(p);
  });
}

function removeLeadingBrowserBRs(p: HTMLElement): void {
  while (isBRElement(p.firstChild)) {
    p.firstChild.remove();
  }
}

function removeOrphanedZWNJ(p: HTMLElement): void {
  Array.from(p.childNodes).forEach(node => {
    if (isTextNode(node) && node.textContent === SPECIAL_CHARS.ZWNJ) {
      node.remove();
    }
  });
}

function ensureEmptyParagraphsHaveTrailingBR(p: HTMLElement): void {
  if (p.childNodes.length === 0) {
    p.appendChild(createTrailingBreak());
  } else if (p.childNodes.length === 1 && isTextNode(p.firstChild) && !p.firstChild.textContent?.trim()) {
    p.innerHTML = '';
    p.appendChild(createTrailingBreak());
  }
}

function removeTrailingBRFromStart(p: HTMLElement): void {
  if (p.childNodes.length > 1 && isBRElement(p.firstChild, ELEMENT_TYPES.TRAILING_BREAK)) {
    p.firstChild.remove();
  }
}

function removeMiddleTrailingBRs(p: HTMLElement): void {
  const children = Array.from(p.childNodes);
  for (let i = 0; i < children.length - 1; i++) {
    const child = children[i];
    if (isBRElement(child, ELEMENT_TYPES.TRAILING_BREAK)) {
      child.remove();
    }
  }
}

function ensureCursorSpotsInWrappers(p: HTMLElement): void {
  findElements(p, { tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER] }).forEach(
    cursorSpot => {
      const parent = cursorSpot.parentElement;
      const parentType = parent ? getTokenType(parent) : null;
      if (!parent || (parentType !== ELEMENT_TYPES.REFERENCE && parentType !== ELEMENT_TYPES.PINNED)) {
        cursorSpot.remove();
      }
    }
  );
}

function ensureWrappersHaveAllParts(p: HTMLElement): void {
  findElements(p, { tokenType: [ELEMENT_TYPES.REFERENCE, ELEMENT_TYPES.PINNED] }).forEach(wrapper => {
    const cursorSpotBefore = findElement(wrapper, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_BEFORE });
    const cursorSpotAfter = findElement(wrapper, { tokenType: ELEMENT_TYPES.CURSOR_SPOT_AFTER });

    if (!cursorSpotBefore || !cursorSpotAfter) {
      wrapper.remove();
    }
  });
}

function ensureCursorSpotsHaveZWNJ(p: HTMLElement): void {
  findElements(p, { tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER] }).forEach(
    cursorSpot => {
      cursorSpot.innerHTML = '';
      cursorSpot.appendChild(document.createTextNode(SPECIAL_CHARS.ZWNJ));
    }
  );
}

function moveCursorSpotContentToParagraph(p: HTMLElement): void {
  findElements(p, { tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER] }).forEach(
    cursorSpot => {
      const wrapper = cursorSpot.parentElement;
      const wrapperType = wrapper ? getTokenType(wrapper) : null;
      if (!wrapper || (wrapperType !== ELEMENT_TYPES.REFERENCE && wrapperType !== ELEMENT_TYPES.PINNED)) {
        return;
      }

      const text = (cursorSpot.textContent || '').replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');
      if (!text) {
        return;
      }

      const isBefore = cursorSpot.getAttribute('data-type') === ELEMENT_TYPES.CURSOR_SPOT_BEFORE;
      const textNode = document.createTextNode(text);

      if (isBefore) {
        wrapper.parentElement?.insertBefore(textNode, wrapper);
      } else {
        insertAfter(textNode, wrapper);
      }

      cursorSpot.textContent = SPECIAL_CHARS.ZWNJ;

      // Cursor positioning is handled by unified restoration system in use-editable-tokens
    }
  );
}

// TOKEN GROUPING

interface ParagraphGroup {
  tokens: PromptInputProps.InputToken[];
}

function groupTokensIntoParagraphs(tokens: readonly PromptInputProps.InputToken[]): ParagraphGroup[] {
  if (tokens.length === 0) {
    return [{ tokens: [] }];
  }

  const paragraphs: ParagraphGroup[] = [];
  let currentParagraph: PromptInputProps.InputToken[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (isBreakToken(token)) {
      // Check if this is a leading break (at start or after other breaks)
      const isLeadingBreak = currentParagraph.length === 0;

      if (isLeadingBreak) {
        // Leading break = create empty paragraph
        paragraphs.push({ tokens: [] });
      } else {
        // Break after content = end current paragraph
        paragraphs.push({ tokens: currentParagraph });
        currentParagraph = [];
      }
    } else {
      // Non-break token = add to current paragraph
      currentParagraph.push(token);
    }
  }

  // Add final paragraph (always - could be empty from trailing break or have content)
  paragraphs.push({ tokens: currentParagraph });

  return paragraphs;
}

// CURSOR SPOT CREATION
function createCursorSpot(type: string): HTMLSpanElement {
  const cursorSpot = document.createElement('span');
  cursorSpot.setAttribute('data-type', type);
  cursorSpot.setAttribute('contenteditable', 'true');
  cursorSpot.setAttribute('aria-hidden', 'true');
  cursorSpot.appendChild(document.createTextNode(SPECIAL_CHARS.ZWNJ));
  return cursorSpot;
}

function createReferenceWithCursorSpots(
  token: PromptInputProps.ReferenceToken,
  reactContainers: Set<HTMLElement>,
  disabled: boolean,
  readOnly: boolean
): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.setAttribute('data-type', token.pinned ? ELEMENT_TYPES.PINNED : ELEMENT_TYPES.REFERENCE);
  const instanceId = token.id || generateTokenId('ref');
  wrapper.setAttribute('data-id', instanceId);
  wrapper.setAttribute('data-menu-id', token.menuId);

  const cursorSpotBefore = createCursorSpot(ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
  const container = document.createElement('span');
  container.className = styles['token-container'];
  container.setAttribute('contenteditable', 'false');

  reactContainers.add(container);
  renderComponent(
    <Token key={instanceId} variant="inline" label={token.label} disabled={disabled} readOnly={readOnly} />,
    container
  );
  const cursorSpotAfter = createCursorSpot(ELEMENT_TYPES.CURSOR_SPOT_AFTER);

  wrapper.appendChild(cursorSpotBefore);
  wrapper.appendChild(container);
  wrapper.appendChild(cursorSpotAfter);

  return wrapper;
}

// MAIN RENDERING

export function renderTokensToDOM(
  tokens: readonly PromptInputProps.InputToken[],
  targetElement: HTMLElement,
  reactContainers: Set<HTMLElement>,
  options?: {
    disabled?: boolean;
    readOnly?: boolean;
  }
): {
  newTriggerElement: HTMLElement | null;
  lastReferenceWithZwnj: HTMLElement | null;
} {
  const { disabled = false, readOnly = false } = options || {};
  const existingContainers = new Map<string, HTMLElement>();
  reactContainers.forEach(container => {
    const instanceId = container.getAttribute('data-id');
    if (instanceId && container.isConnected) {
      existingContainers.set(instanceId, container);
    } else if (container.isConnected) {
      unmountComponent(container);
    }
  });
  reactContainers.clear();

  // Track existing trigger elements to reuse them
  const existingTriggers = new Map<string, HTMLElement>();
  findElements(targetElement, { tokenType: ELEMENT_TYPES.TRIGGER }).forEach(el => {
    const id = el.getAttribute('data-id');
    if (id) {
      existingTriggers.set(id, el);
    }
  });

  const existingParagraphs = findAllParagraphs(targetElement);
  const paragraphGroups = groupTokensIntoParagraphs(tokens);

  let newTriggerElement: HTMLElement | null = null;
  let lastReferenceWithZwnj: HTMLElement | null = null;

  for (let pIndex = 0; pIndex < paragraphGroups.length; pIndex++) {
    const paragraphGroup = paragraphGroups[pIndex];
    let p: HTMLParagraphElement;

    if (pIndex < existingParagraphs.length) {
      p = existingParagraphs[pIndex];
      // Don't clear innerHTML - we'll do selective updates below
    } else {
      p = createParagraph();
      targetElement.appendChild(p);
    }

    // Build new content for this paragraph
    const newNodes: Node[] = [];

    for (let i = 0; i < paragraphGroup.tokens.length; i++) {
      const token = paragraphGroup.tokens[i];

      if (isTextToken(token)) {
        if (token.value) {
          newNodes.push(document.createTextNode(token.value));
        }
      } else if (isTriggerToken(token)) {
        let span: HTMLElement;
        const isNewTrigger = !token.id || !existingTriggers.has(token.id);

        if (token.id && existingTriggers.has(token.id)) {
          // Reuse existing trigger element and update its content
          span = existingTriggers.get(token.id)!;
          span.textContent = token.triggerChar + token.value;
          existingTriggers.delete(token.id);
        } else {
          // Create new trigger element
          span = document.createElement('span');
          span.setAttribute('data-type', ELEMENT_TYPES.TRIGGER);
          if (token.id) {
            span.setAttribute('data-id', token.id);
          }
          span.textContent = token.triggerChar + token.value;
        }

        newNodes.push(span);

        if (isNewTrigger) {
          newTriggerElement = span;
        }
      } else if (isReferenceToken(token)) {
        const existingWrapper = token.id ? existingContainers.get(token.id) : undefined;
        if (existingWrapper) {
          const tokenType = getTokenType(existingWrapper);
          if (tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED) {
            // Reuse existing wrapper - token props never change
            newNodes.push(existingWrapper);
            reactContainers.add(existingWrapper);
            existingContainers.delete(token.id!);
            lastReferenceWithZwnj = existingWrapper;
            continue;
          }
        }

        const wrapper = createReferenceWithCursorSpots(token, reactContainers, disabled, readOnly);
        newNodes.push(wrapper);
        lastReferenceWithZwnj = wrapper;
      }
    }

    if (newNodes.length === 0) {
      newNodes.push(createTrailingBreak());
    }

    // Efficiently update paragraph children by comparing with existing nodes
    const existingNodes = Array.from(p.childNodes);

    // Remove nodes that are no longer needed
    for (let i = newNodes.length; i < existingNodes.length; i++) {
      existingNodes[i].remove();
    }

    // Update or append nodes
    for (let i = 0; i < newNodes.length; i++) {
      const newNode = newNodes[i];
      const existingNode = existingNodes[i];

      if (existingNode === newNode) {
        // Node is already in the right position, skip
        continue;
      }

      if (existingNode) {
        // Replace existing node with new node
        p.replaceChild(newNode, existingNode);
      } else {
        // Append new node
        p.appendChild(newNode);
      }
    }
  }

  while (targetElement.children.length > paragraphGroups.length) {
    targetElement.removeChild(targetElement.lastChild!);
  }

  existingContainers.forEach(container => {
    if (container.isConnected) {
      unmountComponent(container);
    }
  });

  normalizeParagraphsAfterRender(targetElement);

  // Cursor restoration is handled by the unified system in use-editable-tokens

  return { newTriggerElement, lastReferenceWithZwnj };
}
