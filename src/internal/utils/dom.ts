// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import balanced from 'balanced-match';
import { calculateOnce } from './calculate-once';

export function findUpUntil(node: HTMLElement, callback: (element: HTMLElement) => boolean): HTMLElement | null {
  let current: HTMLElement | null = node;
  while (current && !callback(current)) {
    current = current.parentElement;
    // If a component is used within an svg (i.e. as foreignObject), then it will
    // have some ancestor nodes that are SVGElement. We want to skip those,
    // as they have very different properties to HTMLElements.
    while (current && !(current instanceof HTMLElement)) {
      current = (current as Element).parentElement;
    }
  }
  return current;
}

/**
 * Returns whether `position: fixed` can be relative to transformed parents or
 * whether it's always relative to the viewport. Returns `true` on all browsers
 * except IE.
 */
const supportsContainingBlockPositioning = calculateOnce(() => {
  const parent = document.createElement('div');
  parent.style.transform = 'translateY(5px)';
  document.body.appendChild(parent);

  const child = document.createElement('div');
  child.style.position = 'fixed';
  child.style.top = '0';
  parent.appendChild(child);

  const result = parent.getBoundingClientRect().top === child.getBoundingClientRect().top;
  document.body.removeChild(parent);
  return result;
});

/**
 * Returns an element that is used to position the given element.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block
 */
export function getContainingBlock(startElement: HTMLElement): HTMLElement | null {
  if (!startElement.parentElement) {
    return null;
  }

  return supportsContainingBlockPositioning()
    ? (findUpUntil(startElement.parentElement, element => {
        const computedStyle = getComputedStyle(element);
        return (
          (!!computedStyle.transform && computedStyle.transform !== 'none') ||
          (!!computedStyle.perspective && computedStyle.perspective !== 'none') ||
          (!!computedStyle.containerType && computedStyle.containerType !== 'normal') ||
          computedStyle.contain.split(' ').some(s => ['layout', 'paint', 'strict', 'content'].includes(s))
        );
      }) as HTMLElement)
    : null;
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
