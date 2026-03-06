// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { setCursorPosition } from '../core/cursor-manager';

export function insertTextIntoContentEditable(
  element: HTMLElement,
  text: string,
  cursorStart: number | undefined,
  cursorEnd: number | undefined
): void {
  element.focus();

  // Set cursor to insertion position
  if (cursorStart !== undefined) {
    setCursorPosition(element, cursorStart);
  }

  // Get current selection
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  // Create text node with ONLY the text passed to insertText
  const textNode = document.createTextNode(text);

  // Insert the node at the current cursor position
  range.insertNode(textNode);

  // Trigger input event to let handleInput() process the changes
  element.dispatchEvent(new Event('input', { bubbles: true }));

  // Set cursor position AFTER input event processing
  requestAnimationFrame(() => {
    if (cursorEnd !== undefined) {
      setCursorPosition(element, cursorEnd);
    } else {
      const insertPosition = cursorStart ?? 0;
      setCursorPosition(element, insertPosition + text.length);
    }
  });
}
