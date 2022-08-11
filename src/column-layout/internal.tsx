// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';
import InternalGrid from '../grid/internal';
import { GridProps } from '../grid/interfaces';
import { getBaseProps } from '../internal/base-component';
import { repeat } from './util';
import styles from './styles.css.js';
import { InternalColumnLayoutProps } from './interfaces';

export const COLUMN_TRIGGERS = ['default', 'xxs', 'xs'] as const;
export type ColumnLayoutBreakpoint = typeof COLUMN_TRIGGERS[number] | null;
const COLUMN_DEFS: Record<number, GridProps.ElementDefinition | undefined> = {
  1: { colspan: { default: 12, xxs: 12, xs: 12 } },
  2: { colspan: { default: 12, xxs: 6, xs: 6 } },
  3: { colspan: { default: 12, xxs: 6, xs: 4 } },
  4: { colspan: { default: 12, xxs: 6, xs: 3 } },
};

/**
 * A responsive grid layout.
 */
export default React.forwardRef(function ColumnLayout(
  {
    columns = 1,
    variant = 'default',
    borders = 'none',
    disableGutters = false,
    children,
    __breakpoint,
    __internalRootRef,
    ...restProps
  }: InternalColumnLayoutProps,
  ref?: React.Ref<any>
) {
  const baseProps = getBaseProps(restProps);
  const isTextGridVariant = variant === 'text-grid';
  const shouldDisableGutters = !isTextGridVariant && disableGutters;
  const shouldHaveHorizontalBorders = !isTextGridVariant && (borders === 'horizontal' || borders === 'all');
  const shouldHaveVerticalBorders = !isTextGridVariant && (borders === 'vertical' || borders === 'all');
  /*
   Flattening the children allows us to "see through" React Fragments and nested arrays.
   */
  const flattenedChildren = flattenChildren(children);

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles['column-layout'])} ref={__internalRootRef}>
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
        {flattenedChildren.map(child => {
          const key = typeof child !== 'string' && typeof child !== 'number' ? child.key : undefined;
          return (
            <div key={key} className={styles['restore-pointer-events']}>
              {child}
            </div>
          );
        })}
      </InternalGrid>
    </div>
  );
});
