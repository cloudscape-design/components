// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot, Root } from 'react-dom/client';

console.log(`Using React ${React.version}`);

const mountedRoots = new WeakMap<HTMLElement, Root>();
const unmountingTasks = new WeakMap<HTMLElement, number>();

export function mount(element: React.ReactElement, container: HTMLElement) {
  // If we attempt to mount a root immediately after the unmount was called, we cancel
  // the unmount instead, and reuse the available root but with new React content.
  const taskId = unmountingTasks.get(container);
  if (taskId !== null) {
    clearTimeout(taskId);
    unmountingTasks.delete(container);
  }
  let root = mountedRoots.get(container);
  if (!root) {
    root = createRoot(container);
    mountedRoots.set(container, root);
  }
  root.render(element);
}

export function unmount(container: HTMLElement) {
  const root = mountedRoots.get(container);
  if (!root) {
    return;
  }

  // Force React content unmount.
  root.render(null);

  // Defer root unmount to avoid unmounting during another root's commit.
  const taskId = window.setTimeout(() => {
    try {
      root.unmount();
    } finally {
      mountedRoots.delete(container);
      unmountingTasks.delete(container);
    }
  }, 0);
  unmountingTasks.set(container, taskId);
}
