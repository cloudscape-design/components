// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import balanced from 'balanced-match';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

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
  if (typeof window === 'undefined') {
    return value;
  }

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
