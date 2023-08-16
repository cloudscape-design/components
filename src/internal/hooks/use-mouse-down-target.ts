// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createSingletonHandler } from '@cloudscape-design/component-toolkit/internal';
import { useRef } from 'react';

const useEventListenersSingleton = createSingletonHandler<Node | null>(setTarget => {
  function handleMouseDown(event: MouseEvent) {
    setTarget(event.target as Node);
  }
  function handleKeyDown() {
    setTarget(null);
  }
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('keydown', handleKeyDown);
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
