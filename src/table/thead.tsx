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
import styles from './styles.css.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { TableThElement } from './header-cell/th-element';

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
    }: TheadProps,
    outerRef: React.Ref<HTMLTableRowElement>
  ) => {
    const { columnWidths, totalWidth, updateColumn } = useColumnWidths();
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr {...focusMarkers.all} ref={outerRef} aria-rowindex={1}>
          {selectionType !== undefined ? (
            <TableThElement
              hidden={hidden}
              sticky={sticky}
              stuck={stuck}
              stripedRows={stripedRows}
              variant={variant}
              hasSelection={true}
            >
              {selectionType === 'multi' ? (
                <SelectionControl
                  onFocusDown={event => {
                    onFocusMove!(event.target as HTMLElement, -1, +1);
                  }}
                  focusedComponent={focusedComponent}
                  onFocusedComponentChange={onFocusedComponentChange}
                  {...selectAllProps}
                  {...(sticky ? { tabIndex: -1 } : {})}
                />
              ) : (
                <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
              )}
            </TableThElement>
          ) : null}

          {columnDefinitions.map((column, colIndex) => {
            let widthOverride;
            if (resizableColumns) {
              if (columnWidths) {
                // use stateful value if available
                widthOverride = columnWidths[getColumnKey(column, colIndex)];
              }
              if (colIndex === columnDefinitions.length - 1 && containerWidth && containerWidth > totalWidth) {
                // let the last column grow and fill the container width
                widthOverride = 'auto';
              }
            }
            return (
              <TableHeaderCell
                key={getColumnKey(column, colIndex)}
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
                sticky={sticky}
                stuck={stuck}
                stripedRows={stripedRows}
                variant={variant}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
