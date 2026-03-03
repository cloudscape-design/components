// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { ColumnWidthStyle } from '../column-widths-utils';
import { TableProps } from '../interfaces';
import { Divider, Resizer } from '../resizer';
import { StickyColumnsCellState, StickyColumnsModel } from '../sticky-columns';
import { TableRole } from '../table-role';
import { TableThElement } from './th-element';

import styles from './styles.css.js';

export interface TableGroupHeaderCellProps {
  group: TableProps.ColumnGroupsDefinition<any>;
  colspan: number;
  rowspan: number;
  colIndex: number;
  groupId: string;
  /** First visible leaf column ID among this group's children — used for sticky offset. */
  firstChildColumnId?: PropertyKey;
  /** Last visible leaf column ID among this group's children — used for clip-path computation. */
  lastChildColumnId?: PropertyKey;
  resizableColumns?: boolean;
  resizableStyle?: ColumnWidthStyle;
  onResizeFinish: () => void;
  updateGroupWidth: (groupId: PropertyKey, newWidth: number) => void;
  childColumnIds: PropertyKey[];
  childColumnMinWidths: Map<PropertyKey, number>;
  focusedComponent?: null | string;
  tabIndex: number;
  stuck?: boolean;
  sticky?: boolean;
  hidden?: boolean;
  stripedRows?: boolean;
  stickyState: StickyColumnsModel;
  cellRef: React.RefCallback<HTMLElement>;
  tableRole: TableRole;
  resizerRoleDescription?: string;
  resizerTooltipText?: string;
  variant: TableProps.Variant;
  tableVariant?: TableProps.Variant;
}

export function TableGroupHeaderCell({
  group,
  colspan,
  rowspan,
  colIndex,
  groupId,
  firstChildColumnId,
  lastChildColumnId,
  resizableColumns,
  resizableStyle,
  onResizeFinish,
  updateGroupWidth,
  // childColumnIds,
  // childColumnMinWidths,
  focusedComponent,
  tabIndex,
  stuck,
  sticky,
  hidden,
  stripedRows,
  stickyState,
  cellRef,
  tableRole,
  resizerRoleDescription,
  resizerTooltipText,
  variant,
  tableVariant,
}: TableGroupHeaderCellProps) {
  const headerId = useUniqueId('table-group-header-');

  const clickableHeaderRef = useRef<HTMLDivElement>(null);
  const { tabIndex: clickableHeaderTabIndex } = useSingleTabStopNavigation(clickableHeaderRef, { tabIndex });

  const cellRefObject = useRef<HTMLElement>(null);
  const cellRefCombined = useMergeRefs(cellRef, cellRefObject);

  // Cached wrapper element and cleanup for scroll listener
  const wrapperRef = useRef<HTMLElement | null>(null);
  const removeScrollListenerRef = useRef<(() => void) | null>(null);

  /**
   * Dynamically constrains the group <th>'s width as child columns scroll out of view.
   *
   * Approach (same as ag-grid): directly set `style.width` on the sticky <th> to
   *   max(0, lastChild.getBoundingClientRect().right - groupTh.getBoundingClientRect().left)
   *
   * As the last child column scrolls left, its `.right` decreases, shrinking the group width.
   * The right border moves with the last child's right edge — no clip-path needed.
   * When all children are off-screen, width collapses to 0.
   * When all children are fully visible, width is cleared so colspan drives layout.
   */
  const computeWidth = () => {
    const groupEl = cellRefObject.current;
    if (!groupEl) {
      return;
    }

    // Find the last child's <th> via data-focus-id attribute, scoped to thead
    let lastChildEl: Element | null = null;
    if (lastChildColumnId) {
      const thead = groupEl.closest('thead');
      if (thead) {
        lastChildEl = thead.querySelector(`[data-focus-id="header-${String(lastChildColumnId)}"]`);
      }
    }

    if (!lastChildEl) {
      groupEl.style.maxWidth = '';
      return;
    }

    const groupRect = groupEl.getBoundingClientRect();
    const lastChildRect = lastChildEl.getBoundingClientRect();
    // Width from our stuck left edge to the last child's current right edge
    const constrainedWidth = lastChildRect.right - groupRect.left;

    if (constrainedWidth >= groupEl.offsetWidth) {
      // All children fully visible — release constraint
      groupEl.style.maxWidth = '';
    } else {
      // Constrain right edge: overflow:hidden on the th clips the border/content
      groupEl.style.maxWidth = `${Math.max(0, constrainedWidth)}px`;
    }
  };

  /**
   * Finds the scrollable wrapper ancestor and attaches the scroll listener.
   * Called after the ref is populated (from within the sticky store subscription
   * or a deferred effect).
   */
  const attachScrollListener = () => {
    const el = cellRefObject.current;
    if (!el) {
      return;
    }

    // Remove any existing listener before re-attaching
    removeScrollListenerRef.current?.();
    removeScrollListenerRef.current = null;

    // Find scrollable wrapper ancestor
    let wrapper: HTMLElement | null = el.parentElement;
    while (
      wrapper &&
      getComputedStyle(wrapper).overflowX !== 'auto' &&
      getComputedStyle(wrapper).overflowX !== 'scroll'
    ) {
      wrapper = wrapper.parentElement;
    }

    if (!wrapper) {
      return;
    }
    wrapperRef.current = wrapper;

    const listener = () => computeWidth();
    wrapper.addEventListener('scroll', listener, { passive: true });
    removeScrollListenerRef.current = () => wrapper!.removeEventListener('scroll', listener);

    // Run immediately to set initial width state
    computeWidth();
  };

  // Attach scroll listener after React has committed the DOM and populated cellRefObject.
  // We use setTimeout(0) to defer past the synchronous ref-assignment phase.
  useEffect(() => {
    const id = setTimeout(attachScrollListener, 0);
    return () => {
      clearTimeout(id);
      removeScrollListenerRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastChildColumnId]);

  // Subscribe to the sticky store for the first child column's state.
  // When sticky columns are active, we apply the first child's insetInlineStart offset
  // to the group <th> and trigger a clip recompute.
  // We also apply the shadow class when the last child is at the sticky boundary.
  useEffect(() => {
    if (!firstChildColumnId) {
      return;
    }

    const selector = (
      state: Parameters<typeof stickyState.store.subscribe>[0] extends (s: infer S) => any ? S : never
    ) => state.cellState.get(firstChildColumnId) ?? null;

    const lastSelector = lastChildColumnId
      ? (state: Parameters<typeof stickyState.store.subscribe>[0] extends (s: infer S) => any ? S : never) =>
          state.cellState.get(lastChildColumnId) ?? null
      : null;

    const applyStyles = (firstState: StickyColumnsCellState | null, lastState: StickyColumnsCellState | null) => {
      const thEl = cellRefObject.current;
      if (!thEl) {
        return;
      }

      // Apply sticky offset to the <th> itself
      if (firstState?.offset.insetInlineStart !== undefined) {
        thEl.style.insetInlineStart = `${firstState.offset.insetInlineStart}px`;
      } else {
        thEl.style.insetInlineStart = '';
      }

      // Shadow class on the <th> when last child is at the sticky boundary
      const stickyLastClass = styles['sticky-cell-last-inline-start'];
      if (lastState?.lastInsetInlineStart) {
        thEl.classList.add(stickyLastClass);
      } else {
        thEl.classList.remove(stickyLastClass);
      }

      // Re-attach scroll listener if wrapper not yet found (handles initial mount timing)
      if (!wrapperRef.current) {
        attachScrollListener();
      } else {
        computeWidth();
      }
    };

    // Apply immediately from current state
    const firstState = stickyState.store.get().cellState.get(firstChildColumnId) ?? null;
    const lastState = lastChildColumnId ? (stickyState.store.get().cellState.get(lastChildColumnId) ?? null) : null;
    applyStyles(firstState, lastState);

    const unsubFirst = stickyState.store.subscribe(selector, () => {
      const s1 = stickyState.store.get().cellState.get(firstChildColumnId) ?? null;
      const s2 = lastChildColumnId ? (stickyState.store.get().cellState.get(lastChildColumnId) ?? null) : null;
      applyStyles(s1, s2);
    });

    const unsubLast = lastChildColumnId
      ? stickyState.store.subscribe(lastSelector!, () => {
          const s1 = stickyState.store.get().cellState.get(firstChildColumnId) ?? null;
          const s2 = stickyState.store.get().cellState.get(lastChildColumnId) ?? null;
          applyStyles(s1, s2);
        })
      : null;

    return () => {
      unsubFirst();
      unsubLast?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstChildColumnId, lastChildColumnId, stickyState.store]);

  return (
    <TableThElement
      resizableStyle={resizableStyle}
      cellRef={cellRefCombined}
      focusedComponent={focusedComponent}
      stuck={stuck}
      sticky={sticky}
      resizable={resizableColumns}
      hidden={hidden}
      stripedRows={stripedRows}
      colIndex={colIndex}
      columnId={groupId}
      stickyState={stickyState}
      tableRole={tableRole}
      variant={variant}
      tableVariant={tableVariant}
      colSpan={colspan}
      rowSpan={rowspan}
      scope="colgroup"
    >
      <div
        ref={clickableHeaderRef}
        data-focus-id={`group-header-${groupId}`}
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]: focusedComponent === `group-header-${groupId}`,
        })}
        aria-label={group.ariaLabel?.({ sorted: false, descending: false, disabled: true })}
        tabIndex={clickableHeaderTabIndex}
      >
        <div className={styles['header-cell-text']} id={headerId}>
          {group.header}
        </div>
      </div>
      {resizableColumns ? (
        <Resizer
          tabIndex={tabIndex}
          focusId={`resize-group-${groupId}`}
          showFocusRing={focusedComponent === `resize-group-${groupId}`}
          onWidthUpdate={newWidth => updateGroupWidth(groupId, newWidth)}
          onWidthUpdateCommit={onResizeFinish}
          ariaLabelledby={headerId}
          minWidth={undefined}
          roleDescription={resizerRoleDescription}
          tooltipText={resizerTooltipText}
          isBorderless={variant === 'full-page' || variant === 'embedded' || variant === 'borderless'}
        />
      ) : (
        <Divider className={styles['resize-divider']} />
      )}
    </TableThElement>
  );
}
