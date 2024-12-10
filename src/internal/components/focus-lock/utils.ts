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

export function isFocusable(element: HTMLElement): boolean {
  return element.matches(tabbables);
}

export function getAllFocusables(container: HTMLElement): HTMLElement[] {
  return Array.prototype.slice.call(container.querySelectorAll(tabbables));
}

function getFocusables(container: HTMLElement): HTMLElement[] {
  return getAllFocusables(container).filter((element: HTMLElement) => element.tabIndex !== -1);
}

export function getFirstFocusable(container: HTMLElement): null | HTMLElement {
  const focusables = getFocusables(container);
  return focusables[0] ?? null;
}

export function getLastFocusable(container: HTMLElement): null | HTMLElement {
  const focusables = getFocusables(container);
  return focusables[focusables.length - 1] ?? null;
}
