// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { GeneratedAnalyticsMetadataTableSelectAll } from './analytics-metadata/interfaces';
import { TableHeaderCell } from './header-cell';
import { TableProps } from './interfaces';
import { focusMarkers, SelectionProps } from './selection';
import { TableHeaderSelectionCell } from './selection/selection-cell';
import { StickyColumnsModel } from './sticky-columns';
import { getTableHeaderRowRoleProps, TableRole } from './table-role';
import { useColumnWidths } from './use-column-widths';
import { getColumnKey } from './utils';

import styles from './styles.css.js';

export interface TheadProps {
  selectionType: TableProps.SelectionType | undefined;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  sortingColumn: TableProps.SortingColumn<any> | undefined;
  sortingDescending: boolean | undefined;
  sortingDisabled: boolean | undefined;
  variant: TableProps.Variant;
  wrapLines: boolean | undefined;
  resizableColumns: boolean | undefined;
  getSelectAllProps?: () => SelectionProps;
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
  onResizeFinish: (newWidths: Map<PropertyKey, number>) => void;
  onSortingChange: NonCancelableEventHandler<TableProps.SortingState<any>> | undefined;
  sticky?: boolean;
  hidden?: boolean;
  stuck?: boolean;
  singleSelectionHeaderAriaLabel?: string;
  resizerRoleDescription?: string;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;
  selectionColumnId: PropertyKey;
  focusedComponent?: null | string;
  onFocusedComponentChange?: (focusId: null | string) => void;
  tableRole: TableRole;
  isExpandable?: boolean;
  setLastUserAction: (name: string) => void;
}

const Thead = React.forwardRef(
  (
    {
      selectionType,
      getSelectAllProps,
      columnDefinitions,
      sortingColumn,
      sortingDisabled,
      sortingDescending,
      resizableColumns,
      variant,
      wrapLines,
      onFocusMove,
      onSortingChange,
      onResizeFinish,
      singleSelectionHeaderAriaLabel,
      stripedRows,
      sticky = false,
      hidden = false,
      stuck = false,
      stickyState,
      selectionColumnId,
      focusedComponent,
      onFocusedComponentChange,
      tableRole,
      resizerRoleDescription,
      isExpandable,
      setLastUserAction,
    }: TheadProps,
    outerRef: React.Ref<HTMLTableRowElement>
  ) => {
    const { getColumnStyles, columnWidths, updateColumn, setCell } = useColumnWidths();

    const commonCellProps = {
      stuck,
      sticky,
      hidden,
      stripedRows,
      tableRole,
      variant,
      stickyState,
    };

    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr
          {...focusMarkers.all}
          ref={outerRef}
          aria-rowindex={1}
          {...getTableHeaderRowRoleProps({ tableRole })}
          onFocus={event => {
            const focusControlElement = findUpUntil(event.target, element => !!element.getAttribute('data-focus-id'));
            const focusId = focusControlElement?.getAttribute('data-focus-id') ?? null;
            onFocusedComponentChange?.(focusId);
          }}
          onBlur={() => onFocusedComponentChange?.(null)}
        >
          {selectionType ? (
            <TableHeaderSelectionCell
              {...commonCellProps}
              focusedComponent={focusedComponent}
              columnId={selectionColumnId}
              getSelectAllProps={getSelectAllProps}
              onFocusMove={onFocusMove}
              singleSelectionHeaderAriaLabel={singleSelectionHeaderAriaLabel}
              {...getAnalyticsMetadataAttribute({
                action: 'selectAll',
              } as Partial<GeneratedAnalyticsMetadataTableSelectAll>)}
            />
          ) : null}

          {columnDefinitions.map((column, colIndex) => {
            const columnId = getColumnKey(column, colIndex);
            return (
              <TableHeaderCell
                {...commonCellProps}
                key={columnId}
                tabIndex={sticky ? -1 : 0}
                focusedComponent={focusedComponent}
                column={column}
                activeSortingColumn={sortingColumn}
                sortingDescending={sortingDescending}
                sortingDisabled={sortingDisabled}
                wrapLines={wrapLines}
                colIndex={selectionType ? colIndex + 1 : colIndex}
                columnId={columnId}
                updateColumn={updateColumn}
                onResizeFinish={() => onResizeFinish(columnWidths)}
                resizableColumns={resizableColumns}
                resizableStyle={getColumnStyles(sticky, columnId)}
                onClick={detail => {
                  setLastUserAction('sorting');
                  fireNonCancelableEvent(onSortingChange, detail);
                }}
                isEditable={!!column.editConfig}
                cellRef={node => setCell(sticky, columnId, node)}
                tableRole={tableRole}
                resizerRoleDescription={resizerRoleDescription}
                // Expandable option is only applicable to the first data column of the table.
                // When present, the header content receives extra padding to match the first offset in the data cells.
                isExpandable={colIndex === 0 && isExpandable}
                hasDynamicContent={hidden && !resizableColumns && column.hasDynamicContent}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
