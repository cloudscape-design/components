// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { TableGroupedTypes } from './column-grouping-utils';
import { TableHeaderCell } from './header-cell';
import { TableGroupHeaderCell } from './header-cell/group-header-cell';
import { InternalSelectionType, TableProps } from './interfaces';
import { focusMarkers, ItemSelectionProps } from './selection';
import { TableHeaderSelectionCell } from './selection/selection-cell';
import { StickyColumnsModel } from './sticky-columns';
import { getTableHeaderRowRoleProps, TableRole } from './table-role';
import { useColumnWidths } from './use-column-widths';
import { getColumnKey } from './utils';

import styles from './styles.css.js';

export interface TheadProps {
  selectionType: undefined | InternalSelectionType;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  columnGroupingDefinitions?: ReadonlyArray<TableProps.ColumnGroupsDefinition<any>>;
  hierarchicalStructure?: TableGroupedTypes.HierarchicalStructure<any>;
  sortingColumn: TableProps.SortingColumn<any> | undefined;
  sortingDescending: boolean | undefined;
  sortingDisabled: boolean | undefined;
  variant: TableProps.Variant;
  tableVariant?: TableProps.Variant;
  wrapLines: boolean | undefined;
  resizableColumns: boolean | undefined;
  getSelectAllProps?: () => ItemSelectionProps;
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
  onResizeFinish: (newWidths: Map<PropertyKey, number>) => void;
  onSortingChange: NonCancelableEventHandler<TableProps.SortingState<any>> | undefined;
  sticky?: boolean;
  hidden?: boolean;
  stuck?: boolean;
  singleSelectionHeaderAriaLabel?: string;
  resizerRoleDescription?: string;
  resizerTooltipText?: string;
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
      // columnGroupingDefinitions,
      hierarchicalStructure: h, // TODO: change to normal later, no convert to h
      sortingColumn,
      sortingDisabled,
      sortingDescending,
      resizableColumns,
      variant,
      tableVariant,
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
      resizerTooltipText,
      isExpandable,
      setLastUserAction,
    }: TheadProps,
    outerRef: React.Ref<HTMLTableRowElement>
  ) => {
    const { getColumnStyles, columnWidths, updateColumn, updateGroup, setCell } = useColumnWidths();

    /// TODO: Remove this nati later, JUST TESTING :)
    const hierarchicalStructure: TableGroupedTypes.HierarchicalStructure<any> = {
      // maxDepth: 1,
      maxDepth: h?.maxDepth ?? 1,
      columnToParentIds: h?.columnToParentIds ?? new Map<string, string[]>(),
      // rows: h?.rows?.slice(-1) ?? [],  // - shows only last column
      rows: h?.rows ?? [],
    };

    // Helper to get child column IDs for a group (for getting minWidths)
    const getChildColumnIds = (groupId: string): string[] => {
      if (!hierarchicalStructure) {
        return [];
      }

      const childIds: string[] = [];
      const leafRow = hierarchicalStructure.rows[hierarchicalStructure.rows.length - 1];

      leafRow.columns.forEach(col => {
        if (!col.isGroup && col.parentGroupIds.includes(groupId)) {
          childIds.push(col.id);
        }
      });

      return childIds;
    };

    // Helper to get minWidth for columns
    const getColumnMinWidths = (columnIds: string[]): Map<string, number> => {
      const minWidths = new Map<string, number>();

      columnIds.forEach(colId => {
        const col = columnDefinitions.find((c, idx) => (c.id || `column-${idx}`) === colId);
        if (col && col.minWidth) {
          const minWidth = typeof col.minWidth === 'string' ? parseInt(col.minWidth) : col.minWidth;
          minWidths.set(colId, minWidth);
        }
      });

      return minWidths;
    };

    const commonCellProps = {
      stuck,
      sticky,
      hidden,
      stripedRows,
      tableRole,
      variant,
      tableVariant,
      stickyState,
    };

    // No grouping - render single row
    if (!hierarchicalStructure || hierarchicalStructure.rows.length <= 1) {
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
                  resizableStyle={resizableColumns ? {} : getColumnStyles(sticky, columnId)}
                  onClick={detail => {
                    setLastUserAction('sorting');
                    fireNonCancelableEvent(onSortingChange, detail);
                  }}
                  isEditable={!!column.editConfig}
                  cellRef={node => setCell(sticky, columnId, node)}
                  tableRole={tableRole}
                  resizerRoleDescription={resizerRoleDescription}
                  resizerTooltipText={resizerTooltipText}
                  isExpandable={colIndex === 0 && isExpandable}
                  hasDynamicContent={hidden && !resizableColumns && column.hasDynamicContent}
                />
              );
            })}
          </tr>
        </thead>
      );
    }

    // Grouped columns
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        {hierarchicalStructure.rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            {...(rowIndex === 0 ? focusMarkers.all : {})}
            ref={rowIndex === 0 ? outerRef : undefined}
            aria-rowindex={rowIndex + 1}
            {...getTableHeaderRowRoleProps({ tableRole, rowIndex })}
            onFocus={
              rowIndex === 0
                ? event => {
                    const focusControlElement = findUpUntil(
                      event.target,
                      element => !!element.getAttribute('data-focus-id')
                    );
                    const focusId = focusControlElement?.getAttribute('data-focus-id') ?? null;
                    onFocusedComponentChange?.(focusId);
                  }
                : undefined
            }
            onBlur={rowIndex === 0 ? () => onFocusedComponentChange?.(null) : undefined}
          >
            {/* Selection column only in first row */}
            {rowIndex === 0 && selectionType ? (
              <TableHeaderSelectionCell
                {...commonCellProps}
                focusedComponent={focusedComponent}
                columnId={selectionColumnId}
                getSelectAllProps={getSelectAllProps}
                onFocusMove={onFocusMove}
                singleSelectionHeaderAriaLabel={singleSelectionHeaderAriaLabel}
                rowSpan={hierarchicalStructure.maxDepth}
              />
            ) : null}

            {row.columns.map(col => {
              if (col.isGroup) {
                // Group header cell
                const groupDefinition = col.groupDefinition!;
                const childIds = getChildColumnIds(col.id);

                return (
                  <TableGroupHeaderCell
                    {...commonCellProps}
                    key={col.id}
                    tabIndex={sticky ? -1 : 0}
                    focusedComponent={focusedComponent}
                    group={groupDefinition}
                    colspan={col.colspan}
                    rowspan={col.rowspan}
                    colIndex={selectionType ? col.colIndex + 1 : col.colIndex}
                    groupId={col.id}
                    resizableColumns={resizableColumns}
                    resizableStyle={resizableColumns ? {} : getColumnStyles(sticky, col.id)}
                    onResizeFinish={() => onResizeFinish(columnWidths)}
                    updateGroupWidth={(groupId, newWidth) => {
                      updateGroup(groupId, newWidth);
                    }}
                    childColumnIds={childIds}
                    childColumnMinWidths={getColumnMinWidths(childIds)}
                    cellRef={node => setCell(sticky, col.id, node)}
                    resizerRoleDescription={resizerRoleDescription}
                    resizerTooltipText={resizerTooltipText}
                  />
                );
              } else {
                // Regular column cell
                const column = col.columnDefinition!;
                const columnId = col.id;
                const colIndex = col.colIndex;

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
                    resizableStyle={resizableColumns ? {} : getColumnStyles(sticky, columnId)}
                    onClick={detail => {
                      setLastUserAction('sorting');
                      fireNonCancelableEvent(onSortingChange, detail);
                    }}
                    isEditable={!!column.editConfig}
                    cellRef={node => {
                      setCell(sticky, columnId, node);
                    }}
                    tableRole={tableRole}
                    resizerRoleDescription={resizerRoleDescription}
                    resizerTooltipText={resizerTooltipText}
                    isExpandable={colIndex === 0 && isExpandable}
                    hasDynamicContent={hidden && !resizableColumns && column.hasDynamicContent}
                    colSpan={col.colspan}
                    rowSpan={col.rowspan}
                  />
                );
              }
            })}
          </tr>
        ))}
      </thead>
    );
  }
);

export default Thead;
