// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { TableThElement, TableThElementProps } from '../header-cell/th-element';
import { Divider } from '../resizer';
import { SelectionProps } from './interfaces';
import { SelectionControl, SelectionControlProps } from './selection-control';

import styles from '../styles.css.js';
import { ThemeProps } from '../../theming/component/interfaces';

interface TableHeaderSelectionCellProps extends Omit<TableThElementProps, 'children' | 'colIndex'> {
  focusedComponent?: null | string;
  singleSelectionHeaderAriaLabel?: string;
  getSelectAllProps?: () => SelectionProps;
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
  theme?: any,
}

interface TableBodySelectionCellProps
  extends Omit<TableTdElementProps, 'children' | 'colIndex' | 'wrapLines' | 'isEditable' | 'isEditing'> {
  selectionControlProps?: SelectionControlProps;
  theme?: any,
}

export function TableHeaderSelectionCell({
  focusedComponent,
  singleSelectionHeaderAriaLabel,
  getSelectAllProps,
  onFocusMove,
  theme,
  ...props
}: TableHeaderSelectionCellProps) {
  const selectAllProps = getSelectAllProps ? getSelectAllProps() : undefined;
  return (
    <TableThElement
      {...props}
      isSelection={true}
      colIndex={0}
      focusedComponent={focusedComponent}
      ariaLabel={selectAllProps?.selectionGroupLabel}
    >
      {selectAllProps ? (
        <SelectionControl
          onFocusDown={event => {
            onFocusMove!(event.target as HTMLElement, -1, +1);
          }}
          focusedComponent={focusedComponent}
          {...selectAllProps}
          {...(props.sticky ? { tabIndex: -1 } : {})}
          theme={theme}
        />
      ) : (
        <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
      )}
      <Divider className={styles['resize-divider']} />
    </TableThElement>
  );
}

export function TableBodySelectionCell({ selectionControlProps, theme, ...props }: TableBodySelectionCellProps) {
  return (
    <TableTdElement {...props} isSelection={true} wrapLines={false} isEditable={false} isEditing={false} colIndex={0}>
      {selectionControlProps ? (
        <SelectionControl {...selectionControlProps} verticalAlign={props.verticalAlign} theme={theme} />
      ) : null}
    </TableTdElement>
  );
}
