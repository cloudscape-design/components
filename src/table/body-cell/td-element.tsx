// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import styles from './styles.css.js';
import { getStickyClassNames } from '../utils';
import { StickyColumnsModel, useStickyCellStyles } from '../sticky-columns';
import { TableRole, getTableCellRoleProps } from '../table-role';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import { ExpandToggleButton } from '../expandable-rows/expand-toggle-button';

export interface TableTdElementProps {
  className?: string;
  style?: React.CSSProperties;
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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  hasSelection?: boolean;
  hasFooter?: boolean;
  columnId: PropertyKey;
  colIndex: number;
  stickyState: StickyColumnsModel;
  isVisualRefresh?: boolean;
  tableRole: TableRole;
  level?: number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onExpandableItemToggle?: () => void;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
}

export const TableTdElement = React.forwardRef<HTMLTableCellElement, TableTdElementProps>(
  (
    {
      className,
      style,
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
      onMouseEnter,
      onMouseLeave,
      isEvenRow,
      stripedRows,
      isVisualRefresh,
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
    },
    ref
  ) => {
    const Element = isRowHeader ? 'th' : 'td';

    nativeAttributes = { ...nativeAttributes, ...getTableCellRoleProps({ tableRole, isRowHeader, colIndex }) };

    const stickyStyles = useStickyCellStyles({
      stickyColumns: stickyState,
      columnId,
      getClassName: props => getStickyClassNames(styles, props),
    });

    const cellRefObject = useRef<HTMLTableCellElement>(null);
    const mergedRef = useMergeRefs(stickyStyles.ref, ref, cellRefObject);
    const { tabIndex: cellTabIndex } = useSingleTabStopNavigation(cellRefObject);

    return (
      <Element
        style={{ ...style, ...stickyStyles.style }}
        className={clsx(
          className,
          styles['body-cell'],
          wrapLines && styles['body-cell-wrap'],
          isFirstRow && styles['body-cell-first-row'],
          isLastRow && styles['body-cell-last-row'],
          isSelected && styles['body-cell-selected'],
          isNextSelected && styles['body-cell-next-selected'],
          isPrevSelected && styles['body-cell-prev-selected'],
          !isEvenRow && stripedRows && styles['body-cell-shaded'],
          stripedRows && styles['has-striped-rows'],
          isVisualRefresh && styles['is-visual-refresh'],
          hasSelection && styles['has-selection'],
          hasFooter && styles['has-footer'],
          level !== undefined && styles['body-cell-expandable'],
          level !== undefined && styles[`body-cell-expandable-level-${getLevelClassSuffix(level)}`],
          stickyStyles.className
        )}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={mergedRef}
        {...nativeAttributes}
        tabIndex={cellTabIndex === -1 ? undefined : cellTabIndex}
      >
        {level !== undefined && isExpandable && (
          <div className={styles['expandable-toggle-wrapper']}>
            <ExpandToggleButton
              isExpanded={isExpanded}
              onExpandableItemToggle={onExpandableItemToggle}
              expandButtonLabel={expandButtonLabel}
              collapseButtonLabel={collapseButtonLabel}
            />
          </div>
        )}
        <span className={styles['body-cell-content']}>{children}</span>
      </Element>
    );
  }
);

function getLevelClassSuffix(level: number) {
  return 1 <= level && level <= 9 ? level : 'next';
}
