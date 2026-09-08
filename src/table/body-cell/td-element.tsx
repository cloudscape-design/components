// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { ExpandToggleButton } from '../../internal/components/expand-toggle-button';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { Cell as AtomicCell } from '../../table-cell/internal';
import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces.js';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { getTableCellRoleProps, TableRole } from '../table-role';
import { getStickyClassNames } from '../utils';

import cellStyles from '../../table-cell/styles.css.js';
import tableStyles from '../styles.css.js';
import testUtilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';

// false keeps sticky columns on the Table's own <td> path instead of the reused atomic Cell.
const MIGRATE_STICKY_CELLS = true;
// VR-oracle harness escape hatch: false renders every column on the Table's own <td> path.
const MIGRATE_ATOMIC_CELLS = true;

export interface TableTdElementProps {
  wrapLines: boolean | undefined;
  isRowHeader?: boolean;
  isFirstRow: boolean;
  isLastRow: boolean;
  isSelected: boolean;
  isPrevSelected?: boolean;
  isNextSelected?: boolean;
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
  isAtomicRow?: boolean;
  isSelection?: boolean;
  hasSelection?: boolean;
  hasStickyColumns?: boolean;
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
      isFirstRow,
      isLastRow,
      isSelected,
      isPrevSelected,
      isNextSelected,
      nativeAttributes,
      onClick,
      onFocus,
      onBlur,
      isEvenRow,
      stripedRows,
      isAtomicRow,
      isSelection,
      hasSelection,
      hasStickyColumns,
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
    const Element = isRowHeader ? 'th' : 'td';
    const isVisualRefresh = useVisualRefresh();

    resizableStyle = resizableColumns ? {} : resizableStyle;

    nativeAttributes = { ...nativeAttributes, ...getTableCellRoleProps({ tableRole, isRowHeader, colIndex }) };

    // Computed before useStickyCellStyles so getClassName can also emit the table-cell module's
    // sticky classes: CSS-module names are per-file-hashed, so the reused cell needs its own module's
    // `.cell.sticky-cell` classes (not just the body-cell ones) for position:sticky to match.
    const willUseAtomicCell = MIGRATE_ATOMIC_CELLS && !isRowHeader && !isEditable && !isEditing && level === undefined;

    const stickyStyles = useStickyCellStyles({
      stickyColumns: stickyState,
      columnId,
      getClassName: props => ({
        ...getStickyClassNames(styles, props),
        // Mirror only the sticky classes implemented in table-cell/styles.scss onto the reused cell.
        ...(willUseAtomicCell
          ? {
              [cellStyles['sticky-cell']]: !!props,
              [cellStyles['sticky-cell-last-inline-start']]: !!props?.lastInsetInlineStart,
              [cellStyles['sticky-cell-last-inline-end']]: !!props?.lastInsetInlineEnd,
              [cellStyles['sticky-cell-pad-inline-start']]: !!props?.padInlineStart,
            }
          : {}),
      }),
    });

    const cellRefObject = useRef<HTMLTableCellElement>(null);
    const mergedRef = useMergeRefs(stickyStyles.ref, ref, cellRefObject);
    const { tabIndex: cellTabIndex } = useSingleTabStopNavigation(cellRefObject);
    const isEditingActive = isEditing && !isEditingDisabled;

    const isStickyCell = !!stickyStyles.className;

    // These cells self-paint selection/stripe via their own module classes (no data-selected on the
    // <td>); the Table passes prev/next-selected explicitly since it knows the sibling rows.
    const useAtomicCell =
      MIGRATE_ATOMIC_CELLS &&
      !isRowHeader &&
      !isEditable &&
      !isEditing &&
      level === undefined &&
      (MIGRATE_STICKY_CELLS || !isStickyCell);
    if (useAtomicCell) {
      return (
        <AtomicCell
          __ref={mergedRef}
          __style={{ ...resizableStyle, ...stickyStyles.style }}
          __tabIndex={cellTabIndex === -1 ? undefined : cellTabIndex}
          __selected={isSelected}
          __shaded={stripedRows && !isEvenRow}
          __prevSelected={isSelected && !!isPrevSelected}
          __nextSelected={isSelected && !!isNextSelected}
          __notSelectedNext={!isSelected && !!isNextSelected}
          // body-cell-first-row's placeholder only adds height under sticky columns; the atomic <td>
          // has no inner wrapper to absorb it, so gate on hasStickyColumns to keep the non-sticky row at 39px.
          __firstRow={isFirstRow && hasStickyColumns}
          __lastRow={isLastRow}
          __hasFooter={hasFooter}
          __isVisualRefresh={isVisualRefresh}
          __hasSelection={hasSelection}
          __hasStripedRows={stripedRows}
          __tableVariant={tableVariant}
          __nativeAttributes={
            {
              ...nativeAttributes,
              ...(isSelection ? {} : copyAnalyticsMetadataAttribute(rest)),
            } as React.TdHTMLAttributes<HTMLTableCellElement>
          }
          __onClick={onClick}
          __onFocus={onFocus}
          __onBlur={onBlur}
          // Only Table-owned feature classes layer on the reused cell (sticky pinning, selection-control
          // width); selection/divider/stripe belong to the atomic cell's own module.
          __featureClassName={
            clsx(isSelection && tableStyles['selection-control'], stickyStyles.className) || undefined
          }
        >
          {/* Truncation lives on this wrapper, not the <td>, so the cell stays overflow:visible and
              interactive-control focus rings aren't clipped. */}
          <div className={clsx(styles['body-cell-content'], wrapLines && styles['body-cell-wrap'])}>
            {children}
            {counter ? (
              <div className={styles['body-cell-counter']}>
                <span> </span>
                <span className={testUtilStyles['body-cell-counter']}>{counter}</span>
              </div>
            ) : null}
          </div>
        </AtomicCell>
      );
    }

    return (
      <Element
        style={{ ...resizableStyle, ...stickyStyles.style }}
        className={clsx(
          styles['body-cell'],
          isFirstRow && styles['body-cell-first-row'],
          isLastRow && styles['body-cell-last-row'],
          !isAtomicRow && !isEvenRow && stripedRows && styles['body-cell-shaded'],
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
          tableVariant && styles[`table-variant-${tableVariant}`],
          stickyStyles.className
        )}
        // data-* markers still drive last-row/stripe-divider/sticky-occlusion rules; the selected-border
        // paint is row-gated via CSS adjacency (no per-cell prev/next needed).
        data-selected={isSelected || undefined}
        data-shaded={(stripedRows && !isEvenRow) || undefined}
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

        <div className={clsx(styles['body-cell-content'], wrapLines && styles['body-cell-wrap'])}>
          {children}
          {counter ? (
            <div className={styles['body-cell-counter']}>
              <span> </span>
              <span className={testUtilStyles['body-cell-counter']}>{counter}</span>
            </div>
          ) : null}
        </div>
      </Element>
    );
  }
);

function getLevelClassSuffix(level: number) {
  return 0 <= level && level <= 9 ? level : 'next';
}
