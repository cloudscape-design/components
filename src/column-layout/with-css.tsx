// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { getCommonClasses } from './util';
import { InternalColumnLayoutProps } from './interfaces';
import styles from './styles.css.js';

interface ColumnLayoutWithCSSProps
  extends Required<
    Pick<InternalColumnLayoutProps, 'minColumnWidth' | 'columns' | 'variant' | 'borders' | 'disableGutters'>
  > {
  children: React.ReactNode;
}

const isOdd = (value: number) => value % 2 !== 0;

export default function ColumnLayoutWithCSS({
  columns,
  minColumnWidth,
  variant,
  borders,
  disableGutters,
  children,
}: ColumnLayoutWithCSSProps) {
  // Flattening the children allows us to "see through" React Fragments and nested arrays.
  const flattenedChildren = flattenChildren(children);

  const [containerWidth, containerRef] = useContainerQuery(rect => rect.width);

  // First, calculate how many columns we can have based on the current container width and minColumnWidth.
  const targetColumnCount = Math.min(columns, containerWidth ? Math.floor(containerWidth / minColumnWidth) : 1);

  // Then we try to keep a balanced layout by adjusting the amount of columns based on the target columns.
  // If the target number of columns is even, we keep it even, and vice versa.
  const columnCount = Math.max(
    1,
    (isOdd(columns) && !isOdd(targetColumnCount)) || (!isOdd(columns) && isOdd(targetColumnCount))
      ? targetColumnCount - 1
      : targetColumnCount
  );

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
      style={{ '--column-count': columnCount }}
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
