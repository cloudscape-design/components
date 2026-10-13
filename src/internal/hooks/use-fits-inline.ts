// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

interface UseFitsInlineResult<T extends HTMLElement> {
  // `true` when the content does not fit the available width (the caller should wrap/stack).
  // `false` until both widths have been measured.
  overflows: boolean;
  // Attach to the group root. The root MUST be `position: static` so the sensor can escape the
  // root's own shrink/collapse (see `sensorRef`).
  rootRef: React.Ref<T>;
  // Attach to a hidden ghost that renders the content as a single row; its width is the
  // required width. The ghost subtree is marked inert so it adds no tab stops. The ghost is
  // `position: absolute`, so it needs its own zero-size `position: relative` wrapper to anchor
  // (the root is static for the sensor's sake and can no longer anchor it).
  ghostRef: React.Ref<T>;
  // Attach to a hidden "width sensor": a block element that fills the inline space available to
  // the group but has NO intrinsic/min-content width, so it can neither shrink-wrap to content
  // nor prop its container open. Its measured content-box width IS the available width.
  sensorRef: React.Ref<T>;
}

/**
 * Decides whether content fits the width available to it, by comparing two independent widths
 * so the content's own collapse can't feed back into the decision:
 *   - the available width, measured from a hidden "width sensor" (see below), and
 *   - the required width, measured from a hidden ghost that always renders the content inline.
 *
 * Why a sensor instead of walking the ancestor chain: when the group's controls can shrink to
 * fit (`min-inline-size: 0`), the group root never overflows — at a narrow viewport the controls
 * are crushed, the root stays as wide as its (shrunken) content, and there is no "constraining
 * ancestor" to find. Measuring the root (or any element that shrink-wraps with it) also deadlocks
 * once stacked: the measured width stays below the ghost forever, so the group can never
 * re-expand when space returns.
 *
 * The sensor sidesteps both problems. It is an absolutely-positioned, zero-content-width block
 * (`inset-inline: 0; block-size: 0; min-inline-size: 0`) rendered inside the root. Because the
 * root is `position: static`, the sensor's containing block is NOT the (collapsing) root but the
 * nearest positioned ancestor / the initial containing block, whose width is driven top-down and
 * does not follow the group's own stacking. With `inset-inline: 0` it fills that width exactly,
 * and having no intrinsic width it can neither shrink-wrap to content nor hold its container open.
 * Its measured width is therefore the real inline space offered to the group, in BOTH the row and
 * stacked states — which is exactly what breaks the flex-wrap deadlock and lets the group
 * re-expand.
 *
 * Known limitation (by design, do not try to "fix"): the sensor reports the width of the nearest
 * positioned ancestor (or the ICB), not necessarily the group's immediate parent. In the layouts
 * this is used for, no closer positioned/narrower ancestor exists, so this equals the local
 * available width. This is strictly better than the removed ancestor-walk (which was broken for
 * shrink-to-fit controls) and is the only mechanism that both measures a non-collapsing width and
 * avoids the deadlock.
 *
 * Returns `overflows` plus the refs to attach to the root, the ghost, and the sensor.
 */
export function useFitsInline<T extends HTMLElement = HTMLElement>(): UseFitsInlineResult<T> {
  // Both widths are measured with `useContainerQuery`, which observes each element directly via
  // its own ResizeObserver (SSR-safe, re-measures on resize). The sensor's box resizes with the
  // available width, so observing the sensor is enough — no ancestor observation needed.
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

  // The root element itself is no longer measured (the sensor is), but the hook keeps owning a
  // root ref so callers merge it the same way as before and the return shape stays stable.
  const rootRef = useRef<T | null>(null);

  // The `-1` tolerance avoids flipping on sub-pixel rounding; report "fits" until both widths
  // have been measured.
  const overflows = availableWidth !== null && requiredWidth !== null ? availableWidth < requiredWidth - 1 : false;

  return {
    overflows,
    rootRef,
    ghostRef: useMergeRefs(ghostWidthRef, ghostElRef),
    sensorRef: sensorWidthRef,
  };
}
