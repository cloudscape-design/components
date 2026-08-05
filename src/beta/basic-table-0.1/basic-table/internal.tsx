// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useSingleTabStopNavigation, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { GridNavigationProvider } from '../../../table/table-role';
import LiveRegion from '../../../live-region/internal';
import StatusIndicator from '../../../status-indicator/internal';

import { getBaseProps } from '../../../internal/base-component';
import DragHandleWrapper from '../../../internal/components/drag-handle-wrapper';
import { InternalBaseComponentProps } from '../../../internal/hooks/use-base-component';
import { StickyColumnsCellState, useStickyCellStyles } from '../../../table/sticky-columns';
import {
  BasicRowContextProvider,
  BasicRowContextValue,
  BasicTableContextProvider,
  ColumnIndexProvider,
  useBasicRowContext,
  useBasicTableContext,
  useColumnIndexContext,
} from './context';
import { BasicTableProps } from './interfaces';
import { useBasicTable } from './use-basic-table';

import styles from './styles.css.js';

// Maps a context name to its themable class so compact density picks up the compact-table visual
// context.
const getVisualContextClassname = (contextType: string) => `awsui-context-${contextType}`;

// The compound components over the headless `useBasicTable` hook. Columns are a positional width
// config on `Root`; the header and rows are declarative children. Each part self-renders its DOM
// from the hook's prop-getters (read from context) and binds to the Nth column via a positional
// `ColumnIndexContext`, or by an explicit `columnId`. Per-element concerns that need a hook each —
// roving tabindex (`useSingleTabStopNavigation`) and per-cell sticky (`useStickyCellStyles`) — run
// inside Cell / HeaderCell. A virtualizing consumer spreads their own `rowProps`
// (absolute offset + measure ref) onto `Row`.

// Maps the sticky store's per-cell state to this component's sticky style keys.
function stickyClassNames(state: null | StickyColumnsCellState): Record<string, boolean> {
  if (!state) {
    return {};
  }
  return {
    [styles['sticky-cell']]: true,
    [styles['sticky-cell-pad-inline-start']]: state.padInlineStart,
    [styles['sticky-cell-last-inline-start']]: state.lastInsetInlineStart,
    [styles['sticky-cell-last-inline-end']]: state.lastInsetInlineEnd,
  };
}

// Wrap each child of Header / Row in a positional `ColumnIndexProvider` (emits no DOM, so the
// `<th>`/`<td>` stays a direct grid child) so the Nth cell learns its column index without the
// parent probing `child.type`.
function withColumnIndices(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child, index) =>
    child === null || child === undefined ? child : <ColumnIndexProvider value={index}>{child}</ColumnIndexProvider>
  );
}

// --- Resize handle (element-level focusable) ---------------------------------

function ResizeHandle({ columnIndex, headerId }: { columnIndex: number; headerId: string }): React.ReactElement {
  const ctx = useBasicTableContext('ResizeHandle');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const separatorRef = useRef<HTMLSpanElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(toggleRef);
  const [isKeyboardDragging, setIsKeyboardDragging] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const currentWidth = ctx.currentColumnWidth(columnIndex);
  const minWidth = ctx.resizeMinWidthOf(columnIndex);
  const handleProps = ctx.getResizeHandleProps(columnIndex);

  const step = (delta: number) => ctx.adjustColumnWidth(columnIndex, delta);
  const enterKeyboardDrag = () => {
    setIsKeyboardDragging(true);
    setShowButtons(true);
  };
  // Focus the separator only after `isKeyboardDragging` commits and clears its `aria-hidden`, so
  // focus never lands inside an aria-hidden subtree.
  useEffect(() => {
    if (isKeyboardDragging) {
      separatorRef.current?.focus();
    }
  }, [isKeyboardDragging]);
  const exitKeyboardDrag = () => {
    setIsKeyboardDragging(false);
    setShowButtons(false);
    toggleRef.current?.focus();
  };

  // The resize handle uses the generic `DragHandleWrapper` (depends on component-toolkit only, not
  // table-coupled) to provide the focus ring, the hover tooltip, and the direction-button
  // keyboard-resize control. Pointer drag stays on the toggle (`handleProps.onPointerDown` → the
  // index-based `startColumnResize`); the sibling role="slider" separator owns Arrow-key drag. The
  // width model is index-keyed via `grid-template-columns` — it does NOT pull the table-DOM-coupled
  // `resizer/resizer-lookup` or the id-keyed `ColumnWidthsProvider`. Direction buttons step ±20px.
  return (
    <span className={styles['resize-handle-wrapper']}>
      <DragHandleWrapper
        directions={{
          'inline-start': currentWidth > minWidth ? 'active' : 'disabled',
          'inline-end': 'active',
        }}
        triggerMode="controlled"
        controlledShowButtons={showButtons}
        clickDragThreshold={3}
        hideButtonsOnDrag={false}
        tooltipText={ctx.resizerRoleDescription}
        wrapperClassName={styles['resize-handle-drag']}
        onDirectionClick={direction => {
          if (direction === 'inline-start') {
            step(-20);
          } else if (direction === 'inline-end') {
            step(20);
          }
        }}
      >
        <button
          type="button"
          ref={toggleRef}
          {...handleProps}
          className={clsx(styles['resize-handle'], isKeyboardDragging && styles['resize-handle-dragging'])}
          aria-labelledby={headerId}
          tabIndex={tabIndex}
          onBlur={event => {
            if (event.relatedTarget !== separatorRef.current) {
              setShowButtons(false);
            }
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
              event.preventDefault();
              enterKeyboardDrag();
            }
          }}
        />
        <span
          ref={separatorRef}
          className={styles['resize-separator']}
          role="slider"
          tabIndex={-1}
          data-awsui-table-suppress-navigation={true}
          aria-labelledby={headerId}
          aria-hidden={!isKeyboardDragging}
          aria-valuemin={minWidth}
          aria-valuenow={currentWidth}
          aria-valuetext={`${currentWidth} pixels`}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              step(-10);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              step(10);
            } else if (event.key === 'Enter' || event.key === 'Escape') {
              event.preventDefault();
              exitKeyboardDrag();
            }
          }}
          onBlur={event => {
            setIsKeyboardDragging(false);
            if (event.relatedTarget !== toggleRef.current) {
              setShowButtons(false);
            }
          }}
        />
      </DragHandleWrapper>
    </span>
  );
}

// --- Header ------------------------------------------------------------------

// Self-renders one column header (`<th>`). Positional by default (its column index comes from the
// `ColumnIndexContext` supplied by `Header`); an explicit `columnId` binds by id. Layers per-cell
// roving tabindex + sticky styles on the hook's static header props. To make a column sortable, set
// `aria-sort` here (spread through `rest`) and render your own sort control in `children`.
export const HeaderCell = ({
  columnId,
  children,
  className,
  style,
  ...rest
}: BasicTableProps.HeaderCellProps): React.ReactElement => {
  const ctx = useBasicTableContext('HeaderCell');
  const positional = useColumnIndexContext();
  const columnIndex = ctx.resolveColumnIndex(columnId, positional);
  const stickyId = ctx.stickyColumnId(columnIndex);
  const ref = useRef<HTMLTableCellElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(ref);
  const sticky = useStickyCellStyles({
    stickyColumns: ctx.stickyColumns,
    columnId: stickyId,
    getClassName: stickyClassNames,
  });
  const headerId = useUniqueId('basic-table-header-');
  const registerRef = useMemo(
    () => (node: HTMLElement | null) => ctx.registerHeaderCell(columnIndex, node),
    [ctx, columnIndex]
  );
  const mergedRef = useMergeRefs(ref, sticky.ref, registerRef);
  const headerProps = ctx.getColumnHeaderProps(columnIndex);
  return (
    <th
      {...headerProps}
      {...rest}
      ref={mergedRef}
      id={headerId}
      className={clsx(
        styles['header-cell'],
        ctx.resizableColumns && styles['header-cell-resizable'],
        sticky.className,
        className
      )}
      style={{ ...sticky.style, ...style }}
      tabIndex={tabIndex === -1 ? undefined : tabIndex}
    >
      {children}
      {ctx.resizableColumns && <ResizeHandle columnIndex={columnIndex} headerId={headerId} />}
    </th>
  );
};

// Declarative header rowgroup — renders the HeaderCell children it is GIVEN (positional), never
// auto-generated from config.
export const Header = ({ sticky, children }: BasicTableProps.HeaderProps): React.ReactElement => {
  const ctx = useBasicTableContext('Header');
  const groupProps = ctx.getHeaderGroupProps();
  return (
    <thead role="rowgroup" className={clsx(styles['header-rowgroup'], sticky && styles['sticky-header'])}>
      <tr {...groupProps} className={styles['header-row']}>
        {withColumnIndices(children)}
      </tr>
    </thead>
  );
};

// --- Body --------------------------------------------------------------------

// Renders the mapped Row children directly (no harvesting) and carries a consumer's own runway
// ref/style spread when windowing.
export const Body = React.forwardRef<HTMLTableSectionElement, BasicTableProps.BodyProps>(function Body(
  { children, className, ...rest },
  ref
) {
  const ctx = useBasicTableContext('Body');
  const bodyProps = ctx.getBodyProps();
  return (
    <tbody {...bodyProps} {...rest} ref={ref} className={clsx(styles.body, className)}>
      {children}
    </tbody>
  );
});

// --- Cell + ExpandedContent --------------------------------------------------

// Self-renders one body cell (`<td>`). Positional by default (column index from
// `ColumnIndexContext` supplied by `Row`); an explicit `columnId` binds by id. Layers per-cell
// roving tabindex + sticky styles on the hook's static cell props; reads its row index from the row
// context.
export const Cell = ({
  columnId,
  children,
  className,
  style,
  ...rest
}: BasicTableProps.CellProps): React.ReactElement => {
  const ctx = useBasicTableContext('Cell');
  const positional = useColumnIndexContext();
  const columnIndex = ctx.resolveColumnIndex(columnId, positional);
  const stickyId = ctx.stickyColumnId(columnIndex);
  const { index } = useBasicRowContext('Cell');
  const ref = useRef<HTMLTableCellElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(ref);
  const sticky = useStickyCellStyles({
    stickyColumns: ctx.stickyColumns,
    columnId: stickyId,
    getClassName: stickyClassNames,
  });
  const mergedRef = useMergeRefs(ref, sticky.ref);
  const cellProps = ctx.getCellProps(columnIndex, index);
  return (
    <td
      {...cellProps}
      {...rest}
      ref={mergedRef}
      className={clsx(styles.cell, sticky.className, className)}
      style={{ ...sticky.style, ...style }}
      tabIndex={tabIndex === -1 ? undefined : tabIndex}
    >
      {children}
    </td>
  );
};

// The expanded region is NESTED inside the measured Row (same `<tr>`), on a second grid
// line spanning all columns, so windowing only sees "one taller auto row." It reads `expanded`/`id`
// from its row context and owns the region a11y (region role + label + Escape-to-return-focus). The
// disclosure toggle is placed by the consumer in a Cell with id `${Row.id}-toggle`.
export const ExpandedContent = ({
  label,
  children,
}: BasicTableProps.ExpandedContentProps): React.ReactElement | null => {
  const ctx = useBasicTableContext('ExpandedContent');
  const row = useBasicRowContext('ExpandedContent');
  if (!row.expanded) {
    return null;
  }
  const regionId = row.id ? `${row.id}-region` : undefined;
  return (
    <td
      role={ctx.role === 'table' ? 'cell' : 'gridcell'}
      aria-colindex={1}
      aria-colspan={ctx.columnCount}
      className={styles['expanded-cell']}
      style={{ gridColumn: '1 / -1' }}
    >
      <div
        role="region"
        id={regionId}
        aria-label={label}
        className={styles['expanded-region']}
        data-awsui-table-suppress-navigation="true"
        onKeyDown={event => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            const toggle = row.id ? document.getElementById(`${row.id}-toggle`) : null;
            if (toggle) {
              toggle.focus();
            } else {
              row.onToggleExpand?.();
            }
          }
        }}
      >
        {children}
      </div>
    </td>
  );
};

// --- Row ---------------------------------------------------------------------

// Renders its Cell / ExpandedContent children directly (no harvesting), wrapping each in a
// positional `ColumnIndexProvider`, and provides the row context so those children learn their
// index / expansion. Static grid props come from the hook; a virtual consumer's spread `rowProps`
// (absolute offset + aria-rowindex override + measure ref) wins.
export const Row = React.forwardRef<HTMLTableRowElement, BasicTableProps.RowProps>(function Row(
  { index, id, expanded, onToggleExpand, children, className, style, ...rest },
  ref
) {
  const ctx = useBasicTableContext('Row');
  const rowProps = ctx.getRowProps(index);
  const rowContext = useMemo<BasicRowContextValue>(
    () => ({ index, id, expanded, onToggleExpand }),
    [index, id, expanded, onToggleExpand]
  );
  return (
    <BasicRowContextProvider value={rowContext}>
      <tr
        {...rowProps}
        {...rest}
        ref={ref}
        className={clsx(styles.row, className)}
        style={{ ...rowProps.style, ...style }}
      >
        {withColumnIndices(children)}
      </tr>
    </BasicRowContextProvider>
  );
});

// --- Root --------------------------------------------------------------------

type InternalRootProps = BasicTableProps & InternalBaseComponentProps;

export function InternalRoot(props: InternalRootProps) {
  const {
    columns,
    role = 'grid',
    resizableColumns = false,
    columnWidths,
    onColumnWidthsChange,
    stickyColumns,
    contentDensity = 'comfortable',
    totalRowCount = 0,
    height,
    maxHeight,
    header,
    empty,
    loading = false,
    loadingText,
    i18nStrings,
    children,
    __internalRootRef,
  } = props;

  const table = useBasicTable({
    columns,
    role,
    resizableColumns,
    columnWidths,
    onColumnWidthsChange,
    stickyColumns,
    contentDensity,
    totalRowCount,
    i18nStrings,
  });

  const columnCount = table.columnCount;
  const showLoading = loading;
  const showEmpty = !loading && totalRowCount === 0;

  const stickyFirst = stickyColumns?.first ?? 0;
  const stickyLast = stickyColumns?.last ?? 0;
  const pageSize = Math.max(1, Math.min(totalRowCount || 1, 100));

  const tableRef = useRef<HTMLTableElement>(null);
  const scrollContainerRef = useMergeRefs(table.stickyColumns.refs.wrapper);
  const mergedTableRef = useMergeRefs(tableRef, table.stickyColumns.refs.table);

  const baseProps = getBaseProps(props);
  const tableProps = table.getTableProps();

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      {header && <div className={styles.header}>{header}</div>}
      <BasicTableContextProvider value={table}>
        <GridNavigationProvider
          keyboardNavigation={role !== 'table'}
          pageSize={pageSize}
          getTable={() => tableRef.current}
        >
          <div
            ref={scrollContainerRef}
            className={styles['scroll-container']}
            style={{ blockSize: height, maxBlockSize: maxHeight, ...table.stickyColumns.style.wrapper }}
          >
            <table
              {...tableProps}
              ref={mergedTableRef}
              className={clsx(
                styles['grid-table'],
                stickyFirst + stickyLast > 0 && styles['grid-table-sticky'],
                contentDensity === 'compact' && getVisualContextClassname('compact-table')
              )}
            >
              {children}
              {(showLoading || showEmpty) && (
                <tbody role="rowgroup" className={styles['state-rowgroup']}>
                  <tr role="row" aria-rowindex={totalRowCount + 2} className={styles['state-row']}>
                    <td
                      role={role === 'table' ? 'cell' : 'gridcell'}
                      aria-colindex={1}
                      aria-colspan={Math.max(1, columnCount)}
                      colSpan={Math.max(1, columnCount)}
                      className={styles['state-cell']}
                    >
                      {showLoading ? (
                        <span className={styles.loading}>
                          <StatusIndicator type="loading" wrapText={true}>
                            <LiveRegion tagName="span">{loadingText}</LiveRegion>
                          </StatusIndicator>
                        </span>
                      ) : (
                        <div className={styles.empty}>{empty}</div>
                      )}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </GridNavigationProvider>
      </BasicTableContextProvider>
    </div>
  );
}
