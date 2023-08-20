// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { TableProps } from './interfaces';
import SelectionControl from './selection-control';
import { focusMarkers, SelectionProps } from './use-selection';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { getColumnKey, getStickyClassNames } from './utils';
import { TableHeaderCell } from './header-cell';
import { useColumnWidths } from './use-column-widths';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import cellStyles from './header-cell/styles.css.js';
import headerCellStyles from './header-cell/styles.css.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { StickyColumnsModel, useStickyCellStyles } from './sticky-columns';
import { getTableColHeaderRoleProps, getTableHeaderRowRoleProps, TableRole } from './table-role';

export type InteractiveComponent =
  | { type: 'selection' }
  | { type: 'column'; col: number }
  | { type: 'resizer'; col: number };

export interface TheadProps {
  containerWidth: number | null;
  selectionType: TableProps.SelectionType | undefined;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>;
  sortingColumn: TableProps.SortingColumn<any> | undefined;
  sortingDescending: boolean | undefined;
  sortingDisabled: boolean | undefined;
  variant: TableProps.Variant;
  wrapLines: boolean | undefined;
  resizableColumns: boolean | undefined;
  getSelectAllProps: () => SelectionProps;
  onResizeFinish: (newWidths: Record<string, number>) => void;
  onSortingChange: NonCancelableEventHandler<TableProps.SortingState<any>> | undefined;
  sticky?: boolean;
  hidden?: boolean;
  stuck?: boolean;
  singleSelectionHeaderAriaLabel?: string;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;
  selectionColumnId: PropertyKey;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
  tableRole: TableRole;
}

const Thead = React.forwardRef(
  (
    {
      containerWidth,
      selectionType,
      getSelectAllProps,
      columnDefinitions,
      sortingColumn,
      sortingDisabled,
      sortingDescending,
      resizableColumns,
      variant,
      wrapLines,
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
    }: TheadProps,
    outerRef: React.Ref<HTMLTableRowElement>
  ) => {
    const isVisualRefresh = useVisualRefresh();

    const headerCellClass = clsx(
      headerCellStyles['header-cell'],
      headerCellStyles[`header-cell-variant-${variant}`],
      sticky && headerCellStyles['header-cell-sticky'],
      stuck && headerCellStyles['header-cell-stuck'],
      stripedRows && headerCellStyles['has-striped-rows'],
      isVisualRefresh && headerCellStyles['is-visual-refresh']
    );

    const selectionCellClass = clsx(
      styles['selection-control'],
      styles['selection-control-header'],
      isVisualRefresh && styles['is-visual-refresh']
    );

    const { columnWidths, totalWidth, updateColumn, setCell } = useColumnWidths();

    const stickyStyles = useStickyCellStyles({
      stickyColumns: stickyState,
      columnId: selectionColumnId,
      getClassName: props => getStickyClassNames(cellStyles, props),
    });
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr {...focusMarkers.all} ref={outerRef} aria-rowindex={1} {...getTableHeaderRowRoleProps({ tableRole })}>
          {selectionType ? (
            <th
              className={clsx(
                headerCellClass,
                selectionCellClass,
                hidden && headerCellStyles['header-cell-hidden'],
                stickyStyles.className
              )}
              style={stickyStyles.style}
              ref={stickyStyles.ref}
              scope="col"
              {...getTableColHeaderRoleProps({ tableRole, colIndex: 0 })}
            >
              {selectionType === 'multi' ? (
                <SelectionControl
                  focusedComponent={focusedComponent}
                  onFocusedComponentChange={onFocusedComponentChange}
                  {...getSelectAllProps()}
                  {...(sticky ? { tabIndex: -1 } : {})}
                />
              ) : (
                <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
              )}
            </th>
          ) : null}

          {columnDefinitions.map((column, colIndex) => {
            const columnId = getColumnKey(column, colIndex);

            let widthOverride;
            if (resizableColumns) {
              if (columnWidths) {
                // use stateful value if available
                widthOverride = columnWidths[columnId];
              }
              if (colIndex === columnDefinitions.length - 1 && containerWidth && containerWidth > totalWidth) {
                // let the last column grow and fill the container width
                widthOverride = 'auto';
              }
            }
            return (
              <TableHeaderCell
                key={columnId}
                className={headerCellClass}
                style={{
                  width: widthOverride || column.width,
                  minWidth: sticky ? undefined : column.minWidth,
                  maxWidth: resizableColumns || sticky ? undefined : column.maxWidth,
                }}
                tabIndex={sticky ? -1 : 0}
                focusedComponent={focusedComponent}
                onFocusedComponentChange={onFocusedComponentChange}
                column={column}
                activeSortingColumn={sortingColumn}
                sortingDescending={sortingDescending}
                sortingDisabled={sortingDisabled}
                wrapLines={wrapLines}
                hidden={hidden}
                colIndex={selectionType ? colIndex + 1 : colIndex}
                columnId={columnId}
                updateColumn={updateColumn}
                onResizeFinish={() => onResizeFinish(columnWidths)}
                resizableColumns={resizableColumns}
                onClick={detail => fireNonCancelableEvent(onSortingChange, detail)}
                isEditable={!!column.editConfig}
                stickyState={stickyState}
                cellRef={node => setCell(columnId, node)}
                tableRole={tableRole}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
