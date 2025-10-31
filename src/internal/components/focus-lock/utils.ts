// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Credits to
// https://github.com/theKashey/focus-lock/blob/33f8b4bd9675d2605b15e2e4015b77fe35fbd6d0/src/utils/tabbables.ts
const tabbables = [
  'button:enabled',
  'select:enabled',
  'textarea:enabled',
  'input:enabled',

  'a[href]',
  'area[href]',

  'summary',
  'iframe',
  'object',
  'embed',

  'audio[controls]',
  'video[controls]',

  '[tabindex]',
  '[contenteditable]',
  '[autofocus]',
].join(',');

/** Whether the element or any of its ancestors are not hidden. */
function isVisible(element: HTMLElement): boolean {
  if (!('checkVisibility' in element)) {
    // checkVisibility isn't defined in JSDOM. It's safer to assume everything is visible.
    return true;
  }
  // checkVisibility is only defined on element in Typescript 5+
  // See https://github.com/puppeteer/puppeteer/issues/11059
  return (element as any).checkVisibility({ visibilityProperty: true });
}

/** Whether the element can be focused. */
export function isFocusable(element: HTMLElement): boolean {
  return element.matches(tabbables) && isVisible(element);
}

/** Get all elements that can be focused, either programmatically or by the user. */
export function getAllFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(tabbables)).filter(isVisible);
}

/** Get all focusable elements that can be reached with the keyboard. */
function getAllTabbables(container: HTMLElement): HTMLElement[] {
  return getAllFocusables(container).filter((element: HTMLElement) => element.tabIndex !== -1);
}

export function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  const tabbables = getAllTabbables(container);
  return tabbables[0] ?? null;
}

export function getLastFocusable(container: HTMLElement): HTMLElement | null {
  const tabbables = getAllTabbables(container);
  return tabbables[tabbables.length - 1] ?? null;
}
