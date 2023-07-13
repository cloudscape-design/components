// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useContext, useLayoutEffect } from 'react';

import { DynamicOverlapContext } from '../../context/dynamic-overlap-context';
import { useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useResizeObserver } from '../container-queries';
import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';

export interface UseDynamicOverlapProps {
  /**
   * Disables hook if not needed. By default, `false`.
   */
  disabled?: boolean;
}

/**
 * Observes the height of an element referenced by the returning ref and sets the value as overlapping
 * height for the surrounding AppLayout component.
 * @param props.disabled disables hook if not applicable
 * @returns ref to be measured as overlapping height
 */
export function useDynamicOverlap(props?: UseDynamicOverlapProps) {
  const disabled = props?.disabled ?? false;
  const setDynamicOverlapHeight = useContext(DynamicOverlapContext);
  const overlapElementRef = useRef(null);
  const [overlapHeight, setOverlapHeight] = useState<null | number>(null);

  const getElement = useCallback(() => overlapElementRef.current, [overlapElementRef]);
  const updateState = useCallback(
    // Use queueMicrotask to wait for possibly running renders
    // (for example when this function is called inside `useLayoutEffect`).
    // Use flushSync to let our state updates happen synchronously,
    // and therefore prevent different components from rendering out of sync.
    (entry: ContainerQueryEntry) => queueMicrotask(() => flushSync(() => setOverlapHeight(entry.contentBoxHeight))),
    [setOverlapHeight]
  );

  useResizeObserver(getElement, updateState);

  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      if (!disabled) {
        setDynamicOverlapHeight(overlapHeight ?? 0);
      }

      return () => {
        if (!disabled) {
          setDynamicOverlapHeight(0);
        }
      };
    },
    [disabled, overlapHeight, setDynamicOverlapHeight]
  );

  return overlapElementRef;
}
