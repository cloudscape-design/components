// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import InternalGrid from '../grid/internal';
import { GridProps } from '../grid/interfaces';
import { repeat } from './util';
import { InternalColumnLayoutProps } from './interfaces';
import { ColumnLayoutBreakpoint } from './internal';
import styles from './styles.css.js';

const COLUMN_DEFS: Record<number, GridProps.ElementDefinition | undefined> = {
  1: { colspan: { default: 12, xxs: 12, xs: 12 } },
  2: { colspan: { default: 12, xxs: 6, xs: 6 } },
  3: { colspan: { default: 12, xxs: 6, xs: 4 } },
  4: { colspan: { default: 12, xxs: 6, xs: 3 } },
};

interface ColumnLayoutWithGridProps
  extends Required<Pick<InternalColumnLayoutProps, 'columns' | 'variant' | 'borders' | 'disableGutters'>> {
  children: React.ReactNode;
  __breakpoint?: ColumnLayoutBreakpoint;
}

export default React.forwardRef(function ColumnLayoutWithGrid(
  { columns, variant, borders, disableGutters, __breakpoint, children }: ColumnLayoutWithGridProps,
  ref?: React.Ref<any>
) {
  const isTextGridVariant = variant === 'text-grid';
  const shouldDisableGutters = !isTextGridVariant && disableGutters;
  const shouldHaveHorizontalBorders = !isTextGridVariant && (borders === 'horizontal' || borders === 'all');
  const shouldHaveVerticalBorders = !isTextGridVariant && (borders === 'vertical' || borders === 'all');

  // Flattening the children allows us to "see through" React Fragments and nested arrays.
  const flattenedChildren = flattenChildren(children);

  return (
    <InternalGrid
      ref={ref}
      disableGutters={true}
      gridDefinition={repeat(COLUMN_DEFS[columns] ?? {}, flattenedChildren.length)}
      className={clsx(styles.grid, styles[`grid-columns-${columns}`], styles[`grid-variant-${variant}`], {
        [styles['grid-horizontal-borders']]: shouldHaveHorizontalBorders,
        [styles['grid-vertical-borders']]: shouldHaveVerticalBorders,
        [styles['grid-no-gutters']]: shouldDisableGutters,
      })}
      __breakpoint={__breakpoint}
      __responsiveClassName={breakpoint => breakpoint && styles[`grid-breakpoint-${breakpoint}`]}
    >
      {children}
    </InternalGrid>
  );
});
