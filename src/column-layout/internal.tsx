// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { InternalColumnLayoutProps } from './interfaces';
import ColumnLayoutWithCSS from './with-css';
import ColumnLayoutWithGrid from './with-grid';

export const COLUMN_TRIGGERS = ['default', 'xxs', 'xs'] as const;
export type ColumnLayoutBreakpoint = typeof COLUMN_TRIGGERS[number] | null;

/**
 * A responsive grid layout.
 */
export default React.forwardRef(function ColumnLayout(
  {
    columns = 1,
    variant = 'default',
    borders = 'none',
    disableGutters = false,
    minColumnWidth,
    children,
    __breakpoint,
    __internalRootRef,
    ...restProps
  }: InternalColumnLayoutProps,
  ref?: React.Ref<any>
) {
  const baseProps = getBaseProps(restProps);

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles['column-layout'])} ref={__internalRootRef}>
      {minColumnWidth ? (
        <ColumnLayoutWithCSS
          columns={columns}
          borders={borders}
          variant={variant}
          minColumnWidth={minColumnWidth}
          disableGutters={disableGutters}
        >
          {children}
        </ColumnLayoutWithCSS>
      ) : (
        <ColumnLayoutWithGrid
          columns={columns}
          variant={variant}
          borders={borders}
          disableGutters={disableGutters}
          __breakpoint={__breakpoint}
          ref={ref}
        >
          {children}
        </ColumnLayoutWithGrid>
      )}
    </div>
  );
});
