// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { GroupedControlDirection } from '../../context/control-group-context';

type ResponsiveDirection = GroupedControlDirection | 'auto';

interface UseResponsiveDirectionResult {
  // The concrete axis to render: the forced value, or the measured one in `'auto'` mode.
  resolvedDirection: GroupedControlDirection;
  // Attach to the group root. Measures the available width (see below).
  rootRef: React.Ref<HTMLDivElement>;
  // Attach to the hidden ghost row. Measures the required single-row width and is marked inert.
  ghostRef: React.Ref<HTMLDivElement>;
}

const MAX_ANCESTORS = 20;

/**
 * Resolves a grouped layout's direction responsively. A forced `'horizontal'`/`'vertical'`
 * is returned as-is; `'auto'` stacks the controls when they don't fit the available width.
 *
 * The decision compares two independent widths so the group's own collapse can't feed back
 * and leave it stuck stacked:
 *   - the available width of the line the group sits on, and
 *   - the width the controls need as a single row, measured from a never-shrinking ghost.
 */
export function useResponsiveDirection(direction: ResponsiveDirection): UseResponsiveDirectionResult {
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [requiredRowWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

  const rootElRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  // Walk up past shrink-wrapping ancestors to the first one that actually constrains the
  // group. Its width doesn't follow the group's collapse, so the group can re-expand.
  const measureAvailableWidth = useCallback(() => {
    const root = rootElRef.current;
    if (!root) {
      return;
    }
    const rootWidth = root.getBoundingClientRect().width;
    let container: HTMLElement | null = root.parentElement;
    let available: number | null = null;
    for (let i = 0; container && i < MAX_ANCESTORS; i++) {
      const style = getComputedStyle(container);
      // Content-box width: clientWidth minus inline padding.
      const paddingInline = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const contentWidth = container.clientWidth - paddingInline;
      available = contentWidth;
      // Wider than the group: this ancestor defines the available width.
      if (contentWidth > rootWidth + 1) {
        break;
      }
      // Same width but clips/scrolls (or the group overflows it): it constrains the group.
      const clipsOrScrolls =
        style.overflowX !== 'visible' || style.overflow !== 'visible' || container.scrollWidth > container.clientWidth;
      if (clipsOrScrolls) {
        break;
      }
      // Otherwise it just shrink-wraps to the group: keep looking.
      container = container.parentElement;
    }
    setAvailableWidth(available);
  }, []);

  const measureRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      rootElRef.current = node;
      if (!node || typeof ResizeObserver === 'undefined') {
        return;
      }
      // Re-run the walk whenever the root or any ancestor resizes.
      const observer = new ResizeObserver(() => measureAvailableWidth());
      observer.observe(node);
      for (
        let el: HTMLElement | null = node.parentElement, i = 0;
        el && i < MAX_ANCESTORS;
        i++, el = el.parentElement
      ) {
        observer.observe(el);
      }
      observerRef.current = observer;
      measureAvailableWidth();
    },
    [measureAvailableWidth]
  );

  useLayoutEffect(() => () => observerRef.current?.disconnect(), []);

  // Mark the ghost subtree `inert` so its duplicated controls add no tab stops and are hidden
  // from assistive tech. Set via ref because `inert` isn't rendered by React < 19.
  const ghostElRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (ghostElRef.current) {
      ghostElRef.current.inert = true;
    }
  });

  // Stack when the row doesn't fit. The `-1` tolerance avoids flipping on sub-pixel rounding;
  // stay a row until both widths are measured.
  const stacked = availableWidth !== null && requiredRowWidth !== null ? availableWidth < requiredRowWidth - 1 : false;

  const resolvedDirection: GroupedControlDirection =
    direction === 'auto' ? (stacked ? 'vertical' : 'horizontal') : direction;

  return {
    resolvedDirection,
    rootRef: measureRootRef,
    ghostRef: useMergeRefs(ghostWidthRef, ghostElRef),
  };
}
