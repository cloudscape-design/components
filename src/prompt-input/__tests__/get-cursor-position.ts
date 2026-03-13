// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Test helper to get cursor position (matches cursor-controller.ts implementation)

export function getCursorPosition(element: HTMLElement): number {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    return 0;
  }

  const range = selection.getRangeAt(0);
  if (!element.contains(range.startContainer)) {
    return 0;
  }

  const paragraphs = Array.from(element.querySelectorAll('p'));
  if (paragraphs.length === 0) {
    return 0;
  }

  let position = 0;

  for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
    const p = paragraphs[pIndex];
    if (pIndex > 0) {
      position += 1;
    }

    if (!p.contains(range.startContainer)) {
      for (const child of Array.from(p.childNodes)) {
        position += getNodeLength(child);
      }
    } else {
      if (range.startContainer === p) {
        for (let i = 0; i < range.startOffset && i < p.childNodes.length; i++) {
          const childLength = getNodeLength(p.childNodes[i]);
          position += childLength;
        }
        break;
      }

      for (const child of Array.from(p.childNodes)) {
        const childContainsCursor = child === range.startContainer || child.contains(range.startContainer);

        if (childContainsCursor) {
          if (child.nodeType === Node.TEXT_NODE) {
            position += range.startOffset;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const el = child as HTMLElement;
            const tokenType = el.getAttribute('data-type');

            if (tokenType === 'trigger') {
              const triggerTextNode = el.childNodes[0];
              if (
                triggerTextNode &&
                triggerTextNode.nodeType === Node.TEXT_NODE &&
                triggerTextNode === range.startContainer
              ) {
                position += range.startOffset;
              }
            } else if (tokenType === 'reference' || tokenType === 'pinned') {
              // Check for cursor spots
              const cursorSpotBefore = el.querySelector('[data-type="cursor-spot-before"]');
              const cursorSpotAfter = el.querySelector('[data-type="cursor-spot-after"]');

              const cursorInBefore =
                cursorSpotBefore &&
                (cursorSpotBefore === range.startContainer || cursorSpotBefore.contains(range.startContainer));
              const cursorInAfter =
                cursorSpotAfter &&
                (cursorSpotAfter === range.startContainer || cursorSpotAfter.contains(range.startContainer));

              if (cursorInBefore) {
                const beforeContent = (cursorSpotBefore!.textContent || '').replace(/\u200c/g, '');
                if (beforeContent && range.startContainer.nodeType === Node.TEXT_NODE) {
                  position += range.startOffset;
                }
              } else if (cursorInAfter) {
                position += 1;
                const afterContent = (cursorSpotAfter!.textContent || '').replace(/\u200c/g, '');
                if (afterContent && range.startContainer.nodeType === Node.TEXT_NODE) {
                  const contentOffset = Math.max(0, range.startOffset - 1);
                  position += contentOffset;
                }
              } else {
                position += 1;
              }
            }
          }
          break;
        }
        position += getNodeLength(child);
      }
      break;
    }
  }

  return position;
}

function getNodeLength(node: Node): number {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.length || 0;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const type = el.getAttribute('data-type');
    if (type === 'trigger') {
      return el.textContent?.length || 0;
    }
    if (type === 'reference' || type === 'pinned') {
      return 1;
    }
  }
  return 0;
}
