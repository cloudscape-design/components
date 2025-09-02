// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot, Root } from 'react-dom/client';

console.log(`Using React ${React.version}`);

const roots = new WeakMap<HTMLElement, Root>();

export function mount(element: React.ReactElement, container: HTMLElement) {
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }
  root.render(element);
}

export function unmount(container: HTMLElement) {
  const root = roots.get(container);
  if (root) {
    // Defer unmount to avoid unmounting during another root's commit.
    queueMicrotask(() => {
      try {
        root.unmount();
      } finally {
        roots.delete(container);
      }
    });
  }
}
