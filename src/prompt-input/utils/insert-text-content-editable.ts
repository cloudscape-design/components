// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { CaretController } from '../core/caret-controller';
import { ElementType } from '../core/constants';
import { getTokenType } from '../core/dom-utils';
import { isTextNode } from '../core/type-guards';

/**
 * Inserts text into a contentEditable element at a specific position.
 * @param caretStart logical position to insert at (defaults to current caret)
 * @param caretEnd logical position to place caret after insertion
 */
export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  caretStart: number | undefined,
  caretEnd: number | undefined,
  caretController: CaretController
): void {
  element.focus();

  const insertPosition = caretStart ?? caretController.getPosition();

  caretController.setPosition(insertPosition);

  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  const finalPosition = caretEnd ?? insertPosition + text.length;

  element.dispatchEvent(new Event('input', { bubbles: true }));

  requestAnimationFrame(() => {
    caretController.setPosition(finalPosition);

    if (!caretController.findActiveTrigger()) {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;

        if (isTextNode(container) && range.startOffset === 0) {
          const prevSibling = container.previousSibling;
          if (isHTMLElement(prevSibling) && getTokenType(prevSibling) === ElementType.Trigger) {
            const triggerText = prevSibling.textContent || '';
            const triggerTextNode = prevSibling.childNodes[0];
            if (isTextNode(triggerTextNode)) {
              range.setStart(triggerTextNode, triggerText.length);
              range.collapse(true);
            }
          }
        }
      }
    }

    document.dispatchEvent(new Event('selectionchange'));
  });
}
