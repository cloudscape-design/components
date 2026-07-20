// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useMemo } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVirtualTableContext, VirtualTableContextProvider, VirtualTableContextValue } from './context';
import { VirtualGridColumn, VirtualTableProps } from './interfaces';
import { useVirtualGrid } from './use-virtual-grid';

import styles from './styles.css.js';

// The compound Cloudscape SKIN (cell F3-A2). `InternalRoot` is the ONLY component that
// calls the headless core (`useVirtualGrid`): it maps its props onto the core config,
// derives the column authority from its `HeaderCell` children, probes the row template for
// an `ExpandedContent` child (to enable the disclosure column), runs the core, and provides
// the returned `VirtualGrid` via context. Header / HeaderCell / Row / Cell / ExpandedContent
// then render Cloudscape-styled DOM and SPREAD the core's role/ARIA props — they never author
// ARIA of their own. HeaderCell / Cell / ExpandedContent are descriptor components (never
// mounted; Header and Row extract their props by identity), so they render null.
//
// SCAFFOLD SCOPE: the shell, roles, slots, the core seam, and repo wiring/typings. The core
// body is a NON-WINDOWED placeholder (renders every row) — the real windowing/measurement/
// focus/live-tail engine lands in impl-F3-A2-core.

// --- Descriptor components (extracted by identity; never rendered) -----------

export const Header = (props: VirtualTableProps.HeaderProps): React.ReactElement | null => {
  return <HeaderImpl {...props} />;
};

export const HeaderCell = (() => null) as (props: VirtualTableProps.HeaderCellProps) => React.ReactElement | null;

export function Body<T>(props: VirtualTableProps.BodyProps<T>): React.ReactElement | null {
  return <BodyImpl {...props} />;
}

export const Cell = (() => null) as (props: VirtualTableProps.CellProps) => React.ReactElement | null;

export const ExpandedContent = (() => null) as (
  props: VirtualTableProps.ExpandedContentProps
) => React.ReactElement | null;

export function Row<T>(props: VirtualTableProps.RowProps<T>): React.ReactElement | null {
  return <RowImpl {...props} />;
}

// --- Header ------------------------------------------------------------------

function getHeaderCells(header: React.ReactNode): Array<React.ReactElement<VirtualTableProps.HeaderCellProps>> {
  return React.Children.toArray(header)
    .filter(React.isValidElement)
    .filter(child => child.type === HeaderCell) as Array<React.ReactElement<VirtualTableProps.HeaderCellProps>>;
}

function HeaderImpl({ sticky, children }: VirtualTableProps.HeaderProps) {
  const ctx = useVirtualTableContext('Header');
  const { headerProps } = ctx.grid;
  const headerCells = getHeaderCells(children);
  return (
    <div role="rowgroup" className={clsx(styles['header-rowgroup'], sticky && styles['sticky-header'])}>
      <div {...headerProps.rowProps} className={styles['header-row']}>
        {ctx.hasDisclosureColumn && headerProps.disclosureHeaderProps && (
          <div {...headerProps.disclosureHeaderProps} className={styles['disclosure-header']} />
        )}
        {headerCells.map(hc => {
          const { columnId } = hc.props;
          const sortButtonProps = headerProps.sortButtonProps(columnId);
          return (
            <div
              key={columnId}
              {...headerProps.cellProps(columnId)}
              className={styles['header-cell']}
              style={ctx.columnStyleOf(columnId)}
            >
              {sortButtonProps ? (
                <button {...sortButtonProps} className={styles['sort-button']}>
                  {hc.props.children}
                </button>
              ) : (
                hc.props.children
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Body --------------------------------------------------------------------

function BodyImpl<T>({ children }: VirtualTableProps.BodyProps<T>) {
  const ctx = useVirtualTableContext<T>('Body');
  const { grid } = ctx;
  return (
    <div role="rowgroup" {...grid.bodyProps} className={styles.body}>
      {grid.rows.map(row => {
        const context = grid.getRowContext(row.key);
        const api: VirtualTableProps.RowApi = {
          rowIndex: context.rowIndex,
          totalItemCount: context.totalItemCount,
          isExpanded: context.isExpanded,
        };
        return <React.Fragment key={row.key}>{children(row.item, api)}</React.Fragment>;
      })}
    </div>
  );
}

// --- Row (extracts Cells + ExpandedContent, reconciles by columnId) ----------

function RowImpl<T>({ item, children }: VirtualTableProps.RowProps<T>) {
  const ctx = useVirtualTableContext<T>('Row');
  const virtualRow = ctx.rowById(ctx.trackBy(item));
  if (!virtualRow) {
    return null; // outside the window
  }

  const childArray = React.Children.toArray(children).filter(React.isValidElement);
  const cellElements = childArray.filter(child => child.type === Cell) as Array<
    React.ReactElement<VirtualTableProps.CellProps>
  >;
  const expandedContent = childArray.find(child => child.type === ExpandedContent) as
    | React.ReactElement<VirtualTableProps.ExpandedContentProps>
    | undefined;

  // Header<->body reconciliation: place body Cells in the HeaderCell column order, matched
  // by columnId. A missing column renders an empty gridcell; an unknown columnId dev-warns
  // and is dropped (so the row stays a coherent rectangle aligned to the header).
  const cellById = new Map(cellElements.map(cell => [cell.props.columnId, cell]));
  for (const cell of cellElements) {
    if (!ctx.columns.some(col => col.columnId === cell.props.columnId)) {
      warnOnce(
        'VirtualTable',
        `Cell columnId "${cell.props.columnId}" has no matching HeaderCell; it is not rendered.`
      );
    }
  }

  return (
    <>
      <div {...virtualRow.rowProps} className={styles.row}>
        {ctx.hasDisclosureColumn && virtualRow.disclosure && (
          <div {...virtualRow.disclosure.cellProps} className={styles['disclosure-cell']}>
            <button {...virtualRow.disclosure.buttonProps} className={styles['disclosure-button']}>
              {virtualRow.disclosure.isExpanded ? '\u25be' : '\u25b8'}
            </button>
          </div>
        )}
        {ctx.columns.map(col => (
          <div
            key={col.columnId}
            {...virtualRow.cellProps(col.columnId)}
            className={styles.cell}
            style={ctx.columnStyleOf(col.columnId)}
          >
            {cellById.get(col.columnId)?.props.children}
          </div>
        ))}
      </div>
      {virtualRow.expandedRowProps && expandedContent && (
        <div {...virtualRow.expandedRowProps} className={styles['expanded-row']}>
          {/* A DIV, not a span: the expanded gridcell holds ARBITRARY block content. */}
          <div {...virtualRow.expandedGridcellProps} className={styles['expanded-cell']}>
            <div {...virtualRow.expandedRegionProps} ref={virtualRow.measureRef} className={styles['expanded-region']}>
              {expandedContent.props.children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Root (the only caller of the core) --------------------------------------

type InternalRootProps<T> = VirtualTableProps<T> & InternalBaseComponentProps;

export function InternalRoot<T>(props: InternalRootProps<T>) {
  const {
    items,
    trackBy,
    estimatedRowHeight,
    overscan,
    getRowHeight,
    expandedItems,
    defaultExpandedItems,
    onExpandChange,
    sortingColumn,
    sortingDescending,
    onSortingChange,
    columnLayout = 'fixed',
    role = 'grid',
    onVisibleRangeChange,
    header,
    empty,
    loading = false,
    loadingText,
    ariaLabels,
    imperativeRef,
    children,
    __internalRootRef,
  } = props;

  const childArray = React.Children.toArray(children).filter(React.isValidElement);
  const headerElement = childArray.find(child => child.type === Header) as
    | React.ReactElement<VirtualTableProps.HeaderProps>
    | undefined;
  const bodyElement = childArray.find(child => child.type === Body) as
    | React.ReactElement<VirtualTableProps.BodyProps<T>>
    | undefined;

  const headerCells = getHeaderCells(headerElement?.props.children);
  const columns: ReadonlyArray<VirtualGridColumn> = headerCells.map(hc => ({
    columnId: hc.props.columnId,
    sortable: hc.props.sortingField !== undefined,
    stretch: hc.props.stretch,
  }));

  // Probe the row template ONCE to detect an ExpandedContent child (enables the disclosure
  // column) AND capture its height hints so Root threads the runway seed / fixed height into
  // the core (NB3). The template is a pure function of (item, api), so this is safe.
  const expandedProbe = useMemo(() => {
    if (!bodyElement || items.length === 0) {
      return { has: false as const };
    }
    const probed = bodyElement.props.children(items[0], {
      rowIndex: 1,
      totalItemCount: items.length,
      isExpanded: false,
    });
    if (!React.isValidElement(probed)) {
      return { has: false as const };
    }
    const rowChildren = React.Children.toArray((probed.props as VirtualTableProps.RowProps<T>).children).filter(
      React.isValidElement
    );
    const ec = rowChildren.find(child => child.type === ExpandedContent) as
      | React.ReactElement<VirtualTableProps.ExpandedContentProps>
      | undefined;
    if (!ec) {
      return { has: false as const };
    }
    return { has: true as const, estimatedHeight: ec.props.estimatedHeight, fixedHeight: ec.props.fixedHeight };
  }, [bodyElement, items]);
  const hasExpandableRows = expandedProbe.has;

  const grid = useVirtualGrid<T>({
    items,
    trackBy,
    columns,
    hasExpandableRows,
    estimatedRowHeight,
    overscan,
    getRowHeight,
    getExpandedRowHeight:
      expandedProbe.has && expandedProbe.fixedHeight !== undefined ? () => expandedProbe.fixedHeight! : undefined,
    defaultExpandedEstimate: expandedProbe.has ? expandedProbe.estimatedHeight : undefined,
    expandedItems,
    defaultExpandedItems,
    role,
    ariaLabel: ariaLabels?.tableLabel,
    expandButtonLabel: ariaLabels?.expandButtonLabel,
    expandedRegionLabel: ariaLabels?.expandedRegionLabel,
    activateSortLabel: ariaLabels?.activateSortLabel,
    sortingColumn,
    sortingDescending,
    onExpandChange: onExpandChange ? detail => fireNonCancelableEvent(onExpandChange, detail) : undefined,
    onSortingChange: onSortingChange ? detail => fireNonCancelableEvent(onSortingChange, detail) : undefined,
    onVisibleRangeChange: onVisibleRangeChange
      ? detail => fireNonCancelableEvent(onVisibleRangeChange, detail)
      : undefined,
    renderAppendAnnouncement: ariaLabels?.appendAnnouncement,
  });

  useImperativeHandle(
    imperativeRef,
    () => ({
      scrollToEnd: grid.scrollToEnd,
      scrollToItem: grid.scrollToItem,
      isPinnedToEnd: grid.isPinnedToEnd,
    }),
    [grid]
  );

  const rowMap = useMemo(() => new Map(grid.rows.map(row => [row.key, row])), [grid.rows]);

  // Single stretch target: if several HeaderCells set stretch, the last-declared wins (CW-8).
  let lastStretchColumnId: string | undefined;
  for (const cell of headerCells) {
    if (cell.props.stretch) {
      lastStretchColumnId = cell.props.columnId;
    }
  }

  const columnStyleOf = (columnId: string): React.CSSProperties => {
    const hc = headerCells.find(cell => cell.props.columnId === columnId);
    if (columnLayout === 'auto') {
      return {};
    }
    if (columnId === lastStretchColumnId) {
      return { flex: '1 1 auto', minInlineSize: 0 };
    }
    const width = hc?.props.width;
    return {
      flex: `0 0 ${width ? `${width}px` : 'auto'}`,
      minInlineSize: hc?.props.minWidth ? `${hc.props.minWidth}px` : 0,
    };
  };

  const contextValue: VirtualTableContextValue<T> = {
    grid,
    hasDisclosureColumn: hasExpandableRows,
    columns,
    columnStyleOf,
    rowById: id => rowMap.get(id),
    trackBy,
  };

  const baseProps = getBaseProps(props);
  const { ref: gridRef, ...gridRest } = grid.gridProps;

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      {header && <div className={styles.header}>{header}</div>}
      <VirtualTableContextProvider value={contextValue as VirtualTableContextValue}>
        <div {...gridRest} ref={gridRef} className={styles['scroll-container']}>
          {headerElement}
          {!loading && items.length > 0 && bodyElement}
        </div>
      </VirtualTableContextProvider>
      {loading && (
        <div role="status" className={styles.loading}>
          {loadingText}
        </div>
      )}
      {!loading && items.length === 0 && <div className={styles.empty}>{empty}</div>}
      <div {...grid.liveRegionProps} className={styles['live-region']}>
        {grid.liveMessage}
      </div>
    </div>
  );
}
