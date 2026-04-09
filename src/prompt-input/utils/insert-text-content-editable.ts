// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { isHTMLElement } from '../../internal/utils/dom';
import { CaretController, getOwnerSelection } from '../core/caret-controller';
import {
  createParagraph,
  createTrailingBreak,
  findAllParagraphs,
  isElementEffectivelyEmpty,
  scrollCaretIntoView,
} from '../core/dom-utils';

/**
 * Inserts text into a contentEditable element at a specific position.
 * Handles multiline text by splitting into paragraphs at \n boundaries.
 *
 * @param replaceSelection When true, deletes the current selection before
 *   inserting. Fully-selected paragraphs are removed entirely to avoid
 *   leaving empty shells. Used internally by the paste handler.
 */
export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  caretStart: number | undefined,
  caretEnd: number | undefined,
  caretController: CaretController,
  replaceSelection = false
): void {
  element.focus();

  const ownerDoc = element.ownerDocument ?? document;

  if (replaceSelection) {
    const sel = getOwnerSelection(element);
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0);
      if (!range.collapsed) {
        range.deleteContents();

        // Remove empty paragraph shells left by deleteContents.
        // If all paragraphs are empty, clear the element entirely.
        const remaining = findAllParagraphs(element);
        const allEmpty = remaining.every(p => isElementEffectivelyEmpty(p));
        if (allEmpty) {
          element.textContent = '';
        } else {
          for (const p of remaining) {
            if (isElementEffectivelyEmpty(p)) {
              p.remove();
            }
          }
        }
      }
    }
  }

  const insertPosition = caretStart ?? caretController.getPosition();
  caretController.setPosition(insertPosition);

  // Re-read selection after setPosition — it creates a fresh range
  const selection = getOwnerSelection(element);
  if (!selection?.rangeCount) {
    return;
  }

  const lines = text.split('\n');

  if (lines.length === 1) {
    const range = selection.getRangeAt(0);
    range.insertNode(ownerDoc.createTextNode(text));
  } else {
    const range = selection.getRangeAt(0);
    const startContainer = isHTMLElement(range.startContainer)
      ? range.startContainer
      : range.startContainer.parentElement;
    let currentP = startContainer ? findUpUntil(startContainer, node => node.nodeName === 'P') : null;

    if (!currentP) {
      currentP = createParagraph(ownerDoc);
      element.appendChild(currentP);
      const newRange = ownerDoc.createRange();
      newRange.setStart(currentP, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    if (lines[0]) {
      const insertRange = selection.getRangeAt(0);
      const textNode = ownerDoc.createTextNode(lines[0]);
      insertRange.insertNode(textNode);
      const afterRange = ownerDoc.createRange();
      afterRange.setStartAfter(textNode);
      afterRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(afterRange);
    }

    // Extract trailing content after the caret in the current paragraph
    const splitRange = ownerDoc.createRange();
    const sel = getOwnerSelection(element);
    if (sel?.rangeCount) {
      const currentRange = sel.getRangeAt(0);
      splitRange.setStart(currentRange.endContainer, currentRange.endOffset);
    } else {
      splitRange.setStart(currentP, currentP.childNodes.length);
    }
    splitRange.setEndAfter(currentP.lastChild || currentP);
    const trailingContent = splitRange.extractContents();

    let lastP = currentP;
    for (let i = 1; i < lines.length - 1; i++) {
      const newP = createParagraph(ownerDoc);
      if (lines[i]) {
        newP.appendChild(ownerDoc.createTextNode(lines[i]));
      } else {
        newP.appendChild(createTrailingBreak(ownerDoc));
      }
      lastP.parentNode?.insertBefore(newP, lastP.nextSibling);
      lastP = newP;
    }

    // Strip trailing breaks from extracted content
    for (const child of Array.from(trailingContent.childNodes)) {
      if (child.nodeName === 'BR') {
        child.remove();
      }
    }

    const finalP = createParagraph(ownerDoc);
    const lastLine = lines[lines.length - 1];
    if (lastLine) {
      finalP.appendChild(ownerDoc.createTextNode(lastLine));
    }
    finalP.appendChild(trailingContent);
    if (isElementEffectivelyEmpty(finalP)) {
      finalP.appendChild(createTrailingBreak(ownerDoc));
    }
    lastP.parentNode?.insertBefore(finalP, lastP.nextSibling);

    if (isElementEffectivelyEmpty(currentP)) {
      currentP.appendChild(createTrailingBreak(ownerDoc));
    }
  }

  selection.collapseToEnd();

  const finalPosition = caretEnd ?? insertPosition + text.length;

  element.dispatchEvent(new Event('input', { bubbles: true }));

  // Position the caret directly after the render effect has run.
  // setCapturedPosition can't be used here because React 18 may commit
  // the render effect synchronously during dispatchEvent, before we
  // get a chance to set the captured position.
  caretController.setPosition(finalPosition);
  scrollCaretIntoView(element);
}
