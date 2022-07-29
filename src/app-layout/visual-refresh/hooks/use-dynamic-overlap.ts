// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useContext, useLayoutEffect } from 'react';

import { AppLayoutContext } from '../context';
import { useContainerQuery } from '../../../internal/hooks/container-queries';

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
  const { setDynamicOverlapHeight } = useContext(AppLayoutContext);
  const [overlapContainerQuery, overlapElementRef] = useContainerQuery(rect => rect.height);

  const hasOverlap = !disabled && overlapContainerQuery !== null;
  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      setDynamicOverlapHeight(hasOverlap ? overlapContainerQuery : 0);

      return () => {
        setDynamicOverlapHeight(0);
      };
    },
    [hasOverlap, overlapContainerQuery, setDynamicOverlapHeight]
  );

  return overlapElementRef;
}
