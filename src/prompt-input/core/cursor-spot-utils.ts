// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ELEMENT_TYPES, SPECIAL_CHARS } from './constants';
import { findElements, insertAfter } from './dom-utils';

export interface CursorSpotExtractionResult {
  movedTextNode: Text | null;
}

/**
 * Extract text content from cursor spots and move it to the paragraph level.
 * This is used to handle text that was typed into cursor spots (before/after reference tokens).
 */
export function extractTextFromCursorSpots(
  paragraphs: HTMLElement[],
  trackCursor: boolean = true
): CursorSpotExtractionResult {
  let movedTextNode: Text | null = null;

  paragraphs.forEach((p: HTMLElement) => {
    const cursorSpots = findElements(p, {
      tokenType: [ELEMENT_TYPES.CURSOR_SPOT_BEFORE, ELEMENT_TYPES.CURSOR_SPOT_AFTER],
    });

    cursorSpots.forEach((spot: HTMLElement) => {
      const content = spot.textContent || '';
      const cleanContent = content.replace(new RegExp(SPECIAL_CHARS.ZWNJ, 'g'), '');

      if (cleanContent) {
        let cursorWasHere = false;
        if (trackCursor) {
          const selection = window.getSelection();
          if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            if (spot.contains(range.startContainer)) {
              cursorWasHere = true;
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

        if (cursorWasHere) {
          movedTextNode = textNode;
        }
      }

      spot.textContent = SPECIAL_CHARS.ZWNJ;
    });
  });

  return { movedTextNode };
}
