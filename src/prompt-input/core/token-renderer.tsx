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
// Reference tokens are rendered via React portals (ReactDOM.createPortal) from the parent
// component, keeping them in the same React tree for shared context and lifecycle. The
// token-renderer creates the DOM containers; the parent renders content into them.
//

import clsx from 'clsx';

import { getReactMajorVersion } from '../../internal/utils/react-version';
import { PromptInputProps } from '../interfaces';
import { ElementType, SPECIAL_CHARS } from './constants';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  getTokenType,
  isReferenceElementType,
} from './dom-utils';
import { isBreakTextToken, isReferenceToken, isTextToken, isTriggerToken } from './type-guards';

import styles from '../styles.css.js';

/** Whether the current React version supports token mode (React 18+). */
export const supportsTokenMode = getReactMajorVersion() >= 18;

/** A portal target — the DOM element where a reference token's React content is rendered via createPortal. */
export interface PortalContainer {
  /** Unique ID matching the token */
  id: string;
  /** The DOM element to render the portal into */
  element: HTMLElement;
  /** Label for the token */
  label: string;
  /** Value for the token */
  value: string;
  /** Menu ID the token was selected from */
  menuId?: string;
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

/** Creates an invisible span with a zero-width character to provide a valid caret position next to reference tokens. */
function createCaretSpot(type: string, ownerDoc: Document): HTMLSpanElement {
  const caretSpot = ownerDoc.createElement('span');
  caretSpot.setAttribute('data-type', type);
  caretSpot.setAttribute('contenteditable', 'true');
  caretSpot.setAttribute('aria-hidden', 'true');
  caretSpot.appendChild(ownerDoc.createTextNode(SPECIAL_CHARS.ZERO_WIDTH_CHARACTER));
  return caretSpot;
}

function createReferenceWithCaretSpots(
  token: PromptInputProps.ReferenceToken,
  portalContainers: Map<string, PortalContainer>,
  ownerDoc: Document
): HTMLSpanElement {
  const wrapper = ownerDoc.createElement('span');
  wrapper.className = styles['reference-wrapper'];
  wrapper.setAttribute('data-type', token.pinned ? ElementType.Pinned : ElementType.Reference);
  const instanceId = token.id;
  wrapper.id = instanceId;

  const caretSpotBefore = createCaretSpot(ElementType.CaretSpotBefore, ownerDoc);
  const element = ownerDoc.createElement('span');
  element.className = styles['token-container'];
  element.setAttribute('contenteditable', 'false');

  // Register the container for portal rendering by the parent component.
  portalContainers.set(instanceId, {
    id: instanceId,
    element,
    label: token.label,
    value: token.value,
    menuId: token.menuId,
  });

  const caretSpotAfter = createCaretSpot(ElementType.CaretSpotAfter, ownerDoc);

  wrapper.appendChild(caretSpotBefore);
  wrapper.appendChild(element);
  wrapper.appendChild(caretSpotAfter);

  return wrapper;
}

/**
 * Renders tokens into a contentEditable element using direct DOM manipulation.
 * Reference tokens are NOT rendered here — instead, their DOM containers are registered
 * in portalContainers for the parent component to render via ReactDOM.createPortal.
 */
export function renderTokensToDOM(
  tokens: readonly PromptInputProps.InputToken[],
  targetElement: HTMLElement,
  portalContainers: Map<string, PortalContainer>,
  existingTriggers?: Map<string, HTMLElement>,
  cancelledTriggerIds?: Set<string>
): {
  newTriggerElement: HTMLElement | null;
  lastReferenceWithCaretSpots: HTMLElement | null;
  triggerElements: Map<string, HTMLElement>;
} {
  // Preserve existing portal containers that are still in the DOM.
  const existingContainers = new Map<string, PortalContainer>();
  portalContainers.forEach((container, instanceId) => {
    if (container.element.isConnected && targetElement.contains(container.element)) {
      existingContainers.set(instanceId, container);
    }
  });
  portalContainers.clear();

  // Use the provided trigger map or start empty for the initial render.
  const reusableTriggers = new Map(existingTriggers ?? []);

  const existingParagraphs = findAllParagraphs(targetElement);
  const paragraphGroups = groupTokensIntoParagraphs(tokens);
  const ownerDoc = targetElement.ownerDocument ?? document;

  let newTriggerElement: HTMLElement | null = null;
  let lastReferenceWithCaretSpots: HTMLElement | null = null;
  const triggerElements = new Map<string, HTMLElement>();

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
          newNodes.push(ownerDoc.createTextNode(token.value));
        }
      } else if (isTriggerToken(token)) {
        let span: HTMLElement;
        const triggerId = token.id;
        const isNewTrigger = !reusableTriggers.has(triggerId);
        const hasFilterText = token.value.length > 0;
        const isCancelled = cancelledTriggerIds?.has(triggerId) ?? false;

        if (reusableTriggers.has(triggerId)) {
          span = reusableTriggers.get(triggerId)!;
          reusableTriggers.delete(triggerId);
        } else {
          span = ownerDoc.createElement('span');
          span.setAttribute('data-type', ElementType.Trigger);
          span.id = triggerId;
          span.setAttribute('data-id', triggerId);
        }

        const classes = clsx(styles['trigger-base'], hasFilterText && styles['trigger-token']);

        span.className = classes;
        span.textContent = token.triggerChar + token.value;

        newNodes.push(span);
        triggerElements.set(triggerId, span);

        if (isNewTrigger && !isCancelled) {
          newTriggerElement = span;
        }
      } else if (isReferenceToken(token)) {
        // Check if we can reuse an existing portal container.
        const existingContainer = token.id ? existingContainers.get(token.id) : undefined;
        if (existingContainer) {
          const existingWrapper = existingContainer.element.parentElement;
          if (existingWrapper) {
            const tokenType = getTokenType(existingWrapper);
            if (isReferenceElementType(tokenType)) {
              // Reuse existing container — update props in case they changed.
              existingContainer.label = token.label;
              existingContainer.value = token.value;
              existingContainer.menuId = token.menuId;
              portalContainers.set(token.id!, existingContainer);

              newNodes.push(existingWrapper);
              existingContainers.delete(token.id!);
              lastReferenceWithCaretSpots = existingWrapper;
              continue;
            }
          }
        }

        const wrapper = createReferenceWithCaretSpots(token, portalContainers, ownerDoc);
        newNodes.push(wrapper);
        lastReferenceWithCaretSpots = wrapper;
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

  return { newTriggerElement, lastReferenceWithCaretSpots, triggerElements };
}
