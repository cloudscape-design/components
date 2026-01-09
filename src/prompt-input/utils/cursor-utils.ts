// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Utility class for managing cursor position and selection in contentEditable elements.
 * Handles the complexity of DOM tree walking and range manipulation.
 */
export class CursorManager {
  constructor(private element: HTMLElement) {}

  /**
   * Gets the current cursor position as a character offset from the start of the element.
   */
  getPosition(): number {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    const untilRange = document.createRange();
    untilRange.setStart(this.element, 0);
    untilRange.setEnd(range.startContainer, range.startOffset);

    return untilRange.toString().length;
  }

  /**
   * Sets the cursor position to a specific character offset.
   */
  setPosition(position: number): void {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const location = this.walkToPosition(position);

    if (!location) {
      // Position is beyond content, set cursor at end
      const range = document.createRange();
      range.selectNodeContents(this.element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    const range = document.createRange();
    range.setStart(location.node, location.offset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Sets a selection range from start to end positions.
   */
  setRange(start: number, end: number): void {
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const startLocation = this.walkToPosition(start);
    const endLocation = this.walkToPosition(end);

    if (!startLocation || !endLocation) {
      return;
    }

    const range = document.createRange();
    range.setStart(startLocation.node, startLocation.offset);
    range.setEnd(endLocation.node, endLocation.offset);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Walks the DOM tree to find the node and offset for a given character position.
   * Only counts text nodes that are NOT inside contentEditable=false elements.
   */
  private walkToPosition(position: number): { node: Node; offset: number } | null {
    const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node: Node) => {
        // Check if this text node is inside a contentEditable=false element
        let parent = node.parentElement;
        while (parent && parent !== this.element) {
          if (parent.contentEditable === 'false') {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let currentPos = 0;
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textLength = node.textContent?.length || 0;
      if (currentPos + textLength >= position) {
        const offset = position - currentPos;
        return { node, offset: Math.min(offset, textLength) };
      }
      currentPos += textLength;
    }

    return null;
  }
}

/**
 * Creates a CursorManager instance for the given element.
 */
export function createCursorManager(element: HTMLElement): CursorManager {
  return new CursorManager(element);
}
