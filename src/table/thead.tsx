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
import cellStyles from './body-cell/styles.css.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { StickyStateModel } from './sticky-state-model';
import { TableHeaderSelectionCell } from './header-cell/th-selection-element';

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
  hasSelection: boolean;
  stickyState: StickyStateModel;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
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
      sticky = false,
      hidden = false,
      stuck = false,
      focusedComponent,
      onFocusedComponentChange,
      stickyState,
    }: TheadProps,
    outerRef: React.Ref<HTMLTableRowElement>
  ) => {
    const isVisualRefresh = useVisualRefresh();
    const headerCellClass = clsx(
      cellStyles['header-cell'],
      cellStyles[`header-cell-variant-${variant}`],
      sticky && cellStyles['header-cell-sticky'],
      stuck && cellStyles['header-cell-stuck'],
      stripedRows && cellStyles['has-striped-rows'],
      isVisualRefresh && cellStyles['is-visual-refresh']
    );

    const { columnWidths, totalWidth, updateColumn } = useColumnWidths();
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr {...focusMarkers.all} ref={outerRef} aria-rowindex={1}>
          {selectionType === 'multi' && (
            <TableHeaderSelectionCell
              selectionType="multi"
              stickyState={stickyState}
              className={clsx(headerCellClass, hidden && cellStyles['header-cell-hidden'])}
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
            </TableHeaderSelectionCell>
          )}
          {selectionType === 'single' && (
            <TableHeaderSelectionCell
              selectionType="single"
              stickyState={stickyState}
              className={clsx(headerCellClass, hidden && cellStyles['header-cell-hidden'])}
            >
              <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
            </TableHeaderSelectionCell>
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
                columnId={column.id ?? colIndex.toString()}
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
                stickyState={stickyState}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
