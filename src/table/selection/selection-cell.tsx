// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { ButtonDropdownProps } from '../../button-dropdown/interfaces';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { TableTdElement, TableTdElementProps } from '../body-cell/td-element';
import { TableThElement, TableThElementProps } from '../header-cell/th-element';
import { Divider } from '../resizer';
import { ItemSelectionProps } from './interfaces';
import { SelectionControl, SelectionControlProps } from './selection-control';
import SelectionControllerDropdown from './selection-controller-dropdown';

import styles from '../styles.css.js';
import selectionStyles from './styles.css.js';

interface TableHeaderSelectionCellProps extends Omit<TableThElementProps, 'children' | 'colIndex'> {
  focusedComponent?: null | string;
  singleSelectionHeaderAriaLabel?: string;
  getSelectAllProps?: () => ItemSelectionProps;
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
  selectionControllerItems?: ButtonDropdownProps.Items;
  onSelectionControllerItemClick?: (detail: ButtonDropdownProps.ItemClickDetails) => void;
  selectionControllerAriaLabel?: string;
  loading?: boolean;
}

interface TableBodySelectionCellProps
  extends Omit<TableTdElementProps, 'children' | 'colIndex' | 'wrapLines' | 'isEditable' | 'isEditing'> {
  selectionControlProps?: SelectionControlProps;
  hasSelectionController?: boolean;
}

export function TableHeaderSelectionCell({
  focusedComponent,
  singleSelectionHeaderAriaLabel,
  getSelectAllProps,
  onFocusMove,
  selectionControllerItems,
  onSelectionControllerItemClick,
  selectionControllerAriaLabel,
  loading,
  ...props
}: TableHeaderSelectionCellProps) {
  const selectAllProps = getSelectAllProps ? getSelectAllProps() : undefined;
  const showController = !!selectAllProps && !!selectionControllerItems && selectionControllerItems.length > 0;
  return (
    <TableThElement
      {...props}
      isSelection={true}
      colIndex={0}
      focusedComponent={focusedComponent}
      ariaLabel={selectAllProps?.selectionGroupLabel}
      {...getAnalyticsMetadataAttribute({
        action: selectAllProps?.checked ? 'deselectAll' : 'selectAll',
      })}
    >
      {selectAllProps ? (
        showController ? (
          <div className={selectionStyles['selection-controller-wrapper']}>
            <SelectionControl
              onFocusDown={event => {
                onFocusMove!(event.target as HTMLElement, -1, +1);
              }}
              focusedComponent={focusedComponent}
              {...selectAllProps}
              {...(props.sticky ? { tabIndex: -1 } : {})}
            />
            <SelectionControllerDropdown
              items={selectionControllerItems}
              onItemClick={onSelectionControllerItemClick!}
              ariaLabel={selectionControllerAriaLabel}
              disabled={loading}
              sticky={props.sticky}
            />
          </div>
        ) : (
          <SelectionControl
            onFocusDown={event => {
              onFocusMove!(event.target as HTMLElement, -1, +1);
            }}
            focusedComponent={focusedComponent}
            {...selectAllProps}
            {...(props.sticky ? { tabIndex: -1 } : {})}
          />
        )
      ) : (
        <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
      )}
      <Divider className={styles['resize-divider']} />
    </TableThElement>
  );
}

export function TableBodySelectionCell({
  selectionControlProps,
  hasSelectionController,
  ...props
}: TableBodySelectionCellProps) {
  return (
    <TableTdElement {...props} isSelection={true} wrapLines={false} isEditable={false} isEditing={false} colIndex={0}>
      {selectionControlProps ? (
        hasSelectionController ? (
          <div className={selectionStyles['body-selection-controller-wrapper']}>
            <SelectionControl {...selectionControlProps} verticalAlign={props.verticalAlign} />
          </div>
        ) : (
          <SelectionControl {...selectionControlProps} verticalAlign={props.verticalAlign} />
        )
      ) : null}
    </TableTdElement>
  );
}
