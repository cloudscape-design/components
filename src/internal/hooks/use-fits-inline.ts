// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

interface UseFitsInlineOptions {
  // Whether an action slot sits beside the controls on the same row. When `false`,
  // the action slot contributes nothing and the fit decision is unchanged.
  hasActionSlot?: boolean;
}

interface UseFitsInlineResult<T extends HTMLElement> {
  // `true` when content does not fit; `false` until both widths are known.
  overflows: boolean;
  // Attach to the group root; it MUST be `position: static`.
  rootRef: React.Ref<T>;
  // Attach to the hidden single-row ghost (required width).
  ghostRef: React.Ref<T>;
  // Attach to the hidden sensor (available width).
  sensorRef: React.Ref<T>;
  // Attach to the action slot sitting beside the controls. Its real row footprint
  // (border-box width minus the negative overlap margin it shares with the controls)
  // is added to the required side, so the group stacks once the controls AND the
  // action slot stop fitting on one row, not ~1 action-slot-width later.
  actionSlotRef: React.Ref<T>;
}

/**
 * Reports whether content fits by comparing the available width (hidden sensor) against the
 * required width (hidden single-row ghost). Measuring these independently avoids the feedback
 * loop where the content's own collapse would shrink the measurement and never re-expand.
 *
 * The sensor only reports the available width while the root stays `position: static`, so the
 * sensor resolves against the nearest positioned ancestor instead of the group itself.
 *
 * The ghost measures the controls alone. When an action slot shares the row (`hasActionSlot`),
 * its real horizontal footprint is folded into the required side so the comparison reflects what
 * must actually fit on the row. The footprint is read from the live element — its border-box width
 * plus its (negative) inline-start margin — so the overlap seam between the controls and the
 * action slot is accounted for without hardcoding a token value.
 */
export function useFitsInline<T extends HTMLElement = HTMLElement>({
  hasActionSlot = false,
}: UseFitsInlineOptions = {}): UseFitsInlineResult<T> {
  const [availableWidth, sensorWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);
  const [requiredWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);
  const [actionSlotWidth, actionSlotWidthRef] = useContainerQuery<number>(entry => {
    // Real row contribution = border-box width + the negative overlap margin the action slot
    // shares with the controls. Reading the computed margin keeps the overlap in sync with the
    // SCSS token instead of hardcoding it.
    const marginInlineStart = parseFloat(getComputedStyle(entry.target).marginInlineStart) || 0;
    return Math.max(0, entry.borderBoxWidth + marginInlineStart);
  });

  // Mark the ghost subtree `inert` so its duplicated content adds no tab stops and is hidden from
  // assistive tech. A ref callback rather than an effect, since `inert` isn't rendered by React < 19.
  const ghostInertRef = useCallback((node: T | null) => {
    if (node) {
      node.inert = true;
    }
  }, []);

  // Kept for a stable return shape; the sensor, not the root, is measured.
  const rootRef = useRef<T | null>(null);

  // The action slot only counts when one is present; otherwise this stays 0 and the decision is
  // byte-for-byte the no-action-button behavior.
  const actionContribution = hasActionSlot && actionSlotWidth !== null ? actionSlotWidth : 0;

  // `-1` tolerance avoids flipping on sub-pixel rounding.
  const overflows =
    availableWidth !== null && requiredWidth !== null ? availableWidth < requiredWidth + actionContribution - 1 : false;

  return {
    overflows,
    rootRef,
    ghostRef: useMergeRefs(ghostWidthRef, ghostInertRef),
    sensorRef: sensorWidthRef,
    actionSlotRef: actionSlotWidthRef,
  };
}
