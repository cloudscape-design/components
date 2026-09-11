// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { ExpandToggleButton } from '../../internal/components/expand-toggle-button';
import { InternalTableCell } from '../../table-cell/internal';
import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces.js';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { getTableCellRoleProps, TableRole } from '../table-role';
import { getStickyClassNames } from '../utils';

import tableStyles from '../styles.css.js';
import testUtilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface TableTdElementProps {
  wrapLines: boolean | undefined;
  isRowHeader?: boolean;
  isSelected: boolean;
  isNextSelected: boolean;
  isPrevSelected: boolean;
  nativeAttributes?: Omit<
    React.TdHTMLAttributes<HTMLTableCellElement> | React.ThHTMLAttributes<HTMLTableCellElement>,
    'style' | 'className' | 'onClick'
  >;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  isSelection?: boolean;
  hasSelection?: boolean;
  hasFooter?: boolean;
  columnId: PropertyKey;
  colIndex: number;
  stickyState: StickyColumnsModel;
  tableRole: TableRole;
  level?: number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onExpandableItemToggle?: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
  verticalAlign?: TableProps.VerticalAlign;
  resizableColumns?: boolean;
  resizableStyle?: ColumnWidthStyle;
  isEditable: boolean;
  isEditing: boolean;
  isEditingDisabled?: boolean;
  hasSuccessIcon?: boolean;
  tableVariant?: string;
  counter?: React.ReactNode;
}

export const TableTdElement = React.forwardRef<HTMLTableCellElement, TableTdElementProps>(
  (
    {
      children,
      wrapLines,
      isRowHeader,
      isSelected,
      isNextSelected,
      isPrevSelected,
      nativeAttributes,
      onClick,
      onFocus,
      onBlur,
      isEvenRow,
      stripedRows,
      isSelection,
      hasSelection,
      hasFooter,
      columnId,
      colIndex,
      stickyState,
      tableRole,
      level,
      isExpandable,
      isExpanded,
      onExpandableItemToggle,
      expandButtonLabel,
      collapseButtonLabel,
      verticalAlign,
      resizableColumns,
      resizableStyle,
      isEditable,
      isEditing,
      isEditingDisabled,
      hasSuccessIcon,
      tableVariant,
      counter,
      ...rest
    },
    ref
  ) => {
    const tag = isRowHeader ? 'th' : 'td';

    resizableStyle = resizableColumns ? {} : resizableStyle;

    const cellNativeAttributes = {
      ...nativeAttributes,
      ...getTableCellRoleProps({ tableRole, isRowHeader, colIndex }),
      ...copyAnalyticsMetadataAttribute(rest),
    };

    const stickyStyles = useStickyCellStyles({
      stickyColumns: stickyState,
      columnId,
      getClassName: props => getStickyClassNames(styles, props),
    });

    const cellRefObject = useRef<HTMLTableCellElement>(null);
    const mergedRef = useMergeRefs(stickyStyles.ref, ref, cellRefObject);
    const { tabIndex: cellTabIndex } = useSingleTabStopNavigation(cellRefObject);
    const isEditingActive = isEditing && !isEditingDisabled;

    // The bare `.body-cell` substrate (element, base padding, `.body-cell-content`
    // wrapper, ref) is provided by the extracted InternalTableCell. All feature
    // layering stays here, keyed on the same `.body-cell` class so the compound
    // `.body-cell.<feature>` CSS continues to match unchanged.
    return (
      <InternalTableCell
        ref={mergedRef}
        tag={tag}
        style={{ ...resizableStyle, ...stickyStyles.style }}
        className={clsx(
          isSelected && styles['body-cell-selected'],
          isNextSelected && styles['body-cell-next-selected'],
          isPrevSelected && styles['body-cell-prev-selected'],
          !isEvenRow && stripedRows && styles['body-cell-shaded'],
          stripedRows && styles['has-striped-rows'],
          isSelection && tableStyles['selection-control'],
          hasSelection && styles['has-selection'],
          hasFooter && styles['has-footer'],
          resizableColumns && styles['resizable-columns'],
          verticalAlign === 'top' && styles['body-cell-align-top'],
          isEditable && styles['body-cell-editable'],
          isEditing && !isEditingDisabled && styles['body-cell-edit-active'],
          isEditing && isEditingDisabled && styles['body-cell-edit-disabled-popover'],
          hasSuccessIcon && styles['body-cell-has-success'],
          level !== undefined && !isEditingActive && styles['body-cell-expandable'],
          level !== undefined && !isEditingActive && styles[`expandable-level-${getLevelClassSuffix(level)}`],
          tableVariant && styles[`table-variant-${tableVariant}`],
          stickyStyles.className
        )}
        wrapLines={wrapLines}
        nativeAttributes={cellNativeAttributes}
        suppressBlockStartPlaceholder={isSelected}
        suppressBlockEndPlaceholder={isSelected || !!hasFooter}
        tabIndex={cellTabIndex === -1 ? undefined : cellTabIndex}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        beforeContent={
          level !== undefined && isExpandable && !isEditingActive ? (
            <div className={styles['expandable-toggle-wrapper']}>
              <ExpandToggleButton
                isExpanded={isExpanded}
                onExpandableItemToggle={onExpandableItemToggle}
                expandButtonLabel={expandButtonLabel}
                collapseButtonLabel={collapseButtonLabel}
              />
            </div>
          ) : null
        }
      >
        {children}
        {counter ? (
          <div className={styles['body-cell-counter']}>
            <span> </span>
            <span className={testUtilStyles['body-cell-counter']}>{counter}</span>
          </div>
        ) : null}
      </InternalTableCell>
    );
  }
);

function getLevelClassSuffix(level: number) {
  return 0 <= level && level <= 9 ? level : 'next';
}
