// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

export function isContainingBlock(element: HTMLElement): boolean {
  const computedStyle = getComputedStyle(element);
  return (
    (!!computedStyle.transform && computedStyle.transform !== 'none') ||
    (!!computedStyle.perspective && computedStyle.perspective !== 'none') ||
    computedStyle.contain?.split(' ').some(s => ['layout', 'paint', 'strict', 'content'].includes(s))
  );
}

/**
 * Returns an element that is used to position the given element.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block
 */
export function getContainingBlock(startElement: HTMLElement): HTMLElement | null {
  if (!startElement.parentElement) {
    return null;
  }

  return findUpUntil(startElement.parentElement, isContainingBlock) as HTMLElement;
}

/*
 * Allows to find multiple elements in the page each according to a specific test function,
 * but traversing the DOM only once.
 */

export function findUpUntilMultiple({
  startElement,
  tests,
}: {
  startElement: HTMLElement;
  tests: Record<string, (el: HTMLElement) => boolean>;
}) {
  const keys = Object.keys(tests);
  const elements: Record<string, HTMLElement> = {};
  let current: HTMLElement | null = startElement;
  while (current && Object.keys(elements).length < keys.length) {
    current = current.parentElement;
    // If a component is used within an svg (i.e. as foreignObject), then it will
    // have some ancestor nodes that are SVGElement. We want to skip those,
    // as they have very different properties to HTMLElements.
    while (current && !isHTMLElement(current)) {
      current = (current as Element).parentElement;
    }
    for (const key of keys) {
      if (!elements[key] && current && tests[key](current)) {
        elements[key] = current;
      }
    }
  }
  return elements;
}

// The instanceof Node/HTMLElement/SVGElement checks can fail if the target element
// belongs to a different window than the respective type.

export function isNode(target: unknown): target is Node {
  return (
    target instanceof Node ||
    (target !== null &&
      typeof target === 'object' &&
      'nodeType' in target &&
      typeof target.nodeType === 'number' &&
      'nodeName' in target &&
      typeof target.nodeName === 'string' &&
      'parentNode' in target &&
      typeof target.parentNode === 'object')
  );
}

export function isHTMLElement(target: unknown): target is HTMLElement {
  return (
    target instanceof HTMLElement ||
    (isNode(target) &&
      target.nodeType === Node.ELEMENT_NODE &&
      'style' in target &&
      typeof target.style === 'object' &&
      typeof target.ownerDocument === 'object' &&
      !isSVGElement(target))
  );
}

export function isSVGElement(target: unknown): target is SVGElement {
  return (
    target instanceof SVGElement ||
    (isNode(target) &&
      target.nodeType === Node.ELEMENT_NODE &&
      'ownerSVGElement' in target &&
      typeof target.ownerSVGElement === 'object')
  );
}
