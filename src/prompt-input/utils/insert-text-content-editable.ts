// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CursorController } from '../core/cursor-controller';

/**
 * Inserts text into a contenteditable element at a specific position
 * Uses cursor controller for reliable positioning
 */
export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  cursorStart: number | undefined,
  cursorEnd: number | undefined,
  cursorController: CursorController
): void {
  element.focus();

  // Determine insert position
  const insertPosition = cursorStart ?? cursorController.getPosition();

  // Position cursor at insert point
  cursorController.setPosition(insertPosition);

  // Insert text at current selection
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);

  // Calculate final cursor position
  const finalPosition = cursorEnd ?? insertPosition + text.length;

  // Fire input event to trigger token extraction
  element.dispatchEvent(new Event('input', { bubbles: true }));

  // Position cursor at final position
  // The onChange handler uses flushSync to ensure DOM is updated before this runs
  cursorController.setPosition(finalPosition);
  document.dispatchEvent(new Event('selectionchange'));
}
