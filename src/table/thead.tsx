// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { fireNonCancelableEvent } from '../internal/events';
import { NonCancelableEventHandler } from '../types/events';
import { getGroupColumnIds, getGroupSplit } from './column-groups/split-utils';
import { ColumnGroupsLayout } from './column-groups/utils';
import { TableHeaderCell } from './header-cell';
import { TableGroupHeaderCell } from './header-cell/group-header-cell';
import { TableProps } from './interfaces';
import { InternalSelectionType } from './internal-interfaces';
import { TableHeaderRowDragHandle } from './row-reordering';
import { focusMarkers, ItemSelectionProps } from './selection';
import { TableHeaderSelectionCell } from './selection/selection-cell';
import { StickyColumnsModel } from './sticky-columns';
import { getTableHeaderRowRoleProps, TableRole } from './table-role';
import { DEFAULT_COLUMN_WIDTH, useColumnWidths } from './use-column-widths';
import { getColumnKey } from './utils';

import styles from './styles.css.js';

export interface TheadProps {
  selectionType: undefined | InternalSelectionType;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  groupDefinitions?: ReadonlyArray<TableProps.GroupDefinition>;
  columnGroupsLayout?: ColumnGroupsLayout<any>;
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
  stickyColumnsFirst: number;
  stickyColumnsLast: number;
  selectionColumnId: PropertyKey;
  dragHandleColumnId?: PropertyKey;
  rowReorderingAriaLabel?: string;
  hasRowReordering?: boolean;
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
      columnGroupsLayout,
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
      stickyColumnsFirst,
      stickyColumnsLast,
      selectionColumnId,
      dragHandleColumnId,
      rowReorderingAriaLabel,
      hasRowReordering,
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

    // This guarantees the width reported via `onColumnWidthsChange` matches the final rendered width instead of a stale one.
    // Without this, resetting/remounting a table right after a resize can restore an outdated width.
    const columnWidthsRef = useRef(columnWidths);
    columnWidthsRef.current = columnWidths;

    const handleSplitGroupResize = (columnIds: string[], newWidth: number) => {
      const lastColumn = columnIds[columnIds.length - 1];
      if (lastColumn) {
        const currentGroupWidth = columnIds.reduce(
          (sum, id) => sum + (columnWidths.get(id) || DEFAULT_COLUMN_WIDTH),
          0
        );
        const delta = newWidth - currentGroupWidth;
        const currentColumnWidth = columnWidths.get(lastColumn) || DEFAULT_COLUMN_WIDTH;
        updateColumn(lastColumn, currentColumnWidth + delta);
      }
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
      wrapLines,
    };

    const sharedTrProps = {
      onFocus: (event: React.FocusEvent) => {
        const focusControlElement = findUpUntil(
          event.target as HTMLElement,
          element => !!element.getAttribute('data-focus-id')
        );
        const focusId = focusControlElement?.getAttribute('data-focus-id') ?? null;
        onFocusedComponentChange?.(focusId);
      },
      onBlur: () => onFocusedComponentChange?.(null),
    };

    // No grouping - render single row
    if (!columnGroupsLayout || columnGroupsLayout.rows.length <= 1) {
      return (
        <thead className={clsx(!hidden && styles['thead-active'])}>
          <tr
            {...focusMarkers.all}
            ref={outerRef}
            aria-rowindex={1}
            {...getTableHeaderRowRoleProps({ tableRole })}
            {...sharedTrProps}
          >
            {hasRowReordering && dragHandleColumnId ? (
              <TableHeaderRowDragHandle
                {...commonCellProps}
                columnId={dragHandleColumnId}
                ariaLabel={rowReorderingAriaLabel}
              />
            ) : null}

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
                  colIndex={(hasRowReordering ? 1 : 0) + (selectionType ? 1 : 0) + colIndex}
                  columnId={columnId}
                  updateColumn={updateColumn}
                  onResizeFinish={() => onResizeFinish(columnWidthsRef.current)}
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
                  isLast={colIndex === columnDefinitions.length - 1}
                />
              );
            })}
          </tr>
        </thead>
      );
    }

    // Grouped columns
    const totalColumns = columnDefinitions.length;
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        {columnGroupsLayout.rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            {...(rowIndex === 0 ? focusMarkers.all : {})}
            ref={rowIndex === 0 ? outerRef : undefined}
            aria-rowindex={rowIndex + 1}
            data-group-level={rowIndex}
            {...getTableHeaderRowRoleProps({ tableRole, rowIndex })}
            {...sharedTrProps}
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
                rowSpan={columnGroupsLayout.rows.length}
                isGrouped={true}
              />
            ) : null}

            {row.columns.map((col, colIndexInRow) => {
              // A cell is the last child of its parent group when the next rendered cell
              // in the same row belongs to a different top-level parent, i.e. they don't
              // share the same immediate parent group.
              const nextCol = row.columns[colIndexInRow + 1];
              const thisParent = col.parentGroupIds[col.parentGroupIds.length - 1] ?? null;
              const nextParent = nextCol ? (nextCol.parentGroupIds[nextCol.parentGroupIds.length - 1] ?? null) : null;
              // A column is also considered last-child-of-group when the sticky boundary
              // bisects its parent group just after this column — visually it's the rightmost
              // column of the sticky half, so its resizer should span full-height like a
              // normal last-child-of-group.
              const isColumnAtStickyFirstBoundary =
                !col.isGroup &&
                thisParent !== null &&
                stickyColumnsFirst > 0 &&
                col.colIndex === stickyColumnsFirst - 1;
              const isColumnAtStickyLastBoundary =
                !col.isGroup &&
                thisParent !== null &&
                stickyColumnsLast > 0 &&
                col.colIndex === columnDefinitions.length - stickyColumnsLast - 1;
              const isLastChildOfGroup =
                (thisParent !== null && thisParent !== nextParent) ||
                isColumnAtStickyFirstBoundary ||
                isColumnAtStickyLastBoundary;

              if (col.isGroup) {
                // Group header cell
                const groupDefinition = col.groupDefinition!;
                const childIds = getGroupColumnIds(columnGroupsLayout!, col.id);
                const sharedGroupCellProps = {
                  ...commonCellProps,
                  tabIndex: sticky ? -1 : 0,
                  focusedComponent,
                  group: groupDefinition,
                  rowspan: col.rowSpan,
                  resizableColumns,
                  onResizeFinish: () => onResizeFinish(columnWidthsRef.current),
                  columnGroupId:
                    col.parentGroupIds.length > 0 ? col.parentGroupIds[col.parentGroupIds.length - 1] : undefined,
                };
                const splitFirst = getGroupSplit({
                  col,
                  stickyCount: stickyColumnsFirst,
                  side: 'first',
                  totalColumns,
                });
                const splitLast = getGroupSplit({
                  col,
                  stickyCount: stickyColumnsLast,
                  side: 'last',
                  totalColumns,
                });
                const split = splitFirst.stickyColspan > 0 ? splitFirst : splitLast;
                const isSplit = split.stickyColspan > 0;

                if (isSplit) {
                  // Group is bisected by the sticky boundary — render two <th> elements.
                  // Both halves get resizers. Each resizes its own rightmost column child.
                  const isSplitFirst = splitFirst.stickyColspan > 0;

                  // Left half is sticky for 'first', non-sticky for 'last'
                  const leftColspan = isSplitFirst ? split.stickyColspan : split.staticColspan;
                  const leftColIndex = col.colIndex;
                  const leftGroupId = isSplitFirst ? col.id : `${col.id}__split`;
                  const leftChildIds = childIds.slice(0, leftColspan);

                  // Right half is non-sticky for 'first', sticky for 'last'
                  const rightColspan = isSplitFirst ? split.staticColspan : split.stickyColspan;
                  const rightColIndex = col.colIndex + leftColspan;
                  const rightGroupId = isSplitFirst ? `${col.id}__split` : col.id;
                  const rightChildIds = childIds.slice(leftColspan);

                  return (
                    <React.Fragment key={col.id}>
                      {/* Left half */}
                      <TableGroupHeaderCell
                        {...sharedGroupCellProps}
                        colspan={leftColspan}
                        colIndex={selectionType ? leftColIndex + 1 : leftColIndex}
                        groupId={leftGroupId}
                        resizableStyle={undefined}
                        updateGroupWidth={(_, newWidth) => {
                          handleSplitGroupResize(leftChildIds, newWidth);
                        }}
                        childColumnIds={leftChildIds}
                        firstChildColumnId={leftChildIds[0]}
                        lastChildColumnId={leftChildIds[leftChildIds.length - 1]}
                        cellRef={isSplitFirst ? node => setCell(sticky, col.id, node) : () => {}}
                        isLast={false}
                        stickyColumnId={isSplitFirst ? childIds[0] : undefined}
                        stickyBoundaryColumnId={isSplitFirst ? leftChildIds[leftChildIds.length - 1] : undefined}
                      />

                      {/* Right half */}
                      <TableGroupHeaderCell
                        {...sharedGroupCellProps}
                        colspan={rightColspan}
                        colIndex={selectionType ? rightColIndex + 1 : rightColIndex}
                        groupId={rightGroupId}
                        resizableStyle={getColumnStyles(sticky, col.id)}
                        updateGroupWidth={(_, newWidth) => {
                          handleSplitGroupResize(rightChildIds, newWidth);
                        }}
                        childColumnIds={rightChildIds}
                        firstChildColumnId={rightChildIds[0]}
                        lastChildColumnId={rightChildIds[rightChildIds.length - 1]}
                        cellRef={!isSplitFirst ? node => setCell(sticky, col.id, node) : () => {}}
                        resizerRoleDescription={resizerRoleDescription}
                        resizerTooltipText={resizerTooltipText}
                        isLast={rightColIndex + rightColspan === totalColumns}
                        stickyColumnId={!isSplitFirst ? childIds[childIds.length - 1] : undefined}
                        stickyBoundaryColumnId={!isSplitFirst ? rightChildIds[0] : undefined}
                      />
                    </React.Fragment>
                  );
                }

                // Determine if the entire group is sticky (all children on one side)
                const isFullyStickyFirst =
                  stickyColumnsFirst > 0 && col.colIndex + col.colSpan - 1 < stickyColumnsFirst;
                const isFullyStickyLast =
                  stickyColumnsLast > 0 && col.colIndex >= columnDefinitions.length - stickyColumnsLast;
                const fullyStickyColumnId = isFullyStickyFirst
                  ? childIds[0]
                  : isFullyStickyLast
                    ? childIds[childIds.length - 1]
                    : undefined;

                // When the group's last child is the sticky-first boundary, the group
                // needs the shadow from that child (but offset from the first child).
                const isAtStickyFirstBoundary =
                  isFullyStickyFirst && col.colIndex + col.colSpan - 1 === stickyColumnsFirst - 1;
                const isAtStickyLastBoundary =
                  isFullyStickyLast && col.colIndex === columnDefinitions.length - stickyColumnsLast;
                const fullyStickyBoundaryColumnId = isAtStickyFirstBoundary
                  ? childIds[childIds.length - 1]
                  : isAtStickyLastBoundary
                    ? childIds[0]
                    : undefined;

                return (
                  <TableGroupHeaderCell
                    {...sharedGroupCellProps}
                    key={col.id}
                    colspan={col.colSpan}
                    colIndex={selectionType ? col.colIndex + 1 : col.colIndex}
                    groupId={col.id}
                    resizableStyle={getColumnStyles(sticky, col.id)}
                    updateGroupWidth={(groupId, newWidth) => {
                      updateGroup(groupId, newWidth);
                    }}
                    childColumnIds={childIds}
                    firstChildColumnId={childIds[0]}
                    lastChildColumnId={childIds[childIds.length - 1]}
                    cellRef={node => setCell(sticky, col.id, node)}
                    resizerRoleDescription={resizerRoleDescription}
                    resizerTooltipText={resizerTooltipText}
                    isLast={col.colIndex + col.colSpan === totalColumns}
                    stickyColumnId={fullyStickyColumnId}
                    stickyBoundaryColumnId={fullyStickyBoundaryColumnId}
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
                    colIndex={(hasRowReordering ? 1 : 0) + (selectionType ? 1 : 0) + colIndex}
                    columnId={columnId}
                    updateColumn={updateColumn}
                    onResizeFinish={() => onResizeFinish(columnWidthsRef.current)}
                    resizableColumns={resizableColumns}
                    resizableStyle={getColumnStyles(sticky, columnId)}
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
                    colSpan={col.colSpan}
                    rowSpan={col.rowSpan}
                    isLastChildOfGroup={isLastChildOfGroup}
                    isLast={col.colIndex + col.colSpan === totalColumns}
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
