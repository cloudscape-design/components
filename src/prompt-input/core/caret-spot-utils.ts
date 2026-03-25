// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ElementType, SPECIAL_CHARS } from './constants';
import { insertAfter, stripZeroWidthCharacters } from './dom-utils';
import { PortalContainer } from './token-renderer';

export interface TextExtractionResult {
  movedTextNode: Text | null;
}

/** Extracts typed text from a caret-spot, moving it to the paragraph level. */
function extractFromSpot(spot: HTMLElement, trackCaret: boolean): Text | null {
  const extraText = stripZeroWidthCharacters(spot.textContent || '');
  if (!extraText) {
    return null;
  }

  let caretWasHere = false;
  if (trackCaret) {
    const selection = window.getSelection();
    if (selection?.rangeCount && spot.contains(selection.getRangeAt(0).startContainer)) {
      caretWasHere = true;
    }
  }

  const textNode = document.createTextNode(extraText);
  const wrapper = spot.parentElement!;
  const isBefore = spot.getAttribute('data-type') === ElementType.CaretSpotBefore;

  if (isBefore) {
    wrapper.parentNode?.insertBefore(textNode, wrapper);
  } else {
    insertAfter(textNode, wrapper);
  }

  spot.textContent = SPECIAL_CHARS.ZERO_WIDTH_CHARACTER;
  return caretWasHere ? textNode : null;
}

/** Extracts typed text from a cancelled trigger, moving filter text to the paragraph level. */
function extractFromCancelledTrigger(trigger: HTMLElement, trackCaret: boolean): Text | null {
  if (!trigger.id?.endsWith('-cancelled')) {
    return null;
  }

  const filterText = (trigger.textContent || '').substring(1);
  if (!filterText) {
    return null;
  }

  let caretWasHere = false;
  if (trackCaret) {
    const selection = window.getSelection();
    if (selection?.rangeCount && trigger.contains(selection.getRangeAt(0).startContainer)) {
      caretWasHere = true;
    }
  }

  const textNode = document.createTextNode(filterText);
  insertAfter(textNode, trigger);
  trigger.textContent = (trigger.textContent || '').charAt(0);

  return caretWasHere ? textNode : null;
}

/**
 * Extracts typed text from caret spots and cancelled triggers, moving it to the paragraph level.
 * Derives caret-spot elements from portal containers and trigger element maps — no DOM queries.
 */
export function extractTextFromCaretSpots(
  portalContainers: Map<string, PortalContainer>,
  triggerElements: Map<string, HTMLElement>,
  trackCaret: boolean
): TextExtractionResult {
  let movedTextNode: Text | null = null;

  for (const container of portalContainers.values()) {
    const wrapper = container.element.parentElement;
    if (!wrapper) {
      continue;
    }
    for (const child of Array.from(wrapper.children)) {
      const type = child.getAttribute('data-type');
      if (type === ElementType.CaretSpotBefore || type === ElementType.CaretSpotAfter) {
        const result = extractFromSpot(child as HTMLElement, trackCaret);
        if (result) {
          movedTextNode = result;
        }
      }
    }
  }

  for (const trigger of triggerElements.values()) {
    const result = extractFromCancelledTrigger(trigger, trackCaret);
    if (result) {
      movedTextNode = result;
    }
  }

  return { movedTextNode };
}
