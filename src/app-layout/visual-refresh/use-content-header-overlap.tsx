// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useState } from 'react';
import customCssProps from '../../internal/generated/custom-css-properties';

/**
 * The overlap height has a default set in CSS but can also be dynamically overridden
 * for content types (such as Table and Wizard) that have variable size content in the overlap.
 * If a child component utilizes a sticky header the hasStickyBackground property will determine
 * if the background remains in the same vertical position.
 */
export default function useContentHeaderOverlap({
  contentHeader,
  disableContentHeaderOverlap,
  layoutElement,
}: {
  contentHeader: React.ReactNode;
  disableContentHeaderOverlap?: boolean;
  layoutElement: React.Ref<HTMLElement>;
}) {
  const hasContentHeader = !!contentHeader;

  const [hasContentHeaderOverlap, setHasContentHeaderOverlap] = useState(hasContentHeader);

  const updateContentHeaderOverlapHeight = useCallback(
    (height: number) => {
      const hasOverlap = hasContentHeader || height > 0;
      setHasContentHeaderOverlap(hasOverlap);

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
      if (disableContentHeaderOverlap || !hasOverlap || height <= 0) {
        element.style.removeProperty(customCssProps.overlapHeight);
      } else {
        element.style.setProperty(customCssProps.overlapHeight, `${height}px`);
      }
    },
    [hasContentHeader, layoutElement, disableContentHeaderOverlap]
  );

  return {
    hasContentHeaderOverlap,
    updateContentHeaderOverlapHeight,
  };
}
