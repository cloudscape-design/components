// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { TableGroupedTypes } from './column-grouping-utils';
import { TableHeaderCell } from './header-cell';
import { TableGroupHeaderCell } from './header-cell/group-header-cell';
// import { TableHiddenHeaderCell } from './header-cell/hidden-header-cell';
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
  groupDefinitions?: ReadonlyArray<TableProps.GroupDefinition<any>>;
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
  stickyColumnsFirst?: number;
  stickyColumnsLast?: number;
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
      hierarchicalStructure: h,
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
      stickyColumnsFirst = 0,
      stickyColumnsLast = 0,
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

    const hierarchicalStructure: TableGroupedTypes.HierarchicalStructure<any> | undefined = h;

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

    // Determine if a group is split by the sticky boundary.
    // Returns null if no split, or { stickyColspan, nonStickyColspan, side } if split.
    // `side` indicates which side is sticky: 'first' means left columns are sticky,
    // 'last' means right columns are sticky.
    const getGroupSplit = (
      col: TableGroupedTypes.ColumnInRow<any>
    ): { stickyColspan: number; nonStickyColspan: number; side: 'first' | 'last' } | null => {
      if (!col.isGroup) {
        return null;
      }
      // colIndex is 0-based from the first data column (selection column not included)
      const groupStart = col.colIndex;
      const groupEnd = col.colIndex + col.colspan - 1; // inclusive

      // Check sticky-first boundary
      if (stickyColumnsFirst > 0) {
        const lastStickyFirst = stickyColumnsFirst - 1;
        if (groupStart <= lastStickyFirst && groupEnd > lastStickyFirst) {
          // Group is split by sticky-first boundary
          const stickyColspan = lastStickyFirst - groupStart + 1;
          const nonStickyColspan = col.colspan - stickyColspan;
          return { stickyColspan, nonStickyColspan, side: 'first' };
        }
      }

      // Check sticky-last boundary
      if (stickyColumnsLast > 0) {
        const totalLeafColumns = columnDefinitions.length;
        const firstStickyLast = totalLeafColumns - stickyColumnsLast;
        if (groupStart < firstStickyLast && groupEnd >= firstStickyLast) {
          // Group is split by sticky-last boundary
          const nonStickyColspan = firstStickyLast - groupStart;
          const stickyColspan = col.colspan - nonStickyColspan;
          return { stickyColspan, nonStickyColspan, side: 'last' };
        }
      }

      return null;
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
                cellRef={node => setCell(sticky, selectionColumnId, node)}
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
                  resizableStyle={getColumnStyles(sticky, columnId)}
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
                  isRightmost={colIndex === columnDefinitions.length - 1}
                />
              );
            })}
          </tr>
        </thead>
      );
    }

    // Grouped columns
    const totalLeafColumns = columnDefinitions.length;
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        {hierarchicalStructure.rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            {...(rowIndex === 0 ? focusMarkers.all : {})}
            ref={rowIndex === 0 ? outerRef : undefined}
            aria-rowindex={rowIndex + 1}
            {...getTableHeaderRowRoleProps({ tableRole, rowIndex })}
            onFocus={event => {
              const focusControlElement = findUpUntil(event.target, element => !!element.getAttribute('data-focus-id'));
              const focusId = focusControlElement?.getAttribute('data-focus-id') ?? null;
              onFocusedComponentChange?.(focusId);
            }}
            onBlur={() => onFocusedComponentChange?.(null)}
          >
            {/* Selection column — render once in the first row with rowSpan covering all header rows */}
            {selectionType && rowIndex === 0 ? (
              <TableHeaderSelectionCell
                {...commonCellProps}
                focusedComponent={focusedComponent}
                columnId={selectionColumnId}
                cellRef={node => setCell(sticky, selectionColumnId, node)}
                getSelectAllProps={getSelectAllProps}
                onFocusMove={onFocusMove}
                singleSelectionHeaderAriaLabel={singleSelectionHeaderAriaLabel}
                rowSpan={hierarchicalStructure.rows.length}
              />
            ) : null}

            {row.columns.map((col, colIndexInRow) => {
              // A cell is the last child of its parent group when the next rendered cell
              // in the same row belongs to a different top-level parent, i.e. they don't
              // share the same immediate parent group.
              const nextCol = row.columns[colIndexInRow + 1];
              const thisParent = col.parentGroupIds[col.parentGroupIds.length - 1] ?? null;
              const nextParent = nextCol ? (nextCol.parentGroupIds[nextCol.parentGroupIds.length - 1] ?? null) : null;
              const isLastChildOfGroup = thisParent !== null && thisParent !== nextParent;

              if (col.isGroup) {
                // Group header cell
                const groupDefinition = col.groupDefinition!;
                const childIds = getChildColumnIds(col.id);
                const split = getGroupSplit(col);

                if (split) {
                  // Group is bisected by the sticky boundary — render two <th> elements.
                  // Both halves get resizers. Each resizes its own rightmost leaf child.
                  const stickyColspan = split.stickyColspan;
                  const nonStickyColspan = split.nonStickyColspan;

                  // Left half is sticky for 'first', non-sticky for 'last'
                  const leftColspan = split.side === 'first' ? stickyColspan : nonStickyColspan;
                  const leftColIndex = col.colIndex;
                  const leftGroupId = split.side === 'first' ? col.id : `${col.id}__split`;
                  // Left half's child IDs for resize
                  const leftChildIds = childIds.filter((_, i) => col.colIndex + i < leftColIndex + leftColspan);

                  // Right half is non-sticky for 'first', sticky for 'last'
                  const rightColspan = split.side === 'first' ? nonStickyColspan : stickyColspan;
                  const rightColIndex = col.colIndex + leftColspan;
                  const rightGroupId = split.side === 'first' ? `${col.id}__split` : col.id;
                  const rightChildIds = childIds.filter((_, i) => col.colIndex + i >= rightColIndex);

                  return (
                    <React.Fragment key={col.id}>
                      {/* Left half */}
                      <TableGroupHeaderCell
                        {...commonCellProps}
                        tabIndex={sticky ? -1 : 0}
                        focusedComponent={focusedComponent}
                        group={groupDefinition}
                        colspan={leftColspan}
                        rowspan={col.rowspan}
                        colIndex={selectionType ? leftColIndex + 1 : leftColIndex}
                        groupId={leftGroupId}
                        resizableColumns={resizableColumns}
                        resizableStyle={resizableColumns ? {} : {}}
                        onResizeFinish={() => onResizeFinish(columnWidths)}
                        updateGroupWidth={(_, newWidth) => {
                          // Resize the rightmost leaf of the left half
                          const lastLeaf = leftChildIds[leftChildIds.length - 1];
                          if (lastLeaf) {
                            const currentHalfWidth = leftChildIds.reduce(
                              (sum, id) => sum + (columnWidths.get(id) || 120),
                              0
                            );
                            const delta = newWidth - currentHalfWidth;
                            const currentLeafWidth = columnWidths.get(lastLeaf) || 120;
                            updateColumn(lastLeaf, currentLeafWidth + delta);
                          }
                        }}
                        childColumnIds={leftChildIds}
                        firstChildColumnId={leftChildIds[0]}
                        lastChildColumnId={leftChildIds[leftChildIds.length - 1]}
                        childColumnMinWidths={getColumnMinWidths(leftChildIds as string[])}
                        cellRef={split.side === 'first' ? node => setCell(sticky, col.id, node) : () => {}}
                        isLastChildOfGroup={false}
                        isRightmost={false}
                        stickyColumnId={split.side === 'first' ? childIds[0] : undefined}
                      />

                      {/* Right half */}
                      <TableGroupHeaderCell
                        {...commonCellProps}
                        tabIndex={sticky ? -1 : 0}
                        focusedComponent={focusedComponent}
                        group={groupDefinition}
                        colspan={rightColspan}
                        rowspan={col.rowspan}
                        colIndex={selectionType ? rightColIndex + 1 : rightColIndex}
                        groupId={rightGroupId}
                        resizableColumns={resizableColumns}
                        resizableStyle={resizableColumns ? {} : getColumnStyles(sticky, col.id)}
                        onResizeFinish={() => onResizeFinish(columnWidths)}
                        updateGroupWidth={(_, newWidth) => {
                          // Resize the rightmost leaf of the right half
                          const lastLeaf = rightChildIds[rightChildIds.length - 1];
                          if (lastLeaf) {
                            const currentHalfWidth = rightChildIds.reduce(
                              (sum, id) => sum + (columnWidths.get(id) || 120),
                              0
                            );
                            const delta = newWidth - currentHalfWidth;
                            const currentLeafWidth = columnWidths.get(lastLeaf) || 120;
                            updateColumn(lastLeaf, currentLeafWidth + delta);
                          }
                        }}
                        childColumnIds={rightChildIds}
                        firstChildColumnId={rightChildIds[0]}
                        lastChildColumnId={rightChildIds[rightChildIds.length - 1]}
                        childColumnMinWidths={getColumnMinWidths(rightChildIds as string[])}
                        cellRef={split.side === 'last' ? node => setCell(sticky, col.id, node) : () => {}}
                        resizerRoleDescription={resizerRoleDescription}
                        resizerTooltipText={resizerTooltipText}
                        isLastChildOfGroup={isLastChildOfGroup}
                        isRightmost={rightColIndex + rightColspan === totalLeafColumns}
                        stickyColumnId={split.side === 'last' ? childIds[childIds.length - 1] : undefined}
                        columnGroupId={
                          col.parentGroupIds.length > 0 ? col.parentGroupIds[col.parentGroupIds.length - 1] : undefined
                        }
                      />
                    </React.Fragment>
                  );
                }

                // Determine if the entire group is sticky (all children on one side)
                const isFullyStickyFirst =
                  stickyColumnsFirst > 0 && col.colIndex + col.colspan - 1 < stickyColumnsFirst;
                const isFullyStickyLast =
                  stickyColumnsLast > 0 && col.colIndex >= columnDefinitions.length - stickyColumnsLast;
                const fullyStickyColumnId = isFullyStickyFirst
                  ? childIds[0]
                  : isFullyStickyLast
                    ? childIds[childIds.length - 1]
                    : undefined;

                return (
                  <TableGroupHeaderCell
                    {...commonCellProps}
                    key={col.id}
                    tabIndex={sticky ? -1 : 0}
                    focusedComponent={focusedComponent}
                    group={groupDefinition}
                    colspan={col.colspan}
                    rowspan={col.rowspan}
                    // spansRows={col.rowspan > 1}
                    colIndex={selectionType ? col.colIndex + 1 : col.colIndex}
                    groupId={col.id}
                    resizableColumns={resizableColumns}
                    resizableStyle={resizableColumns ? {} : getColumnStyles(sticky, col.id)}
                    onResizeFinish={() => onResizeFinish(columnWidths)}
                    updateGroupWidth={(groupId, newWidth) => {
                      updateGroup(groupId, newWidth);
                    }}
                    childColumnIds={childIds}
                    firstChildColumnId={childIds[0]}
                    lastChildColumnId={childIds[childIds.length - 1]}
                    childColumnMinWidths={getColumnMinWidths(childIds)}
                    cellRef={node => setCell(sticky, col.id, node)}
                    resizerRoleDescription={resizerRoleDescription}
                    resizerTooltipText={resizerTooltipText}
                    isLastChildOfGroup={isLastChildOfGroup}
                    isRightmost={col.colIndex + col.colspan === totalLeafColumns}
                    stickyColumnId={fullyStickyColumnId}
                    columnGroupId={
                      col.parentGroupIds.length > 0 ? col.parentGroupIds[col.parentGroupIds.length - 1] : undefined
                    }
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
                    isLastChildOfGroup={isLastChildOfGroup}
                    isRightmost={col.colIndex + col.colspan === totalLeafColumns}
                    columnGroupId={
                      col.parentGroupIds.length > 0 ? col.parentGroupIds[col.parentGroupIds.length - 1] : undefined
                    }
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
