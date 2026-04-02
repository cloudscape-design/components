// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CaretController, getOwnerSelection } from '../core/caret-controller';

/**
 * Inserts text into a contentEditable element at a specific position.
 * After insertion, dispatches an input event so the token processor picks up
 * the change, then sets the desired caret position for the next render cycle.
 */
export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  caretStart: number,
  caretEnd: number | undefined,
  caretController: CaretController
): void {
  element.focus();

  const ownerDoc = element.ownerDocument ?? document;
  const insertPosition = caretStart ?? caretController.getPosition();
  caretController.setPosition(insertPosition);

  const selection = getOwnerSelection(element);
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.insertNode(ownerDoc.createTextNode(text));

  const finalPosition = caretEnd ?? insertPosition + text.length;

  // Notify the token processor of the DOM change
  element.dispatchEvent(new Event('input', { bubbles: true }));

  // Set the desired caret position AFTER handleInput has run (which calls cc.capture).
  // The token render effect's cc.restore() will use this position.
  caretController.setCapturedPosition(finalPosition);
}
