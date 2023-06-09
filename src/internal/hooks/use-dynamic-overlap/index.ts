// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, Ref, useContext, useLayoutEffect } from 'react';
import { LayoutContext } from '../../context/layout-context';
import { useContainerQuery } from '../container-queries';
import customCssProps from '../../generated/custom-css-properties';

export interface UseDynamicOverlapProps {
  /**
   * Disables hook if not needed. By default, `false`.
   */
  disabled?: boolean;
}

const setDynamicOverlapHeight = (layoutElement: Ref<HTMLElement> | undefined, height: number) => {
  if (layoutElement && (layoutElement as MutableRefObject<HTMLElement>).current) {
    (layoutElement as MutableRefObject<HTMLElement>).current.style.setProperty(
      customCssProps.overlapHeight,
      `${height}px`
    );
  }
};

/**
 * Observes the height of an element referenced by the returning ref and sets the value as overlapping
 * height for the surrounding AppLayout component.
 * @param props.disabled disables hook if not applicable
 * @returns ref to be measured as overlapping height
 */
export function useDynamicOverlap(props?: UseDynamicOverlapProps) {
  const disabled = props?.disabled ?? false;
  const { layoutElement } = useContext(LayoutContext);
  const [overlapHeight, overlapElementRef] = useContainerQuery(rect => rect.height);

  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      if (!disabled) {
        setDynamicOverlapHeight(layoutElement, overlapHeight ?? 0);
      }

      return () => {
        if (!disabled) {
          setDynamicOverlapHeight(layoutElement, 0);
        }
      };
    },
    [disabled, overlapHeight, layoutElement]
  );

  return overlapElementRef;
}
