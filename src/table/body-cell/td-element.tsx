// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { ColumnWidthStyle } from '../column-widths-utils';
import { ExpandToggleButton } from '../expandable-rows/expand-toggle-button';
import { TableProps } from '../interfaces.js';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { getTableCellRoleProps, TableRole } from '../table-role';
import { getStickyClassNames } from '../utils';

import tableStyles from '../styles.css.js';
import styles from './styles.css.js';

export interface TableTdElementProps {
  wrapLines: boolean | undefined;
  isRowHeader?: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
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
}

export const TableTdElement = React.forwardRef<HTMLTableCellElement, TableTdElementProps>(
  (
    {
      children,
      wrapLines,
      isRowHeader,
      isFirstRow,
      isLastRow,
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
      ...rest
    },
    ref
  ) => {
    const Element = isRowHeader ? 'th' : 'td';
    const isVisualRefresh = useVisualRefresh();

    resizableStyle = resizableColumns ? {} : resizableStyle;

    nativeAttributes = { ...nativeAttributes, ...getTableCellRoleProps({ tableRole, isRowHeader, colIndex }) };

    const stickyStyles = useStickyCellStyles({
      stickyColumns: stickyState,
      columnId,
      getClassName: props => getStickyClassNames(styles, props),
    });

    const cellRefObject = useRef<HTMLTableCellElement>(null);
    const mergedRef = useMergeRefs(stickyStyles.ref, ref, cellRefObject);
    const { tabIndex: cellTabIndex } = useSingleTabStopNavigation(cellRefObject);
    const isEditingActive = isEditing && !isEditingDisabled;

    return (
      <Element
        style={{ ...resizableStyle, ...stickyStyles.style }}
        className={clsx(
          styles['body-cell'],
          isFirstRow && styles['body-cell-first-row'],
          isLastRow && styles['body-cell-last-row'],
          isSelected && styles['body-cell-selected'],
          isNextSelected && styles['body-cell-next-selected'],
          isPrevSelected && styles['body-cell-prev-selected'],
          !isEvenRow && stripedRows && styles['body-cell-shaded'],
          stripedRows && styles['has-striped-rows'],
          isVisualRefresh && styles['is-visual-refresh'],
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
          stickyStyles.className
        )}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={mergedRef}
        {...nativeAttributes}
        tabIndex={cellTabIndex === -1 ? undefined : cellTabIndex}
        {...copyAnalyticsMetadataAttribute(rest)}
      >
        {level !== undefined && isExpandable && !isEditingActive && (
          <div className={styles['expandable-toggle-wrapper']}>
            <ExpandToggleButton
              isExpanded={isExpanded}
              onExpandableItemToggle={onExpandableItemToggle}
              expandButtonLabel={expandButtonLabel}
              collapseButtonLabel={collapseButtonLabel}
            />
          </div>
        )}

        <div className={clsx(styles['body-cell-content'], wrapLines && styles['body-cell-wrap'])}>{children}</div>
      </Element>
    );
  }
);

function getLevelClassSuffix(level: number) {
  return 0 <= level && level <= 9 ? level : 'next';
}
