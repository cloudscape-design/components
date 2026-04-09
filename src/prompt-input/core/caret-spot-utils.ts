// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getOwnerSelection } from './caret-controller';
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
    const selection = getOwnerSelection(spot);
    if (selection?.rangeCount && spot.contains(selection.getRangeAt(0).startContainer)) {
      caretWasHere = true;
    }
  }

  const textNode = (spot.ownerDocument ?? document).createTextNode(extraText);
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

/** Extracts typed text from caret spots, moving it to the paragraph level. */
export function extractTextFromCaretSpots(
  portalContainers: Map<string, PortalContainer>,
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

  return { movedTextNode };
}
