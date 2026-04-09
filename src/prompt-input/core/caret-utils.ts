// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { ElementType } from './constants';
import { getTokenType, isCaretSpotType, isReferenceElementType } from './dom-utils';
import { isTextNode } from './type-guards';

// Module-level flag: mouse state is inherently global (one mouse per document)
// and must be accessible from the standalone normalizeSelection function.
let isMouseDown = false;

/** Updates the mouse-down tracking flag used to skip selection normalization during drag. */
export function setMouseDown(value: boolean): void {
  isMouseDown = value;
}

/** Returns whether the mouse is currently pressed. */
export function getMouseDown(): boolean {
  return isMouseDown;
}

/**
 * Checks whether a node is inside a reference element's internals or directly
 * on the contentEditable div (not inside a paragraph). These are non-typeable
 * positions where the caret should not rest.
 */
export function isNonTypeablePosition(node: Node | null): boolean {
  while (node) {
    if (node.nodeName === 'P') {
      return false;
    }
    if (isHTMLElement(node)) {
      if (isReferenceElementType(getTokenType(node))) {
        return true;
      }
      if (node.getAttribute('contenteditable') === 'true') {
        return true;
      }
    }
    node = node.parentNode;
  }
  return false;
}

/**
 * Finds the reference wrapper element that contains the given node, if any.
 * Returns null if the node is not inside a reference element.
 */
export function findContainingReference(node: Node | null): HTMLElement | null {
  while (node) {
    if (node.nodeName === 'P') {
      return null;
    }
    if (isHTMLElement(node) && isReferenceElementType(getTokenType(node))) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 * Moves a collapsed caret out of non-typeable positions into the parent paragraph.
 * Handles caret inside reference element internals (caret spots, token container)
 * and caret on the contentEditable div itself (clicking on padding).
 * Some browsers (notably Firefox) may place the caret in these positions on focus
 * or imprecise clicks.
 */
export function normalizeCollapsedCaret(selection: Selection | null): void {
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (!range.collapsed) {
    return;
  }

  const container = range.startContainer;

  // Walk up from the caret position to find a reference wrapper.
  let node: Node | null = isTextNode(container) ? container.parentElement : (container as HTMLElement);
  let wrapper: HTMLElement | null = null;
  let caretSpotType: ElementType | null = null;

  while (node && isHTMLElement(node)) {
    const tokenType = getTokenType(node);

    if (isCaretSpotType(tokenType)) {
      caretSpotType = tokenType as ElementType;
    }

    if (isReferenceElementType(tokenType)) {
      wrapper = node;
      break;
    }

    node = node.parentElement;
  }

  if (!wrapper) {
    return;
  }

  const paragraph = wrapper.parentElement;
  if (!paragraph) {
    return;
  }

  const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);

  // If we know the caret was in the before-spot, position before the wrapper.
  // Otherwise position after it (after-spot, token container, or wrapper itself).
  const newOffset = caretSpotType === ElementType.CaretSpotBefore ? wrapperIndex : wrapperIndex + 1;

  // Guard: skip if the selection is already at the target position.
  if (range.startContainer === paragraph && range.startOffset === newOffset) {
    return;
  }

  const newRange = (container.ownerDocument ?? document).createRange();
  newRange.setStart(paragraph, newOffset);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
}

/** Adjusts non-collapsed selection boundaries to exclude caret spot elements. */
export function normalizeSelection(selection: Selection | null, skipCaretSpots: boolean = false): void {
  if (!selection?.rangeCount) {
    return;
  }

  const range = selection.getRangeAt(0);

  if (range.collapsed || isMouseDown || skipCaretSpots) {
    return;
  }

  const normalizeBoundary = (container: Node) => {
    if (!isTextNode(container)) {
      return null;
    }

    const parent = container.parentElement;
    if (!parent) {
      return null;
    }

    const parentType = getTokenType(parent);
    if (!isCaretSpotType(parentType)) {
      return null;
    }

    const wrapper = parent.parentElement;
    if (!wrapper || !isReferenceElementType(getTokenType(wrapper))) {
      return null;
    }

    const paragraph = wrapper.parentElement;
    if (!paragraph) {
      return null;
    }

    const wrapperIndex = Array.from(paragraph.childNodes).indexOf(wrapper);
    const newOffset = parentType === ElementType.CaretSpotBefore ? wrapperIndex : wrapperIndex + 1;

    return { container: paragraph, offset: newOffset };
  };

  const normalizedStart = normalizeBoundary(range.startContainer);
  const normalizedEnd = normalizeBoundary(range.endContainer);

  if (!normalizedStart && !normalizedEnd) {
    return;
  }

  const newStartContainer = normalizedStart?.container ?? range.startContainer;
  const newStartOffset = normalizedStart?.offset ?? range.startOffset;
  const newEndContainer = normalizedEnd?.container ?? range.endContainer;
  const newEndOffset = normalizedEnd?.offset ?? range.endOffset;

  // Guard: skip if the selection already matches the normalized boundaries.
  // Prevents Safari from entering an infinite selectionchange loop in RTL.
  if (
    range.startContainer === newStartContainer &&
    range.startOffset === newStartOffset &&
    range.endContainer === newEndContainer &&
    range.endOffset === newEndOffset
  ) {
    return;
  }

  // Determine if the selection is backward (focus before anchor in document order).
  // Range always has start <= end, but the user may be selecting in reverse.
  const isBackward =
    selection.anchorNode === range.endContainer &&
    selection.anchorOffset === range.endOffset &&
    selection.focusNode === range.startContainer &&
    selection.focusOffset === range.startOffset;

  if (isBackward) {
    // Preserve backward direction: collapse to anchor (end), extend to focus (start)
    const anchorContainer = normalizedEnd?.container ?? range.endContainer;
    const anchorOffset = normalizedEnd?.offset ?? range.endOffset;
    const focusContainer = normalizedStart?.container ?? range.startContainer;
    const focusOffset = normalizedStart?.offset ?? range.startOffset;

    selection.collapse(anchorContainer, anchorOffset);
    selection.extend(focusContainer, focusOffset);
  } else {
    const updatedRange = (range.startContainer.ownerDocument ?? document).createRange();
    updatedRange.setStart(newStartContainer, newStartOffset);
    updatedRange.setEnd(newEndContainer, newEndOffset);
    selection.removeAllRanges();
    selection.addRange(updatedRange);
  }
}
