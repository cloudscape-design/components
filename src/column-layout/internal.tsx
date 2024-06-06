// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import { InternalColumnLayoutProps } from './interfaces';
import FlexibleColumnLayout from './flexible-column-layout';
import GridColumnLayout from './grid-column-layout';
import styles from './styles.css.js';

export const COLUMN_TRIGGERS = ['default', 'xxs', 'xs'] as const;
export type ColumnLayoutBreakpoint = (typeof COLUMN_TRIGGERS)[number] | null;

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
  __breakpoint,
  __internalRootRef,
  ...restProps
}: InternalColumnLayoutProps) {
  const baseProps = getBaseProps(restProps);

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles['column-layout'])} ref={__internalRootRef}>
      {minColumnWidth ? (
        <FlexibleColumnLayout
          columns={columns}
          borders={borders}
          variant={variant}
          minColumnWidth={minColumnWidth}
          disableGutters={disableGutters}
        >
          {children}
        </FlexibleColumnLayout>
      ) : (
        <GridColumnLayout
          columns={columns}
          variant={variant}
          borders={borders}
          disableGutters={disableGutters}
          __breakpoint={__breakpoint}
        >
          {children}
        </GridColumnLayout>
      )}
    </div>
  );
}
