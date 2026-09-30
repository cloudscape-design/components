// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { getMatchingBreakpoint } from '../../internal/breakpoints';
import { flattenChildren } from '../../internal/utils/flatten-children';
import { COLUMN_TRIGGERS, ColumnLayoutBreakpoint } from '../internal';
import { InternalColumnLayoutProps } from '../internal-interfaces';

import styles from './styles.css.js';

const isOdd = (value: number): boolean => value % 2 !== 0;

export function calculcateCssColumnCount(
  columns: number,
  minColumnWidth: number,
  containerWidth: number | null
): number {
  if (!containerWidth) {
    return columns;
  }

  // First, calculate how many columns we can have based on the current container width and minColumnWidth.
  const targetColumnCount = Math.min(columns, Math.floor(containerWidth / minColumnWidth));

  // When we start wrapping into fewer columns than desired, we want to keep the number of columns even.
  return Math.max(
    1,
    targetColumnCount < columns && isOdd(targetColumnCount) ? targetColumnCount - 1 : targetColumnCount
  );
}

/**
 * Column width assumed when `minColumnWidth` is not set, used to cap the column count once the
 * breakpoint ladder runs out. Matches the default KeyValuePairs passes to this renderer.
 */
export const DEFAULT_MIN_COLUMN_WIDTH = 150;

/**
 * Column count for this renderer when `minColumnWidth` is not set, in which case there is no
 * desired column width to derive the count from.
 *
 * Below `xs` this mirrors the 12-column grid renderer, whose column definitions resolve to one
 * column below `xxs` and at most two at `xxs`. Keeping those rules preserves the guaranteed
 * single column on narrow screens, which deriving the count from a width alone does not give.
 */
export function calculateBreakpointColumnCount(
  columns: number,
  breakpoint: ColumnLayoutBreakpoint,
  containerWidth: number | null
): number {
  switch (breakpoint) {
    // Before the container has been measured, render the requested count to avoid a
    // single-column flash. Matches how calculcateCssColumnCount treats an unknown width.
    case null:
      return columns;
    case 'default':
      return 1;
    case 'xxs':
      return Math.min(columns, 2);
    default:
      // `xs` is the widest breakpoint this renderer distinguishes, so from here on the count has
      // to come from the available width instead. Without this, a 12-column layout would keep all
      // 12 columns in a 700px container. Delegating keeps the even-count rule identical to the
      // path that does receive a `minColumnWidth`.
      return calculcateCssColumnCount(columns, DEFAULT_MIN_COLUMN_WIDTH, containerWidth);
  }
}

interface FlexibleColumnLayoutProps
  extends Pick<
    InternalColumnLayoutProps,
    'minColumnWidth' | 'columns' | 'variant' | 'borders' | 'disableGutters' | '__tagOverride'
  > {
  children: React.ReactNode;
}

export default function FlexibleColumnLayout({
  columns = 1,
  minColumnWidth,
  disableGutters,
  variant,
  children,
  __tagOverride,
}: FlexibleColumnLayoutProps) {
  const [containerWidth, containerRef] = useContainerQuery(rect => rect.contentBoxWidth);

  const columnCount = minColumnWidth
    ? calculcateCssColumnCount(columns, minColumnWidth, containerWidth)
    : calculateBreakpointColumnCount(
        columns,
        containerWidth === null ? null : getMatchingBreakpoint(containerWidth, COLUMN_TRIGGERS),
        containerWidth
      );

  const shouldDisableGutters = variant !== 'text-grid' && disableGutters;

  // Flattening the children allows us to "see through" React Fragments and nested arrays.
  const flattenedChildren = flattenChildren(children, 'ColumnLayout');
  const Tag = (__tagOverride ?? 'div') as 'div';

  return (
    <Tag
      ref={containerRef}
      className={clsx(
        styles['css-grid'],
        styles[`grid-variant-${variant}`],
        shouldDisableGutters && [styles['grid-no-gutters']]
      )}
      style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
    >
      {flattenedChildren.map((child, i) => {
        // If this react child is a primitive value, the key will be undefined
        const key = child && typeof child === 'object' ? (child as Record<'key', unknown>).key : undefined;

        return (
          <div
            key={key ? String(key) : undefined}
            className={clsx(styles.item, {
              [styles['first-column']]: i % columnCount === 0,
            })}
          >
            {child}
          </div>
        );
      })}
    </Tag>
  );
}
