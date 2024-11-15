// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { TableThElement, TableThElementProps } from '../header-cell/th-element';
import { Divider } from '../resizer';
import { SelectionProps } from './interfaces';
import { SelectionControl, SelectionControlProps } from './selection-control';

import headerCellStyles from '../header-cell/styles.css.js';
import styles from '../styles.css.js';

interface TableHeaderSelectionCellProps extends Omit<TableThElementProps, 'children' | 'colIndex'> {
  focusedComponent?: null | string;
  singleSelectionHeaderAriaLabel?: string;
  getSelectAllProps?: () => SelectionProps;
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
}

interface TableBodySelectionCellProps extends Omit<TableTdElementProps, 'children' | 'colIndex' | 'wrapLines'> {
  selectionControlProps?: SelectionControlProps;
}

export function TableHeaderSelectionCell({
  focusedComponent,
  singleSelectionHeaderAriaLabel,
  getSelectAllProps,
  onFocusMove,
  ...props
}: TableHeaderSelectionCellProps) {
  const isVisualRefresh = useVisualRefresh();
  const selectionCellClass = clsx(
    styles['selection-control'],
    styles['selection-control-header'],
    isVisualRefresh && styles['is-visual-refresh']
  );
  return (
    <TableThElement
      {...props}
      className={clsx(selectionCellClass, props.hidden && headerCellStyles['header-cell-hidden'])}
      colIndex={0}
      focusedComponent={focusedComponent}
    >
      {getSelectAllProps ? (
        <SelectionControl
          onFocusDown={event => {
            onFocusMove!(event.target as HTMLElement, -1, +1);
          }}
          focusedComponent={focusedComponent}
          {...getSelectAllProps()}
          {...(props.sticky ? { tabIndex: -1 } : {})}
        />
      ) : (
        <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
      )}
      <Divider className={styles['resize-divider']} />
    </TableThElement>
  );
}

export function TableBodySelectionCell({ selectionControlProps, ...props }: TableBodySelectionCellProps) {
  return (
    <TableTdElement {...props} className={styles['selection-control']} wrapLines={false} colIndex={0}>
      {selectionControlProps ? <SelectionControl {...selectionControlProps} /> : null}
    </TableTdElement>
  );
}
