// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import FlexibleColumnLayout from './flexible-column-layout';
import GridColumnLayout from './grid-column-layout';
import { InternalColumnLayoutProps } from './internal-interfaces';

import styles from './styles.css.js';

export const COLUMN_TRIGGERS = ['default', 'xxs', 'xs'] as const;
export type ColumnLayoutBreakpoint = (typeof COLUMN_TRIGGERS)[number] | null;

/**
 * The 12-column grid renderer can only express column counts that divide 12 evenly, and its
 * divider styles are generated per count. Anything above this uses the CSS grid renderer instead.
 */
export const MAX_GRID_COLUMNS = 4;

/**
 * Upper bound on `columns`, matching the twelve units the grid renderer is built around. Counts
 * above this are clamped rather than rejected, so an out-of-range value degrades to the widest
 * supported layout instead of producing unreadably narrow columns.
 */
export const MAX_COLUMNS = 12;

/**
 * A responsive grid layout.
 */
export default function ColumnLayout({
  columns = 1,
  variant = 'default',
  borders = 'none',
  disableGutters = false,
  minColumnWidth,
  children,
  __tagOverride,
  __breakpoint,
  __internalRootRef,
  ...restProps
}: InternalColumnLayoutProps) {
  const baseProps = getBaseProps(restProps);

  if (columns > MAX_COLUMNS) {
    warnOnce(
      'ColumnLayout',
      `\`columns\` (${columns}) exceeds the maximum of ${MAX_COLUMNS}. Rendering ${MAX_COLUMNS} columns instead.`
    );
  }

  const columnCount = Math.min(columns, MAX_COLUMNS);
  const useCssGrid = Boolean(minColumnWidth) || columnCount > MAX_GRID_COLUMNS;

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles['column-layout'])} ref={__internalRootRef}>
      {useCssGrid ? (
        <FlexibleColumnLayout
          columns={columnCount}
          variant={variant}
          minColumnWidth={minColumnWidth}
          disableGutters={disableGutters}
          __tagOverride={__tagOverride}
        >
          {children}
        </FlexibleColumnLayout>
      ) : (
        <GridColumnLayout
          columns={columnCount}
          variant={variant}
          borders={borders}
          disableGutters={disableGutters}
          __breakpoint={__breakpoint}
          __tagOverride={__tagOverride}
        >
          {children}
        </GridColumnLayout>
      )}
    </div>
  );
}
