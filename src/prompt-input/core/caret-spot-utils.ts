// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ElementType, SPECIAL_CHARS } from './constants';
import { findElements, insertAfter, stripZeroWidthCharacters } from './dom-utils';

export interface TextExtractionResult {
  movedTextNode: Text | null;
}

interface ExtractionTarget {
  /** Token types to search for */
  tokenTypes: string | string[];
  /** Filter to narrow which matched elements to process */
  filter?: (element: HTMLElement) => boolean;
  /** Extracts the text that should be moved out of the element */
  getExtraText: (element: HTMLElement) => string;
  /** The content to reset the element to after extraction */
  getResetContent: (element: HTMLElement) => string;
  /** Where to insert the extracted text relative to the element */
  insertPosition: (element: HTMLElement) => { mode: 'before' | 'after'; anchor: Node };
}

const CARET_SPOT_TARGET: ExtractionTarget = {
  tokenTypes: [ElementType.CaretSpotBefore, ElementType.CaretSpotAfter],
  getExtraText: spot => stripZeroWidthCharacters(spot.textContent || ''),
  getResetContent: () => SPECIAL_CHARS.ZERO_WIDTH_CHARACTER,
  insertPosition: spot => {
    const wrapper = spot.parentElement!;
    const isBefore = spot.getAttribute('data-type') === ElementType.CaretSpotBefore;
    return isBefore ? { mode: 'before', anchor: wrapper } : { mode: 'after', anchor: wrapper };
  },
};

const CANCELLED_TRIGGER_TARGET: ExtractionTarget = {
  tokenTypes: ElementType.Trigger,
  filter: el => !!el.id && el.id.endsWith('-cancelled'),
  getExtraText: trigger => (trigger.textContent || '').substring(1),
  getResetContent: trigger => (trigger.textContent || '').charAt(0),
  insertPosition: trigger => ({ mode: 'after', anchor: trigger }),
};

/**
 * Extracts typed text from special elements and moves it to the paragraph level.
 * Works for both caret spots (zero-width character containers around references)
 * and cancelled triggers (trigger spans that should only contain their trigger char).
 */
function extractTextFromElements(
  paragraphs: HTMLElement[],
  target: ExtractionTarget,
  trackCaret: boolean
): TextExtractionResult {
  let movedTextNode: Text | null = null;

  for (const p of paragraphs) {
    const elements = findElements(p, { tokenType: target.tokenTypes });

    for (const element of elements) {
      if (target.filter && !target.filter(element)) {
        continue;
      }

      const extraText = target.getExtraText(element);
      if (!extraText) {
        continue;
      }

      let caretWasHere = false;
      if (trackCaret) {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          if (element.contains(range.startContainer)) {
            caretWasHere = true;
          }
        }
      }

      const textNode = document.createTextNode(extraText);
      const { mode, anchor } = target.insertPosition(element);

      if (mode === 'before') {
        anchor.parentNode?.insertBefore(textNode, anchor);
      } else {
        insertAfter(textNode, anchor);
      }

      const resetContent = target.getResetContent(element);
      element.textContent = resetContent;

      if (caretWasHere) {
        movedTextNode = textNode;
      }
    }
  }

  return { movedTextNode };
}

/**
 * Extracts typed text from caret spots and cancelled triggers, moving it to the paragraph level.
 * @param paragraphs paragraph elements to scan
 * @param trackCaret whether to track which text node the caret was in
 */
export function extractTextFromCaretSpots(paragraphs: HTMLElement[], trackCaret: boolean = true): TextExtractionResult {
  const caretSpotResult = extractTextFromElements(paragraphs, CARET_SPOT_TARGET, trackCaret);
  const cancelledResult = extractTextFromElements(paragraphs, CANCELLED_TRIGGER_TARGET, trackCaret);

  // Return the most recent moved text node for caret positioning
  return { movedTextNode: cancelledResult.movedTextNode ?? caretSpotResult.movedTextNode };
}
