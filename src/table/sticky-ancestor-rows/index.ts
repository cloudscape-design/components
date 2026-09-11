// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useState } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import styles from '../styles.css.js';

/**
 * Default estimate (in px) of a single ancestor row height. Used to stack nested
 * sticky ancestor rows below one another. This is a v0 approximation: rows with
 * wrapped content or custom vertical alignment may be taller. Precise per-row
 * measurement is tracked as follow-up work.
 */
export const DEFAULT_STICKY_ANCESTOR_ROW_HEIGHT = 40;

export interface StickyAncestorRowOffsetProps {
  /** 1-based hierarchy level of the row (top-level rows are level 1). */
  level: number;
  /** Combined offset (in px) from the top of the scroll container to the first sticky row. */
  headerOffset: number;
  /** Estimated height (in px) of a single ancestor row. */
  rowHeight: number;
}

/**
 * Pure helper that computes the `inset-block-start` (top) offset for a sticky ancestor
 * row so that each hierarchy level stacks directly below the sticky header and any
 * shallower ancestors. Level 1 sits flush against the header; each additional level
 * is pushed down by one row height.
 */
export function getStickyAncestorRowOffset({ level, headerOffset, rowHeight }: StickyAncestorRowOffsetProps): number {
  const normalizedLevel = Math.max(1, Math.floor(level));
  const normalizedRowHeight = Math.max(0, rowHeight);
  return headerOffset + (normalizedLevel - 1) * normalizedRowHeight;
}

export interface StickyAncestorRowProps {
  className?: string;
  style?: { insetBlockStart: number; zIndex: number };
}

export interface UseStickyAncestorRowsProps {
  /** Whether the feature is enabled (opt-in via `expandableRows.stickyAncestorRows`). */
  enabled: boolean;
  /** Ref to the (primary) table header element used to measure the sticky header height. */
  headerRef: RefObject<HTMLElement>;
  /** Additional vertical offset from the top, e.g. `stickyHeaderVerticalOffset`. */
  headerVerticalOffset?: number;
  /** Estimated ancestor row height, defaults to {@link DEFAULT_STICKY_ANCESTOR_ROW_HEIGHT}. */
  rowHeight?: number;
}

/**
 * v0 hook wiring hierarchical sticky ancestor rows. It measures the header height
 * (reusing the existing sticky-header thead ref) and returns a factory that produces
 * the class name and inline offset styles for a given expandable row.
 *
 * The heavy lifting is delegated to the browser's native `position: sticky`: an
 * expanded parent row stays pinned while its descendants scroll and is naturally
 * released once the next sibling at the same level reaches the top.
 */
export function useStickyAncestorRows({
  enabled,
  headerRef,
  headerVerticalOffset = 0,
  rowHeight = DEFAULT_STICKY_ANCESTOR_ROW_HEIGHT,
}: UseStickyAncestorRowsProps) {
  const [headerHeight, setHeaderHeight] = useState(0);

  useResizeObserver(headerRef, entry => {
    if (enabled) {
      setHeaderHeight(entry.borderBoxHeight);
    }
  });

  const getStickyAncestorRowProps = useCallback(
    (level: number, isSticky: boolean): StickyAncestorRowProps => {
      if (!enabled || !isSticky) {
        return {};
      }
      const insetBlockStart = getStickyAncestorRowOffset({
        level,
        headerOffset: headerVerticalOffset + headerHeight,
        rowHeight,
      });
      return {
        className: styles['sticky-ancestor-row'],
        // Deeper levels get a slightly lower z-index so shallower ancestors win any overlap.
        style: { insetBlockStart, zIndex: 798 - Math.max(0, Math.floor(level) - 1) },
      };
    },
    [enabled, headerHeight, headerVerticalOffset, rowHeight]
  );

  return { getStickyAncestorRowProps };
}
