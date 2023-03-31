// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { TableProps } from './interfaces';
import SelectionControl, { SelectionControlProps } from './selection-control';
import { focusMarkers } from './use-selection';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { getColumnKey } from './utils';
import { TableHeaderCell } from './header-cell';
import { useColumnWidths } from './use-column-widths';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import headerCellStyles from './header-cell/styles.css.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { CellWidths } from './internal';
import { GetStickyColumn } from './use-sticky-columns';

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
  selectAllProps: SelectionControlProps;
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
  onResizeFinish: (newWidths: Record<string, number>) => void;
  onSortingChange: NonCancelableEventHandler<TableProps.SortingState<any>> | undefined;
  sticky?: boolean;
  hidden?: boolean;
  stuck?: boolean;
  singleSelectionHeaderAriaLabel?: string;
  stripedRows?: boolean;
  visibleColumnsLength: number;
  isStuckToTheRight: boolean;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
  stickyColumns?: TableProps.StickyColumns;
  cellWidths?: CellWidths;
  setCellWidths: React.Dispatch<React.SetStateAction<CellWidths>>;
  tableCellRefs: Array<React.RefObject<HTMLTableCellElement>>;
  getStickyColumn?: (colIndex: number) => GetStickyColumn;
}

const Thead = React.forwardRef(
  (
    {
      containerWidth,
      selectionType,
      selectAllProps,
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
      stickyColumns,
      cellWidths,
      sticky = false,
      hidden = false,
      stuck = false,
      focusedComponent,
      onFocusedComponentChange,
      setCellWidths,
      tableCellRefs,
      getStickyColumn,
      visibleColumnsLength,
      isStuckToTheRight,
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

    const { columnWidths, totalWidth, updateColumn } = useColumnWidths();
    const hasStartStickyColumns = (stickyColumns?.start ?? 0) > 0;
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr {...focusMarkers.all} ref={outerRef} aria-rowindex={1}>
          {selectionType === 'multi' && (
            <th
              className={clsx(
                headerCellClass,
                selectionCellClass,
                hidden && headerCellStyles['header-cell-hidden'],
                hasStartStickyColumns && headerCellStyles['header-cell-freeze']
              )}
              style={{ left: cellWidths?.start[0] }}
              scope="col"
            >
              <SelectionControl
                onFocusDown={event => {
                  onFocusMove!(event.target as HTMLElement, -1, +1);
                }}
                focusedComponent={focusedComponent}
                onFocusedComponentChange={onFocusedComponentChange}
                {...selectAllProps}
                {...(sticky ? { tabIndex: -1 } : {})}
              />
            </th>
          )}
          {selectionType === 'single' && (
            <th
              className={clsx(
                headerCellClass,
                selectionCellClass,
                hidden && headerCellStyles['header-cell-hidden'],
                hasStartStickyColumns && headerCellStyles['header-cell-freeze']
              )}
              style={{ left: cellWidths?.start[0] }}
              scope="col"
            >
              <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
            </th>
          )}
          {columnDefinitions.map((column, colIndex) => {
            const isLastColumn = colIndex === columnDefinitions.length - 1;
            const {
              isSticky = false,
              isLastStart = false,
              isLastEnd = false,
              stickyStyles = {},
            } = getStickyColumn ? getStickyColumn(colIndex) : {};

            let widthOverride;
            if (resizableColumns) {
              if (columnWidths) {
                // use stateful value if available
                widthOverride = columnWidths[getColumnKey(column, colIndex)];
              }
              if (isLastColumn && containerWidth && containerWidth > totalWidth) {
                // let the last column grow and fill the container width
                widthOverride = 'auto';
              }
            }

            return (
              <TableHeaderCell
                key={getColumnKey(column, colIndex)}
                className={headerCellClass}
                style={{
                  width: widthOverride || column.width,
                  minWidth: sticky ? undefined : column.minWidth,
                  maxWidth: resizableColumns || sticky ? undefined : column.maxWidth,
                  ...stickyStyles,
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
                colIndex={colIndex}
                updateColumn={updateColumn}
                onResizeFinish={() => onResizeFinish(columnWidths)}
                resizableColumns={resizableColumns}
                onClick={detail => fireNonCancelableEvent(onSortingChange, detail)}
                isEditable={!!column.editConfig}
                isLastStart={isLastStart}
                isLastEnd={isLastEnd}
                isStickyColumn={isSticky}
                tableCellRefs={tableCellRefs}
                setCellWidths={setCellWidths}
                visibleColumnsLength={visibleColumnsLength}
                isStuckToTheRight={isStuckToTheRight}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
