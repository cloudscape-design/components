// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CaretController, getOwnerSelection } from '../core/caret-controller';

/**
 * Inserts text into a contentEditable element at a specific position.
 * After insertion, dispatches an input event so the token processor picks up
 * the change, then positions the caret at `caretEnd` (or end of inserted text).
 * Finally dispatches `selectionchange` so `checkMenuState` can detect whether
 * the caret landed inside a trigger and open the menu accordingly.
 */
export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  caretStart: number,
  caretEnd: number | undefined,
  caretController: CaretController
): void {
  element.focus();

  const insertPosition = caretStart ?? caretController.getPosition();
  caretController.setPosition(insertPosition);

  const selection = getOwnerSelection(element);
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.insertNode(element.ownerDocument.createTextNode(text));

  const finalPosition = caretEnd ?? insertPosition + text.length;

  // Notify the token processor of the DOM change
  element.dispatchEvent(new Event('input', { bubbles: true }));

  // Position the caret — this may land inside a trigger element
  caretController.setPosition(finalPosition);

  // Trigger menu state detection via the selectionchange listener in useShortcutsEffects.
  element.ownerDocument.dispatchEvent(new Event('selectionchange'));
}
