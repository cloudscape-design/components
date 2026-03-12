// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// Import from react-dom/client (React 18+)
// For React 16/17 environments, webpack alias will replace this with the compatibility stub
// @ts-expect-error - react-dom/client only exists in React 18+, aliased to stub in React 16/17
import { createRoot, Root } from 'react-dom/client';

import Token from '../../token/internal';
import { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  findElement,
  findElements,
  generateTokenId,
  getTokenType,
  insertAfter,
} from './dom-utils';
import { isBreakToken, isBRElement, isReferenceToken, isTextNode, isTextToken, isTriggerToken } from './type-guards';

import styles from '../styles.css.js';

// REACT COMPONENT MANAGEMENT

const rootsMap = new Map<HTMLElement, Root>();

function renderComponent(element: React.ReactElement, container: HTMLElement): void {
  let root = rootsMap.get(container);
  if (!root) {
    root = createRoot(container);
    rootsMap.set(container, root);
  }

  // Render synchronously to avoid timing issues with prop updates
  root.render(element);
}

export function unmountComponent(container: HTMLElement): void {
  const root = rootsMap.get(container);
  if (root) {
    root.unmount();
    rootsMap.delete(container);
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
  const instanceId = token.id && token.id !== '' ? token.id : generateTokenId('ref');
  wrapper.id = instanceId; // Set id on wrapper so it can be extracted later
  wrapper.setAttribute('data-menu-id', token.menuId);

  const cursorSpotBefore = createCursorSpot(ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
  const container = document.createElement('span');
  container.className = styles['token-container'];
  container.setAttribute('contenteditable', 'false');
  container.setAttribute('data-id', instanceId); // Also keep data-id on container for React key

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
    // Only include containers that are descendants of this targetElement
    if (instanceId && container.isConnected && targetElement.contains(container)) {
      existingContainers.set(instanceId, container);
    }
  });
  reactContainers.clear();

  // Track existing trigger elements to reuse them
  const existingTriggers = new Map<string, HTMLElement>();
  findElements(targetElement, { tokenType: ELEMENT_TYPES.TRIGGER }).forEach(el => {
    const id = el.id; // Use standard id attribute
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
        const triggerId = token.id && token.id !== '' ? token.id : generateTokenId('trigger');
        const isNewTrigger = !existingTriggers.has(triggerId);
        const hasFilterText = token.value.length > 0;

        if (existingTriggers.has(triggerId)) {
          // Reuse existing trigger element and update its content
          span = existingTriggers.get(triggerId)!;
          span.textContent = token.triggerChar + token.value;
          // Set class only when there's filter text
          span.className = hasFilterText ? styles['trigger-token'] : '';
          existingTriggers.delete(triggerId);
        } else {
          // Create new trigger element
          span = document.createElement('span');
          span.setAttribute('data-type', ELEMENT_TYPES.TRIGGER);
          // Set class only when there's filter text
          span.className = hasFilterText ? styles['trigger-token'] : '';
          span.id = triggerId; // Use standard id attribute for dropdown anchoring
          span.textContent = token.triggerChar + token.value;
        }

        newNodes.push(span);

        if (isNewTrigger) {
          newTriggerElement = span;
        }
      } else if (isReferenceToken(token)) {
        const existingContainer = token.id ? existingContainers.get(token.id) : undefined;
        if (existingContainer) {
          // Get the wrapper from the container (container.parentElement should be the wrapper)
          const existingWrapper = existingContainer.parentElement;
          if (existingWrapper) {
            const tokenType = getTokenType(existingWrapper);
            if (tokenType === ELEMENT_TYPES.REFERENCE || tokenType === ELEMENT_TYPES.PINNED) {
              // Reuse existing wrapper completely - don't re-render React component
              reactContainers.add(existingContainer); // Keep tracking the container

              newNodes.push(existingWrapper);
              existingContainers.delete(token.id!);
              lastReferenceWithZwnj = existingWrapper;
              continue;
            }
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

    // Check if nodes are already in the correct order
    let nodesMatch = existingNodes.length === newNodes.length;
    if (nodesMatch) {
      for (let i = 0; i < newNodes.length; i++) {
        if (existingNodes[i] !== newNodes[i]) {
          nodesMatch = false;
          break;
        }
      }
    }

    // Skip DOM manipulation if nodes are already correct
    if (nodesMatch) {
      continue;
    }

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

      // Check if existingNode was moved (is now in newNodes at a different position)
      if (existingNode && newNodes.includes(existingNode)) {
        // Don't replace - the existing node was moved elsewhere
        // Just append the new node
        if (i < p.childNodes.length) {
          p.insertBefore(newNode, p.childNodes[i]);
        } else {
          p.appendChild(newNode);
        }
      } else if (existingNode) {
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

  normalizeParagraphsAfterRender(targetElement);

  return { newTriggerElement, lastReferenceWithZwnj };
}
