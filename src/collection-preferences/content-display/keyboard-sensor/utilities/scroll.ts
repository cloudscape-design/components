// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { canUseDOM, getWindow, isDocument, isHTMLElement, isSVGElement } from '@dnd-kit/utilities';
import { ClientRect, getClientRect } from '@dnd-kit/core';

function isDocumentScrollingElement(element: Element | null) {
  if (!canUseDOM || !element) {
    return false;
  }

  return element === document.scrollingElement;
}

export function getScrollPosition(scrollingContainer: Element) {
  const minScroll = {
    x: 0,
    y: 0,
  };
  const dimensions = isDocumentScrollingElement(scrollingContainer)
    ? {
        height: window.innerHeight,
        width: window.innerWidth,
      }
    : {
        height: scrollingContainer.clientHeight,
        width: scrollingContainer.clientWidth,
      };
  const maxScroll = {
    x: scrollingContainer.scrollWidth - dimensions.width,
    y: scrollingContainer.scrollHeight - dimensions.height,
  };

  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;

  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll,
  };
}

export function getScrollElementRect(element: Element) {
  if (element === document.scrollingElement) {
    const { innerWidth, innerHeight } = window;

    return {
      top: 0,
      left: 0,
      right: innerWidth,
      bottom: innerHeight,
      width: innerWidth,
      height: innerHeight,
    };
  }

  const { top, left, right, bottom } = element.getBoundingClientRect();

  return {
    top,
    left,
    right,
    bottom,
    width: element.clientWidth,
    height: element.clientHeight,
  };
}

export function scrollIntoViewIfNeeded(
  element: HTMLElement | null | undefined,
  measure: (node: HTMLElement) => ClientRect = getClientRect
) {
  if (!element) {
    return;
  }

  const { top, left, bottom, right } = measure(element);
  const firstScrollableAncestor = getFirstScrollableAncestor(element);

  if (!firstScrollableAncestor) {
    return;
  }

  if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
    element.scrollIntoView({
      block: 'center',
      inline: 'center',
    });
  }
}

export function getScrollableAncestors(element: Node | null, limit?: number): Element[] {
  const scrollParents: Element[] = [];

  function findScrollableAncestors(node: Node | null): Element[] {
    if (limit !== null && limit !== undefined && scrollParents.length >= limit) {
      return scrollParents;
    }

    if (!node) {
      return scrollParents;
    }

    if (isDocument(node) && node.scrollingElement !== null && scrollParents.indexOf(node.scrollingElement) === -1) {
      scrollParents.push(node.scrollingElement);

      return scrollParents;
    }

    if (!isHTMLElement(node) || isSVGElement(node)) {
      return scrollParents;
    }

    if (scrollParents.indexOf(node) !== -1) {
      return scrollParents;
    }

    const computedStyle = getWindow(element).getComputedStyle(node);

    if (node !== element) {
      if (isScrollable(node, computedStyle)) {
        scrollParents.push(node);
      }
    }

    if (isFixed(node, computedStyle)) {
      return scrollParents;
    }

    return findScrollableAncestors(node.parentNode);
  }

  if (!element) {
    return scrollParents;
  }

  return findScrollableAncestors(element);
}

function getFirstScrollableAncestor(node: Node | null): Element | null {
  const [firstScrollableAncestor] = getScrollableAncestors(node, 1);

  return firstScrollableAncestor ?? null;
}

function isScrollable(
  element: HTMLElement,
  computedStyle: CSSStyleDeclaration = getWindow(element).getComputedStyle(element)
): boolean {
  const overflowRegex = /(auto|scroll|overlay)/;
  const properties = ['overflow', 'overflowX', 'overflowY'];

  return properties.some(property => {
    const value = computedStyle[property as keyof CSSStyleDeclaration];

    return typeof value === 'string' ? overflowRegex.test(value) : false;
  });
}

function isFixed(
  node: HTMLElement,
  computedStyle: CSSStyleDeclaration = getWindow(node).getComputedStyle(node)
): boolean {
  return computedStyle.position === 'fixed';
}
