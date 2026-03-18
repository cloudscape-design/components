// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

//
// Token Renderer — Direct DOM manipulation for contentEditable
//
// This module renders tokens (text, triggers, references) into a contentEditable element
// using direct DOM operations instead of React's declarative rendering. This approach is
// necessary because:
//
// 1. React's reconciliation conflicts with contentEditable. When the user types, the browser
//    mutates the DOM directly. React expects to own the DOM and would overwrite user input
//    on the next render, causing cursor jumps and lost keystrokes.
//
// 2. Reference tokens are atomic inline elements (rendered via React portals into <span>
//    containers) surrounded by caret spots (zero-width characters). This structure requires
//    precise DOM control that React's diffing algorithm cannot provide — it would merge
//    adjacent text nodes, remove "empty" spans, or reorder elements unpredictably.
//
// 3. Cursor positioning depends on exact DOM node identity. React may replace a text node
//    with an equivalent one during reconciliation, which resets the browser's caret position.
//    By managing DOM nodes directly, we preserve node identity across renders.
//
// The renderer is decoupled from specific component implementations — it accepts a
// `renderToken` callback to render reference tokens, allowing the visual representation
// to be customized or tested independently (similar to how Table's sticky columns and
// grid navigation features are implemented as abstract utilities).
//

import React from 'react';
// Import from react-dom/client (React 18+).
// For React 16/17 environments, the jest config and webpack alias replace this import
// with a compatibility stub (src/internal/vendor/react-dom-client-stub.ts) that provides
// a no-op createRoot.
// @ts-expect-error - react-dom/client only exists in React 18+, aliased to stub in React 16/17
import { createRoot, Root } from 'react-dom/client';

import { PromptInputProps } from '../interfaces';
import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  findElements,
  generateTokenId,
  getTokenType,
  isReferenceElementType,
} from './dom-utils';
import { isBreakTextToken, isReferenceToken, isTextToken, isTriggerToken } from './type-guards';

import styles from '../styles.css.js';

const rootsMap = new Map<HTMLElement, Root>();

/** Props passed to the renderToken callback for rendering reference tokens. */
export interface RenderTokenProps {
  id: string;
  label: string;
  disabled: boolean;
  readOnly: boolean;
}

function renderComponent(element: React.ReactElement, container: HTMLElement): void {
  let root = rootsMap.get(container);
  if (!root) {
    root = createRoot(container);
    rootsMap.set(container, root);
  }

  root.render(element);
}

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

    if (isBreakTextToken(token)) {
      const isLeadingBreak = currentParagraph.length === 0;

      if (isLeadingBreak) {
        paragraphs.push({ tokens: [] });
      } else {
        paragraphs.push({ tokens: currentParagraph });
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(token);
    }
  }

  paragraphs.push({ tokens: currentParagraph });

  return paragraphs;
}

/** Creates an invisible span with a ZWNJ character to provide a valid caret position next to reference tokens. */
function createCaretSpot(type: string): HTMLSpanElement {
  const caretSpot = document.createElement('span');
  caretSpot.setAttribute('data-type', type);
  caretSpot.setAttribute('contenteditable', 'true');
  caretSpot.appendChild(document.createTextNode(SPECIAL_CHARS.ZWNJ));
  return caretSpot;
}

function createReferenceWithCaretSpots(
  token: PromptInputProps.ReferenceToken,
  reactContainers: Map<string, HTMLElement>,
  renderToken: (props: RenderTokenProps) => React.ReactElement
): HTMLSpanElement {
  const wrapper = document.createElement('span');
  wrapper.setAttribute('data-type', token.pinned ? ELEMENT_TYPES.PINNED : ELEMENT_TYPES.REFERENCE);
  const instanceId = token.id && token.id !== '' ? token.id : generateTokenId();
  wrapper.id = instanceId;
  wrapper.setAttribute('data-menu-id', token.menuId);

  const caretSpotBefore = createCaretSpot(ELEMENT_TYPES.CURSOR_SPOT_BEFORE);
  const container = document.createElement('span');
  container.className = styles['token-container'];
  container.setAttribute('contenteditable', 'false');

  reactContainers.set(instanceId, container);
  renderComponent(renderToken({ id: instanceId, label: token.label, disabled: false, readOnly: false }), container);
  const caretSpotAfter = createCaretSpot(ELEMENT_TYPES.CURSOR_SPOT_AFTER);

  wrapper.appendChild(caretSpotBefore);
  wrapper.appendChild(container);
  wrapper.appendChild(caretSpotAfter);

  return wrapper;
}

/**
 * Renders tokens into a contentEditable element using direct DOM manipulation.
 * @param tokens token array to render
 * @param targetElement the contentEditable container
 * @param reactContainers map tracking React portal containers by token ID
 * @param renderToken callback to render reference tokens as React elements
 */
export function renderTokensToDOM(
  tokens: readonly PromptInputProps.InputToken[],
  targetElement: HTMLElement,
  reactContainers: Map<string, HTMLElement>,
  renderToken: (props: RenderTokenProps) => React.ReactElement
): {
  newTriggerElement: HTMLElement | null;
  lastReferenceWithZwnj: HTMLElement | null;
} {
  const existingContainers = new Map<string, HTMLElement>();
  reactContainers.forEach((container, instanceId) => {
    if (container.isConnected && targetElement.contains(container)) {
      existingContainers.set(instanceId, container);
    }
  });
  reactContainers.clear();

  const existingTriggers = new Map<string, HTMLElement>();
  findElements(targetElement, { tokenType: ELEMENT_TYPES.TRIGGER }).forEach(el => {
    const id = el.id;
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
    } else {
      p = createParagraph();
      targetElement.appendChild(p);
    }

    const newNodes: Node[] = [];

    for (let i = 0; i < paragraphGroup.tokens.length; i++) {
      const token = paragraphGroup.tokens[i];

      if (isTextToken(token)) {
        if (token.value) {
          newNodes.push(document.createTextNode(token.value));
        }
      } else if (isTriggerToken(token)) {
        let span: HTMLElement;
        const triggerId = token.id && token.id !== '' ? token.id : generateTokenId();
        const isNewTrigger = !existingTriggers.has(triggerId);
        const hasFilterText = token.value.length > 0;

        if (existingTriggers.has(triggerId)) {
          span = existingTriggers.get(triggerId)!;
          span.textContent = token.triggerChar + token.value;
          span.className = hasFilterText ? styles['trigger-token'] : '';
          existingTriggers.delete(triggerId);
        } else {
          span = document.createElement('span');
          span.setAttribute('data-type', ELEMENT_TYPES.TRIGGER);
          span.className = hasFilterText ? styles['trigger-token'] : '';
          span.id = triggerId;
          span.setAttribute('data-id', triggerId);
          span.textContent = token.triggerChar + token.value;
        }

        newNodes.push(span);

        if (isNewTrigger) {
          newTriggerElement = span;
        }
      } else if (isReferenceToken(token)) {
        const existingContainer = token.id ? existingContainers.get(token.id) : undefined;
        if (existingContainer) {
          const existingWrapper = existingContainer.parentElement;
          if (existingWrapper) {
            const tokenType = getTokenType(existingWrapper);
            if (isReferenceElementType(tokenType)) {
              reactContainers.set(token.id!, existingContainer);

              newNodes.push(existingWrapper);
              existingContainers.delete(token.id!);
              lastReferenceWithZwnj = existingWrapper;
              continue;
            }
          }
        }

        const wrapper = createReferenceWithCaretSpots(token, reactContainers, renderToken);
        newNodes.push(wrapper);
        lastReferenceWithZwnj = wrapper;
      }
    }

    if (newNodes.length === 0) {
      newNodes.push(createTrailingBreak());
    }

    const existingNodes = Array.from(p.childNodes);

    let nodesMatch = existingNodes.length === newNodes.length;
    if (nodesMatch) {
      for (let i = 0; i < newNodes.length; i++) {
        if (existingNodes[i] !== newNodes[i]) {
          nodesMatch = false;
          break;
        }
      }
    }

    if (nodesMatch) {
      continue;
    }

    for (let i = newNodes.length; i < existingNodes.length; i++) {
      existingNodes[i].remove();
    }

    for (let i = 0; i < newNodes.length; i++) {
      const newNode = newNodes[i];
      const existingNode = existingNodes[i];

      if (existingNode === newNode) {
        continue;
      }

      if (existingNode && newNodes.includes(existingNode)) {
        if (i < p.childNodes.length) {
          p.insertBefore(newNode, p.childNodes[i]);
        } else {
          p.appendChild(newNode);
        }
      } else if (existingNode) {
        p.replaceChild(newNode, existingNode);
      } else {
        p.appendChild(newNode);
      }
    }
  }

  while (targetElement.children.length > paragraphGroups.length) {
    targetElement.removeChild(targetElement.lastChild!);
  }

  return { newTriggerElement, lastReferenceWithZwnj };
}
