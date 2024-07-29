// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import flattenChildren from 'react-keyed-flatten-children';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { InternalColumnLayoutProps } from '../interfaces';

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

interface FlexibleColumnLayoutProps
  extends Pick<
    InternalColumnLayoutProps,
    'minColumnWidth' | 'columns' | 'variant' | 'borders' | 'disableGutters' | '__tagOverride'
  > {
  children: React.ReactNode;
}

export default function FlexibleColumnLayout({
  columns = 1,
  minColumnWidth = 0,
  disableGutters,
  variant,
  children,
  __tagOverride,
}: FlexibleColumnLayoutProps) {
  const [containerWidth, containerRef] = useContainerQuery(rect => rect.contentBoxWidth);

  const columnCount = calculcateCssColumnCount(columns, minColumnWidth, containerWidth);
  const shouldDisableGutters = variant !== 'text-grid' && disableGutters;

  // Flattening the children allows us to "see through" React Fragments and nested arrays.
  const flattenedChildren = flattenChildren(children);
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
        const key = (child as Record<'key', unknown>).key;

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
