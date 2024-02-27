// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { TableProps } from './interfaces';
import { SelectionControl, focusMarkers, SelectionProps } from './selection';
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
import { Divider } from './resizer';

export interface TheadProps {
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
  onResizeFinish: (newWidths: Map<PropertyKey, number>) => void;
  onSortingChange: NonCancelableEventHandler<TableProps.SortingState<any>> | undefined;
  sticky?: boolean;
  hidden?: boolean;
  stuck?: boolean;
  singleSelectionHeaderAriaLabel?: string;
  resizerRoleDescription?: string;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;
  selectionColumnId: PropertyKey;
  focusedComponent?: null | string;
  onFocusedComponentChange?: (focusId: null | string) => void;
  tableRole: TableRole;
}

const Thead = React.forwardRef(
  (
    {
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
      resizerRoleDescription,
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

    const { getColumnStyles, columnWidths, updateColumn, setCell } = useColumnWidths();

    let colIndexOffset = 0;
    if (selectionType) {
      colIndexOffset++;
    }

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
              focusedComponent={focusedComponent}
              columnId={selectionColumnId}
              stickyState={stickyState}
            >
              {selectionType === 'multi' ? (
                <SelectionControl
                  tableRole={tableRole}
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
              <Divider className={styles['resize-divider']} />
            </TableThElement>
          ) : null}

          {columnDefinitions.map((column, colIndex) => {
            const columnId = getColumnKey(column, colIndex);
            return (
              <TableHeaderCell
                key={columnId}
                style={getColumnStyles(sticky, columnId)}
                className={headerCellClass}
                tabIndex={sticky ? -1 : 0}
                focusedComponent={focusedComponent}
                column={column}
                activeSortingColumn={sortingColumn}
                sortingDescending={sortingDescending}
                sortingDisabled={sortingDisabled}
                wrapLines={wrapLines}
                hidden={hidden}
                colIndex={colIndex + colIndexOffset}
                columnId={columnId}
                updateColumn={updateColumn}
                onResizeFinish={() => onResizeFinish(columnWidths)}
                resizableColumns={resizableColumns}
                onClick={detail => fireNonCancelableEvent(onSortingChange, detail)}
                isEditable={!!column.editConfig}
                stickyState={stickyState}
                cellRef={node => setCell(sticky, columnId, node)}
                tableRole={tableRole}
                resizerRoleDescription={resizerRoleDescription}
              />
            );
          })}
        </tr>
      </thead>
    );
  }
);

export default Thead;
