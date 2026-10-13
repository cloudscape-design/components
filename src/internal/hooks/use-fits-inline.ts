// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

interface UseFitsInlineResult<T extends HTMLElement> {
  // `true` when content does not fit (caller should stack); `false` until both widths are known.
  overflows: boolean;
  // Attach to the group root; it MUST be `position: static` (see below).
  rootRef: React.Ref<T>;
  // Attach to the hidden single-row ghost; its width is the required width.
  ghostRef: React.Ref<T>;
  // Attach to the hidden width sensor; its content-box width is the available width.
  sensorRef: React.Ref<T>;
}

/**
 * Decides whether content fits the width available to it, by comparing two independent widths so
 * the content's own collapse can't feed back into the decision: the available width from a hidden
 * width sensor, and the required width from a hidden ghost that always renders content inline.
 *
 * Why a sensor rather than walking the ancestor chain: when controls can shrink to fit
 * (`min-inline-size: 0`) the root never overflows and there is no constraining ancestor to find,
 * and measuring the root (or anything that shrink-wraps with it) deadlocks once stacked — it stays
 * narrower than the ghost forever, so the group never re-expands. The sensor is an
 * absolutely-positioned, zero-content-width block; because the root is `position: static`, the
 * sensor's containing block is the nearest positioned ancestor / the ICB (width driven top-down,
 * not the group's own stacking), so its width is the real available width in both states. Hence
 * the root MUST stay `position: static`.
 */
export function useFitsInline<T extends HTMLElement = HTMLElement>(): UseFitsInlineResult<T> {
  // `useContainerQuery` observes each element via its own ResizeObserver (SSR-safe, re-measures on resize).
  const [availableWidth, sensorWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);
  const [requiredWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

  // Mark the ghost subtree `inert` so its duplicated content adds no tab stops and is hidden
  // from assistive tech. Set via ref because `inert` isn't rendered by React < 19.
  const ghostElRef = useRef<T | null>(null);
  useLayoutEffect(() => {
    if (ghostElRef.current) {
      ghostElRef.current.inert = true;
    }
  });

  // Kept for a stable return shape; the sensor, not the root, is measured.
  const rootRef = useRef<T | null>(null);

  // `-1` tolerance avoids flipping on sub-pixel rounding; report "fits" until both widths are known.
  const overflows = availableWidth !== null && requiredWidth !== null ? availableWidth < requiredWidth - 1 : false;

  return {
    overflows,
    rootRef,
    ghostRef: useMergeRefs(ghostWidthRef, ghostElRef),
    sensorRef: sensorWidthRef,
  };
}
