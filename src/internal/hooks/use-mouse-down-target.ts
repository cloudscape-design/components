// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';

import { createSingletonHandler } from '@cloudscape-design/component-toolkit/internal';

const useEventListenersSingleton = createSingletonHandler<Node | null>(setTarget => {
  function handleMouseDown(event: MouseEvent) {
    setTarget(event.target as Node);
  }
  function handleKeyDown() {
    setTarget(null);
  }
  const controller = new AbortController();
  window.addEventListener('mousedown', handleMouseDown, { signal: controller.signal });
  window.addEventListener('keydown', handleKeyDown, { signal: controller.signal });
  return () => {
    controller.abort();
  };
});

/**
 * Captures last mouse down target and clears it on keydown.
 * @returns a callback to get the last detected mouse down target.
 */
export default function useMouseDownTarget() {
  const mouseDownTargetRef = useRef<null | Node>(null);
  useEventListenersSingleton(target => {
    mouseDownTargetRef.current = target;
  });
  return () => mouseDownTargetRef.current;
}
