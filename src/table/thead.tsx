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
import { CellOffsets } from './internal';
import { GetStickyColumnProperties } from './use-sticky-columns';

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
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
  stickyColumns?: TableProps.StickyColumns;
  cellOffsets?: CellOffsets;
  getStickyColumnProperties: (colIndex: number) => GetStickyColumnProperties;
  shouldDisableStickyColumns: boolean;
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
      cellOffsets,
      sticky = false,
      hidden = false,
      stuck = false,
      focusedComponent,
      onFocusedComponentChange,
      getStickyColumnProperties,
      shouldDisableStickyColumns,
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
    const hasFirstStickyColumns = (stickyColumns?.first ?? 0) > 0;

    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr {...focusMarkers.all} ref={outerRef} aria-rowindex={1}>
          {selectionType === 'multi' && (
            <th
              className={clsx(
                headerCellClass,
                selectionCellClass,
                hidden && headerCellStyles['header-cell-hidden'],
                !shouldDisableStickyColumns && hasFirstStickyColumns && headerCellStyles['sticky-cell']
              )}
              style={{ left: cellOffsets?.first[0] }}
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
                !shouldDisableStickyColumns && hasFirstStickyColumns && headerCellStyles['sticky-cell']
              )}
              style={{ left: `${cellOffsets?.first[0]}px` }}
              scope="col"
            >
              <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
            </th>
          )}
          {columnDefinitions.map((column, colIndex) => {
            const isLastColumn = colIndex === columnDefinitions.length - 1;
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
                getStickyColumnProperties={getStickyColumnProperties}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
