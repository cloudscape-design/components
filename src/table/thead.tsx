// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { TableProps } from './interfaces';
import SelectionControl from './selection-control';
import { focusMarkers, SelectionProps } from './use-selection';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { getColumnKey } from './utils';
import { TableHeaderCell } from './header-cell';
import { useColumnWidths } from './use-column-widths';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
import headerCellStyles from './header-cell/styles.css.js';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { StickyColumnsModel } from './sticky-columns';
import { getTableHeaderRowRoleProps, TableRole } from './table-role';
import { TableThElement } from './header-cell/th-element';
import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';
import InternalButton from '../button/internal';

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
  selectionColumnId: PropertyKey;
  focusedComponent?: null | string;
  onFocusedComponentChange?: (focusId: null | string) => void;
  tableRole: TableRole;
  treeGrid?: TableProps.TreeGridProps<any>;
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
      selectionColumnId,
      focusedComponent,
      onFocusedComponentChange,
      tableRole,
      treeGrid,
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
            <TableThElement
              className={clsx(headerCellClass, selectionCellClass, hidden && headerCellStyles['header-cell-hidden'])}
              hidden={hidden}
              tableRole={tableRole}
              colIndex={0}
              columnId={selectionColumnId}
              stickyState={stickyState}
            >
              {selectionType === 'multi' ? (
                <SelectionControl
                  onFocusDown={event => {
                    onFocusMove!(event.target as HTMLElement, -1, +1);
                  }}
                  focusedComponent={focusedComponent}
                  {...getSelectAllProps()}
                  {...(sticky ? { tabIndex: -1 } : {})}
                />
              ) : (
                <ScreenreaderOnly>{singleSelectionHeaderAriaLabel}</ScreenreaderOnly>
              )}
            </TableThElement>
          ) : null}

          {treeGrid ? (
            <TableThElement
              className={clsx(
                headerCellClass,
                headerCellStyles['header-cell-expand'],
                hidden && headerCellStyles['header-cell-hidden']
              )}
              hidden={hidden}
              tableRole={tableRole}
              colIndex={0}
              columnId={selectionColumnId}
              stickyState={stickyState}
            >
              <InternalButton variant="inline-icon" iconName="caret-right-filled" />
            </TableThElement>
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
