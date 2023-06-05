// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MutableRefObject, Ref, useContext, useLayoutEffect } from 'react';
import { AppContext } from '../../../contexts/app-context';
import { useContainerQuery } from '../container-queries';
import customCssProps from '../../generated/custom-css-properties';

export interface UseDynamicOverlapProps {
  /**
   * Disables hook if not needed. By default, `false`.
   */
  disabled?: boolean;
}

const setDynamicOverlapHeight = (rootElement: Ref<HTMLElement> | string | undefined, height: number) => {
  if (rootElement) {
    let actualRootElement: HTMLElement | null = null;
    if (typeof rootElement === 'string') {
      actualRootElement = document.querySelector(rootElement);
    } else if ((rootElement as MutableRefObject<HTMLElement>).current) {
      actualRootElement = (rootElement as MutableRefObject<HTMLElement>).current;
    }
    if (actualRootElement) {
      actualRootElement.style.setProperty(customCssProps.overlapHeight, `${height}px`);
    }
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
  const { rootElement } = useContext(AppContext);
  const [overlapHeight, overlapElementRef] = useContainerQuery(rect => rect.height);

  useLayoutEffect(
    function handleDynamicOverlapHeight() {
      if (!disabled) {
        setDynamicOverlapHeight(rootElement, overlapHeight ?? 0);
      }

      return () => {
        if (!disabled) {
          setDynamicOverlapHeight(rootElement, 0);
        }
      };
    },
    [disabled, overlapHeight, rootElement]
  );

  return overlapElementRef;
}
