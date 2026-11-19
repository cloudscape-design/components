// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

interface UseFitsInlineResult<T extends HTMLElement> {
  // `true` when content fits; also `true` until both widths are known.
  fits: boolean;
  // Attach to the hidden single-row ghost (required width). The ghost must contain
  // everything that shares the row, so its measured width is the full required width.
  ghostRef: React.Ref<T>;
  // Attach to the hidden sensor (available width).
  sensorRef: React.Ref<T>;
}

/**
 * Reports whether content fits by comparing the available width (hidden sensor) against the
 * required width (hidden single-row ghost). Measuring these independently avoids the feedback
 * loop where the content's own collapse would shrink the measurement and never re-expand.
 *
 * The ghost is a hidden single-row copy of everything on the row.
 */
export function useFitsInline<T extends HTMLElement = HTMLElement>(): UseFitsInlineResult<T> {
  const [availableWidth, sensorWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);
  const [requiredWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

  // Mark the ghost subtree `inert` so its duplicated content adds no tab stops and is hidden from
  // assistive tech. A ref callback rather than an effect, since `inert` isn't rendered by React < 19.
  const ghostInertRef = useCallback((node: T | null) => {
    if (node) {
      node.inert = true;
    }
  }, []);

  // `-1` tolerance avoids flipping on sub-pixel rounding.
  const fits = availableWidth !== null && requiredWidth !== null ? availableWidth >= requiredWidth - 1 : true;

  return {
    fits,
    ghostRef: useMergeRefs(ghostWidthRef, ghostInertRef),
    sensorRef: sensorWidthRef,
  };
}
