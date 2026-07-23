// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { ExpandToggleButton } from '../internal/components/expand-toggle-button';
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
      <div
        {...headerProps.rowProps}
        className={styles['header-row']}
        style={{ gridTemplateColumns: ctx.gridTemplateColumns }}
      >
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
              ref={node => ctx.registerHeaderCell(columnId, node)}
            >
              {sortButtonProps ? (
                <button {...sortButtonProps} className={styles['sort-button']}>
                  {hc.props.children}
                </button>
              ) : (
                hc.props.children
              )}
              {ctx.resizableColumns && (
                <span
                  aria-hidden="true"
                  className={styles['resize-handle']}
                  onPointerDown={event => ctx.startColumnResize(columnId, event)}
                />
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
      <div
        {...virtualRow.rowProps}
        className={styles.row}
        style={{ ...virtualRow.rowProps.style, gridTemplateColumns: ctx.gridTemplateColumns }}
      >
        {ctx.hasDisclosureColumn && virtualRow.disclosure && (
          <div {...virtualRow.disclosure.cellProps} className={styles['disclosure-cell']}>
            {/* Match the standard Table expandable-row toggle exactly: the shared
                ExpandToggleButton renders the rotating angle-down/caret icon and owns the
                button role + aria-expanded + aria-label. The core resolves a single
                state-correct aria-label, so it feeds both label slots. */}
            <ExpandToggleButton
              isExpanded={virtualRow.disclosure.isExpanded}
              onExpandableItemToggle={virtualRow.disclosure.onToggle}
              expandButtonLabel={virtualRow.disclosure.buttonProps['aria-label']}
              collapseButtonLabel={virtualRow.disclosure.buttonProps['aria-label']}
              id={virtualRow.disclosure.buttonProps.id}
              ariaControls={virtualRow.disclosure.buttonProps['aria-controls']}
            />
          </div>
        )}
        {ctx.columns.map(col => (
          <div key={col.columnId} {...virtualRow.cellProps(col.columnId)} className={styles.cell}>
            {cellById.get(col.columnId)?.props.children}
          </div>
        ))}
      </div>
      {virtualRow.expandedRowProps && expandedContent && (
        <div
          {...virtualRow.expandedRowProps}
          className={styles['expanded-row']}
          style={{ ...virtualRow.expandedRowProps.style, gridTemplateColumns: ctx.gridTemplateColumns }}
        >
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
    height,
    maxHeight,
    expandedItems,
    defaultExpandedItems,
    onExpandChange,
    sortingColumn,
    sortingDescending,
    onSortingChange,
    resizableColumns = false,
    columnWidths,
    onColumnWidthsChange,
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

  // --- Shared column-track layout + resize -------------------------------------------------
  // ONE grid-template-columns string is computed from the HeaderCell set (+ the disclosure
  // column) and applied identically to the header row and every body row, so columns align
  // across rows content-independently. Track rules: the disclosure column is a fixed px track
  // (design token via a CSS var); a column with a resized/explicit width is `<w>px`; a
  // width-less column (incl. the stretch column) is `minmax(<minWidth||0>px, 1fr)` so flexible
  // columns share the remaining width equally. Resize maps take precedence over declared width.
  const isWidthControlled = columnWidths !== undefined;
  const [uncontrolledWidths, setUncontrolledWidths] = useState<Record<string, number>>({});
  const widths = isWidthControlled ? columnWidths! : uncontrolledWidths;

  const gridTemplateColumns = (() => {
    const tracks: string[] = [];
    if (hasExpandableRows) {
      // Leading disclosure column: an `auto` track that resolves to the disclosure cell's
      // fixed inline-size ($space-xl), identically in the header and every row.
      tracks.push('auto');
    }
    for (const hc of headerCells) {
      const { columnId, width, minWidth } = hc.props;
      const resized = widths[columnId];
      if (resized !== undefined) {
        tracks.push(`${Math.max(resized, minWidth ?? 0)}px`);
      } else if (width !== undefined) {
        tracks.push(`${width}px`);
      } else {
        tracks.push(`minmax(${minWidth ?? 0}px, 1fr)`);
      }
    }
    return tracks.join(' ');
  })();

  // Refs so the pointer-drag handlers always read the latest widths / minWidths / cell nodes
  // without re-subscribing listeners on every render.
  const headerCellRefs = useRef(new Map<string, HTMLElement>());
  const widthsRef = useRef(widths);
  widthsRef.current = widths;
  const minWidthByColumn = useRef(new Map<string, number | undefined>());
  minWidthByColumn.current = new Map(headerCells.map(hc => [hc.props.columnId, hc.props.minWidth]));

  const registerHeaderCell = useCallback((columnId: string, node: HTMLElement | null) => {
    if (node) {
      headerCellRefs.current.set(columnId, node);
    } else {
      headerCellRefs.current.delete(columnId);
    }
  }, []);

  const applyWidths = useCallback(
    (next: Record<string, number>) => {
      if (!isWidthControlled) {
        setUncontrolledWidths(next);
      }
      if (onColumnWidthsChange) {
        fireNonCancelableEvent(onColumnWidthsChange, { widths: next });
      }
    },
    [isWidthControlled, onColumnWidthsChange]
  );

  const resizeState = useRef<{ columnId: string; startX: number; startWidth: number } | null>(null);
  const startColumnResize = useCallback(
    (columnId: string, event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      // Freeze-on-first-resize: snapshot the CURRENT rendered px width of every column so
      // flexible (1fr) tracks become fixed px, making the drag predictable and alignment-safe.
      const frozen: Record<string, number> = { ...widthsRef.current };
      let needSnapshot = false;
      headerCellRefs.current.forEach((node, id) => {
        if (frozen[id] === undefined) {
          frozen[id] = Math.round(node.getBoundingClientRect().width);
          needSnapshot = true;
        }
      });
      const startWidth =
        frozen[columnId] ?? Math.round(headerCellRefs.current.get(columnId)?.getBoundingClientRect().width ?? 0);
      resizeState.current = { columnId, startX: event.clientX, startWidth };
      if (needSnapshot) {
        applyWidths(frozen);
      }
      const onMove = (moveEvent: PointerEvent) => {
        const state = resizeState.current;
        if (!state) {
          return;
        }
        const min = minWidthByColumn.current.get(state.columnId) ?? 0;
        const next = Math.max(min, Math.round(state.startWidth + (moveEvent.clientX - state.startX)));
        applyWidths({ ...widthsRef.current, [state.columnId]: next });
      };
      const onUp = () => {
        resizeState.current = null;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [applyWidths]
  );

  const contextValue: VirtualTableContextValue<T> = {
    grid,
    hasDisclosureColumn: hasExpandableRows,
    columns,
    gridTemplateColumns,
    resizableColumns,
    registerHeaderCell,
    startColumnResize,
    rowById: id => rowMap.get(id),
    trackBy,
  };

  const baseProps = getBaseProps(props);
  const { ref: gridRef, ...gridRest } = grid.gridProps;

  return (
    <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
      {header && <div className={styles.header}>{header}</div>}
      <VirtualTableContextProvider value={contextValue as VirtualTableContextValue}>
        <div
          {...gridRest}
          ref={gridRef}
          className={styles['scroll-container']}
          // A bounded viewport is what makes the model window: the visible range is derived
          // from this container's clientHeight, so an explicit height/maxHeight (or a
          // height-bounded parent via the flex-column root) clips it to the visible rows.
          style={{ blockSize: height, maxBlockSize: maxHeight }}
        >
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
