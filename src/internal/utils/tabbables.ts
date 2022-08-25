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

  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
  '[autofocus]',
].join(',');

export function getTabbables(container: HTMLElement): HTMLElement[] {
  return Array.prototype.slice
    .call(container.querySelectorAll(tabbables))
    .filter((element: HTMLElement) => element.tabIndex !== -1);
}

export function getFirstTabbable(container: HTMLElement) {
  const focusables = getTabbables(container);
  return focusables[0] ?? null;
}

export function getLastTabbable(container: HTMLElement) {
  const focusables = getTabbables(container);
  return focusables[focusables.length - 1] ?? null;
}
