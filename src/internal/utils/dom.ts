// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import balanced from 'balanced-match';

export function findUpUntil(node: HTMLElement, callback: (element: HTMLElement) => boolean): HTMLElement | null {
  let current: HTMLElement | null = node;
  while (current && !callback(current)) {
    current = current.parentElement;
    // If a component is used within an svg (i.e. as foreignObject), then it will
    // have some ancestor nodes that are SVGElement. We want to skip those,
    // as they have very different properties to HTMLElements.
    while (current && !isHTMLElement(current)) {
      current = (current as Element).parentElement;
    }
  }
  return current;
}

/**
 * Returns an element that is used to position the given element.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block
 */
export function getContainingBlock(startElement: HTMLElement): HTMLElement | null {
  if (!startElement.parentElement) {
    return null;
  }

  return findUpUntil(startElement.parentElement, element => {
    const computedStyle = getComputedStyle(element);
    return (
      (!!computedStyle.transform && computedStyle.transform !== 'none') ||
      (!!computedStyle.perspective && computedStyle.perspective !== 'none') ||
      (!!computedStyle.containerType && computedStyle.containerType !== 'normal') ||
      computedStyle.contain?.split(' ').some(s => ['layout', 'paint', 'strict', 'content'].includes(s))
    );
  }) as HTMLElement;
}

const cssVariableExpression = /--.+?\s*,\s*(.+)/;

/**
 * Parses a CSS color value that might contain CSS Custom Properties
 * and returns a value that will be understood by the browser, no matter of support level.
 * If the browser support CSS Custom Properties, the value will be return as is. Otherwise,
 * the fallback value will be extracted and returned instead.
 */
export function parseCssVariable(value: string) {
  if (window.CSS?.supports?.('color', 'var(--dummy, #000)') ?? false) {
    return value;
  }

  const varIndex = value.lastIndexOf('var(');
  if (varIndex === -1) {
    return value;
  }

  const expr = balanced('(', ')', value.substr(varIndex));
  if (!expr) {
    return value;
  }

  const match = expr.body.match(cssVariableExpression);
  return match ? match[1] : value;
}

// We avoid instanceof Node/HTMLElement/SVGElement checks as the interfaces are tied to the window they are created in.
// If an element was moved to an iframe after it was created, then element instanceof HTMLElement
// will be false since the interface has a different window.

export function isNode(target: any): target is Node {
  return (
    target instanceof Node ||
    (target !== null &&
      typeof target === 'object' &&
      typeof target.nodeType === 'number' &&
      typeof target.nodeName === 'string' &&
      typeof target.parentNode === 'object')
  );
}

export function isHTMLElement(target: any): target is HTMLElement {
  return (
    target instanceof HTMLElement ||
    (target !== null &&
      typeof target === 'object' &&
      target.nodeType === Node.ELEMENT_NODE &&
      typeof target.style === 'object' &&
      typeof target.ownerDocument === 'object')
  );
}

export function isSVGElement(target: any): target is SVGElement {
  return (
    target instanceof SVGElement ||
    (target !== null &&
      typeof target === 'object' &&
      target.nodeType === Node.ELEMENT_NODE &&
      typeof target.ownerSVGElement === 'object')
  );
}
