// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect } from 'react';

import { useAppLayoutContext } from '../../context/app-layout-context';
import { useContainerQuery } from '../container-queries';

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
  const { setDynamicOverlapHeight } = useAppLayoutContext();
  const [overlapContainerQuery, overlapElementRef] = useContainerQuery(rect => rect.height);

  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      if (!disabled) {
        setDynamicOverlapHeight?.(overlapContainerQuery ?? 0);
      }

      return () => {
        if (!disabled) {
          setDynamicOverlapHeight?.(0);
        }
      };
    },
    [disabled, overlapContainerQuery, setDynamicOverlapHeight]
  );

  return overlapElementRef;
}
