// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { findElements, insertAfter, stripZWNJ } from './dom-utils';

export interface CaretSpotExtractionResult {
  movedTextNode: Text | null;
}

/**
 * Extracts typed text from caret spots and moves it to the paragraph level.
 * @param paragraphs paragraph elements to scan for caret spots
 * @param trackCaret whether to track which text node the caret was in
 */
export function extractTextFromCaretSpots(
  paragraphs: HTMLElement[],
  trackCaret: boolean = true
): CaretSpotExtractionResult {
  let movedTextNode: Text | null = null;

  paragraphs.forEach((p: HTMLElement) => {
    const cursorSpots = findElements(p, {
      tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER],
    });

    cursorSpots.forEach((spot: HTMLElement) => {
      const content = spot.textContent || '';
      const cleanContent = stripZWNJ(content);

      if (cleanContent) {
        let caretWasHere = false;
        if (trackCaret) {
          const selection = window.getSelection();
          if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            if (spot.contains(range.startContainer)) {
              caretWasHere = true;
            }
          }
        }

        const textNode = document.createTextNode(cleanContent);
        const wrapper = spot.parentElement;

        if (wrapper) {
          if (spot.getAttribute('data-type') === ELEMENT_TYPES.CURSOR_SPOT_BEFORE) {
            wrapper.parentNode?.insertBefore(textNode, wrapper);
          } else {
            insertAfter(textNode, wrapper);
          }
        }

        if (caretWasHere) {
          movedTextNode = textNode;
        }
      }

      spot.textContent = SPECIAL_CHARS.ZWNJ;
    });
  });

  return { movedTextNode };
}
