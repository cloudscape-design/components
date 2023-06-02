// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { getCommonClasses } from './util';
import { InternalColumnLayoutProps } from './interfaces';
import customCssProps from '../internal/generated/custom-css-properties';
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

interface ColumnLayoutWithCSSProps
  extends Pick<InternalColumnLayoutProps, 'minColumnWidth' | 'columns' | 'variant' | 'borders' | 'disableGutters'> {
  children: React.ReactNode;
}

export default function ColumnLayoutWithCSS({
  columns = 1,
  minColumnWidth = 0,
  variant,
  borders,
  disableGutters,
  children,
}: ColumnLayoutWithCSSProps) {
  const [containerWidth, containerRef] = useContainerQuery(rect => rect.width);

  const columnCount = calculcateCssColumnCount(columns, minColumnWidth, containerWidth);

  // Flattening the children allows us to "see through" React Fragments and nested arrays.
  const flattenedChildren = flattenChildren(children);
  const childrenCount = flattenedChildren.length;
  const rowCount = Math.ceil(childrenCount / columnCount);

  return (
    <div
      ref={containerRef}
      className={clsx(
        ...getCommonClasses({ borders, disableGutters, variant }),
        styles['css-grid'],
        isOdd(columnCount) && styles['odd-columns']
      )}
      style={{ [customCssProps.columnLayoutColumnCount]: columnCount }}
    >
      {flattenedChildren.map((child, i) => {
        // If this react child is a primitive value, the key will be undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const key = (child as any).key;
        const rowIndex = Math.floor(i / columnCount);

        return (
          <div
            key={key}
            className={clsx(styles['restore-pointer-events'], {
              [styles['first-column']]: i % columnCount === 0,
              [styles['last-column']]: i % columnCount === columnCount - 1,
              [styles['last-row']]: rowIndex === rowCount - 1,
            })}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
