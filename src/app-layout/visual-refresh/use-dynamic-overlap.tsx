// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import customCssProps from '../../internal/generated/custom-css-properties';

export default function useDynamicOverlap({
  contentHeader,
  disableContentHeaderOverlap,
  layoutElement,
}: {
  contentHeader: React.ReactNode;
  disableContentHeaderOverlap?: boolean;
  layoutElement: React.Ref<HTMLElement>;
}) {
  const hasContentHeader = !!contentHeader;

  /**
   * The disableContentHeaderOverlap property is absolute and will always disable the overlap
   * if it is set to true. If there is no contentHeader then the overlap should be disabled
   * unless there is a dynamicOverlapHeight. The dynamicOverlapHeight property is set by a
   * component in the content slot that needs to manually control the overlap height.
   */
  const getDynamicOverlap = useCallback(
    (overlapHeight?: number) => {
      const isOverlapSet = (overlapHeight && overlapHeight > 0) || hasContentHeader;
      const isOverlapDisabled = disableContentHeaderOverlap || !isOverlapSet;
      return {
        isOverlapSet,
        isOverlapDisabled,
      };
    },
    [hasContentHeader, disableContentHeaderOverlap]
  );

  const { isOverlapSet, isOverlapDisabled } = getDynamicOverlap();
  const [isDynamicOverlapSet, setIsDynamicOverlapSet] = useState(isOverlapSet);
  const [isDynamicOverlapDisabled, setIsDynamicOverlapDisabled] = useState(isOverlapDisabled);

  /**
   * The overlap height has a default set in CSS but can also be dynamically overridden
   * for content types (such as Table and Wizard) that have variable size content in the overlap.
   * If a child component utilizes a sticky header the hasStickyBackground property will determine
   * if the background remains in the same vertical position.
   */
  const updateDynamicOverlapHeight = useCallback(
    (height: number) => {
      const { isOverlapSet, isOverlapDisabled } = getDynamicOverlap(height);

      setIsDynamicOverlapSet(isOverlapSet);
      setIsDynamicOverlapDisabled(isOverlapDisabled);

      /**
       * React 18 will trigger a paint before the state is correctly updated
       * (see https://github.com/facebook/react/issues/24331).
       * To work around this, we bypass React state updates and imperatively update the custom property on the DOM.
       * An alternative would be to use `queueMicrotask` and `flushSync` in the ResizeObserver callback,
       * but that would have some performance impact as it would delay the render.
       * Using React state for `isDynamicOverlapSet` and `isDynamicOverlapDisabled` is less problematic
       * because they will rarely change within the lifecycle of an application.
       */
      // Layout component uses RefObject, we don't expect a RefCallback
      const element = typeof layoutElement !== 'function' && layoutElement?.current;
      if (!element) {
        return;
      }
      if (isOverlapDisabled || height <= 0) {
        element.style.removeProperty(customCssProps.overlapHeight);
      } else {
        element.style.setProperty(customCssProps.overlapHeight, `${height}px`);
      }
    },
    [layoutElement, getDynamicOverlap]
  );

  return {
    isDynamicOverlapSet,
    isDynamicOverlapDisabled,
    updateDynamicOverlapHeight,
  };
}
