// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

const MAX_ANCESTORS = 20;

interface UseFitsInlineResult<T extends HTMLElement> {
  // `true` when the content does not fit the available width (the caller should wrap/stack).
  // `false` until both widths have been measured.
  overflows: boolean;
  // Attach to the element whose available width is measured.
  rootRef: React.Ref<T>;
  // Attach to a hidden ghost that renders the content as a single row; its width is the
  // required width. The ghost subtree is marked inert so it adds no tab stops.
  ghostRef: React.Ref<T>;
}

/**
 * Default available-width measurement: walk up past shrink-wrapping ancestors to the first
 * one that actually constrains `root`. That ancestor's width doesn't follow `root`'s own
 * collapse, which is what lets a wrapped layout re-expand when space returns (otherwise the
 * parent and child deadlock, each waiting on the other to grow).
 */
export function measureConstrainingAncestorWidth(root: HTMLElement): number | null {
  const rootWidth = root.getBoundingClientRect().width;
  let container: HTMLElement | null = root.parentElement;
  let available: number | null = null;
  for (let i = 0; container && i < MAX_ANCESTORS; i++) {
    const style = getComputedStyle(container);
    // Content-box width: clientWidth minus inline padding.
    const paddingInline = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const contentWidth = container.clientWidth - paddingInline;
    available = contentWidth;
    // Wider than the content: this ancestor defines the available width.
    if (contentWidth > rootWidth + 1) {
      break;
    }
    // Same width but clips/scrolls (or the content overflows it): it constrains the content.
    const clipsOrScrolls =
      style.overflowX !== 'visible' || style.overflow !== 'visible' || container.scrollWidth > container.clientWidth;
    if (clipsOrScrolls) {
      break;
    }
    // Otherwise it just shrink-wraps to the content: keep looking.
    container = container.parentElement;
  }
  return available;
}

/**
 * Decides whether content fits the width available to it, by comparing two independent widths
 * so the content's own collapse can't feed back into the decision:
 *   - the available width, derived from `root` (by default the first constraining ancestor,
 *     overridable via `getAvailableWidth` when a layout needs different walk logic), and
 *   - the required width, measured from a hidden ghost that always renders the content inline.
 *
 * Returns `overflows` plus the refs to attach to the root and the ghost.
 */
export function useFitsInline<T extends HTMLElement = HTMLElement>(
  getAvailableWidth: (root: HTMLElement) => number | null = measureConstrainingAncestorWidth
): UseFitsInlineResult<T> {
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [requiredWidth, ghostWidthRef] = useContainerQuery<number>(entry => entry.contentBoxWidth);

  const rootElRef = useRef<T | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const measureAvailableWidth = useCallback(() => {
    if (rootElRef.current) {
      setAvailableWidth(getAvailableWidth(rootElRef.current));
    }
  }, [getAvailableWidth]);

  const measureRootRef = useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      rootElRef.current = node;
      if (!node || typeof ResizeObserver === 'undefined') {
        return;
      }
      // Re-run the measurement whenever the root or any ancestor resizes.
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

  // Mark the ghost subtree `inert` so its duplicated content adds no tab stops and is hidden
  // from assistive tech. Set via ref because `inert` isn't rendered by React < 19.
  const ghostElRef = useRef<T | null>(null);
  useLayoutEffect(() => {
    if (ghostElRef.current) {
      ghostElRef.current.inert = true;
    }
  });

  // The `-1` tolerance avoids flipping on sub-pixel rounding; report "fits" until both widths
  // have been measured.
  const overflows = availableWidth !== null && requiredWidth !== null ? availableWidth < requiredWidth - 1 : false;

  return {
    overflows,
    rootRef: measureRootRef,
    ghostRef: useMergeRefs(ghostWidthRef, ghostElRef),
  };
}
