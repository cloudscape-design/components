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
import {
  selectionColumnId,
  StickyColumnsModel,
  useStickyCellStyles,
} from '../internal/components/table-fragments/sticky-columns';

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
  onFocusMove: ((sourceElement: HTMLElement, fromIndex: number, direction: -1 | 1) => void) | undefined;
  onResizeFinish: (newWidths: Record<string, number>) => void;
  onSortingChange: NonCancelableEventHandler<TableProps.SortingState<any>> | undefined;
  sticky?: boolean;
  hidden?: boolean;
  stuck?: boolean;
  singleSelectionHeaderAriaLabel?: string;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;

  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
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
      onFocusMove,
      onSortingChange,
      onResizeFinish,
      singleSelectionHeaderAriaLabel,
      stripedRows,
      sticky = false,
      hidden = false,
      stuck = false,
      stickyState,

      focusedComponent,
      onFocusedComponentChange,
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

    const stickyStyles = useStickyCellStyles({
      stickyColumns: stickyState,
      columnId: selectionColumnId.toString(),
      getClassName: props => getStickyClassNames(cellStyles, props),
    });
    return (
      <thead className={clsx(!hidden && styles['thead-active'])}>
        <tr {...focusMarkers.all} ref={outerRef} aria-rowindex={1}>
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
            >
              {selectionType === 'multi' ? (
                <SelectionControl
                  onFocusDown={event => {
                    onFocusMove!(event.target as HTMLElement, -1, +1);
                  }}
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
                columnId={column.id ?? colIndex.toString()}
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
