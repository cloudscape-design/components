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
  group: TableProps.GroupDefinition<any>;
  colspan: number;
  rowspan: number;
  colIndex: number;
  groupId: string;
  firstChildColumnId?: PropertyKey;
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
  isLastChildOfGroup?: boolean;
  columnGroupId?: string;
  isLastInRow?: boolean;
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
  childColumnIds,
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
  isLastChildOfGroup,
  columnGroupId,
}: TableGroupHeaderCellProps) {
  const headerId = useUniqueId('table-group-header-');

  const clickableHeaderRef = useRef<HTMLDivElement>(null);
  const { tabIndex: clickableHeaderTabIndex } = useSingleTabStopNavigation(clickableHeaderRef, { tabIndex });

  const cellRefObject = useRef<HTMLElement>(null);
  const cellRefCombined = useMergeRefs(cellRef, cellRefObject);

  const wrapperRef = useRef<HTMLElement | null>(null);
  const removeScrollListenerRef = useRef<(() => void) | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const innerWrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const computeVisibleWidth = () => {
    const thEl = cellRefObject.current;
    const innerEl = innerWrapperRef.current;
    if (!thEl || !innerEl) {
      return;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const thRect = thEl.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const thead = thEl.closest('thead');

    const cellState = stickyState.store.get().cellState;
    const stickyLeft = firstChildColumnId ? (cellState.get(firstChildColumnId)?.offset.insetInlineStart ?? 0) : 0;
    const hasStickyLastChildren = childColumnIds.some(id => cellState.get(id)?.offset.insetInlineEnd !== undefined);

    const paddingStart = parseFloat(getComputedStyle(thEl).paddingInlineStart) || 0;
    const screenLeft = Math.max(thRect.left, wrapperRect.left + stickyLeft) + paddingStart;

    const lastChildEl = lastChildColumnId
      ? thead?.querySelector(`[data-focus-id="header-${String(lastChildColumnId)}"]`)
      : null;
    const ceilingRight = Math.min(
      thRect.right,
      lastChildEl ? lastChildEl.getBoundingClientRect().right : thRect.right,
      wrapperRect.right
    );

    // For sticky-last: track the leftmost stuck child's screen left to determine the stuck trigger.
    let floor = 0;
    let leftmostStuckLastLeft = Infinity;
    if (thead) {
      for (const id of childColumnIds) {
        const cs = cellState.get(id);
        if (cs?.offset.insetInlineStart !== undefined) {
          const el = thead.querySelector(`[data-focus-id="header-${String(id)}"]`);
          if (el) {
            floor = Math.max(floor, el.getBoundingClientRect().right - screenLeft);
          }
        } else if (cs?.offset.insetInlineEnd !== undefined) {
          const el = thead.querySelector(`[data-focus-id="header-${String(id)}"]`);
          if (el) {
            const childLeft = el.getBoundingClientRect().left;
            floor = Math.max(floor, thRect.right - childLeft);
            leftmostStuckLastLeft = Math.min(leftmostStuckLastLeft, childLeft);
          }
        }
      }
    }

    const isStuckFirst = floor > 0 && stickyLeft > 0;
    // sticky-last is stuck whenever any sticky-end child is active (leftmostStuckLastLeft is finite).
    // This covers 2-of-N, all-of-N, and 4-of-N cases where the group <th> must be pinned to the
    // right edge via position:sticky + inset-inline-end:0 to prevent it from drifting off-screen.
    const isStuckLast = hasStickyLastChildren && leftmostStuckLastLeft !== Infinity;

    let maxWidth: number;
    if (hasStickyLastChildren) {
      // Inner wrapper is right-anchored (insetInlineEnd:0), so maxWidth = how far left it extends.
      // Ceiling: visible portion from the right, clamped to the actually-visible part of the <th>
      // (use Math.max(thRect.left, wrapperRect.left) so we don't count area scrolled off-screen).
      const visibleFromRight = Math.max(
        0,
        Math.min(thRect.right, wrapperRect.right) - Math.max(thRect.left, wrapperRect.left)
      );
      // Floor: must always cover stuck children (thRect.right - leftmostStuckLastLeft)
      const stuckChildrenWidth =
        leftmostStuckLastLeft !== Infinity ? Math.max(0, thRect.right - leftmostStuckLastLeft) : 0;
      maxWidth = Math.max(stuckChildrenWidth, visibleFromRight);
    } else {
      maxWidth = Math.max(floor, Math.max(0, ceilingRight - screenLeft));
    }

    innerEl.style.maxWidth = maxWidth >= thEl.offsetWidth ? '' : `${maxWidth}px`;

    if (hasStickyLastChildren) {
      // Always right-anchor for sticky-last groups so the label tracks the right boundary.
      innerEl.style.insetInlineEnd = '0';
      innerEl.style.insetInlineStart = 'auto';
    } else {
      innerEl.style.insetInlineEnd = '';
      innerEl.style.insetInlineStart = stickyLeft > 0 ? `${stickyLeft}px` : '';
    }

    if (isStuckFirst) {
      // const visibleRight = screenLeft + maxWidth;
      // const trimRight = Math.max(0, thRect.right - visibleRight);
      // thEl.style.clipPath = trimRight > 0 ? `inset(0 ${trimRight}px 0 -24px)` : '';
    } else if (isStuckLast) {
      // const visibleLeft = thRect.right - maxWidth;
      // const trimLeft = Math.max(0, visibleLeft - thRect.left);
      // thEl.style.clipPath = trimLeft > 0 ? `inset(0 -24px 0 ${trimLeft}px)` : '';
    } else {
      // thEl.style.clipPath = '';
    }

    if (isStuckFirst) {
      thEl.style.position = 'sticky';
      thEl.style.zIndex = '800';
      thEl.style.insetInlineStart = `${stickyLeft}px`;
      thEl.style.insetInlineEnd = '';
    } else if (isStuckLast) {
      thEl.style.position = 'sticky';
      thEl.style.zIndex = '800';
      thEl.style.insetInlineEnd = '0px';
      thEl.style.insetInlineStart = '';
    } else {
      thEl.style.position = '';
      thEl.style.zIndex = '';
      thEl.style.insetInlineStart = '';
      thEl.style.insetInlineEnd = '';
    }

    if (groupId === 'configuration') {
      console.log(groupId, isStuckFirst, isStuckLast);
    }
    // thEl.classList.toggle(styles['sticky-cell-last-inline-start'], isStuckFirst);
    // thEl.classList.toggle(styles['sticky-cell-last-inline-end'], isStuckLast);
  };

  const scheduleCompute = () => {
    if (rafRef.current !== null) {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      computeVisibleWidth();
    });
  };

  const attachScrollListener = () => {
    const el = cellRefObject.current;
    if (!el) {
      return;
    }

    removeScrollListenerRef.current?.();
    removeScrollListenerRef.current = null;

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

    wrapper.addEventListener('scroll', scheduleCompute, { passive: true });
    removeScrollListenerRef.current = () => wrapper!.removeEventListener('scroll', scheduleCompute);

    // Observe the <th> size so computeVisibleWidth re-runs after column resizes.
    resizeObserverRef.current?.disconnect();
    const ro = new ResizeObserver(scheduleCompute);
    ro.observe(el);
    resizeObserverRef.current = ro;

    computeVisibleWidth();
  };

  useEffect(() => {
    const id = setTimeout(attachScrollListener, 0);
    return () => {
      clearTimeout(id);
      removeScrollListenerRef.current?.();
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastChildColumnId]);

  useEffect(() => {
    if (!firstChildColumnId && !lastChildColumnId) {
      return;
    }

    const firstSelector = firstChildColumnId
      ? (state: Parameters<typeof stickyState.store.subscribe>[0] extends (s: infer S) => any ? S : never) =>
          state.cellState.get(firstChildColumnId) ?? null
      : null;

    const lastSelector = lastChildColumnId
      ? (state: Parameters<typeof stickyState.store.subscribe>[0] extends (s: infer S) => any ? S : never) =>
          state.cellState.get(lastChildColumnId) ?? null
      : null;

    const applyStyles = (firstState: StickyColumnsCellState | null, lastState: StickyColumnsCellState | null) => {
      const thEl = cellRefObject.current;
      if (!thEl) {
        return;
      }

      const stickyLastClass = styles['sticky-cell-last-inline-start'];
      const stickyLastEndClass = styles['sticky-cell-last-inline-end'];

      if (lastState?.lastInsetInlineStart) {
        thEl.classList.add(stickyLastClass);
      } else {
        thEl.classList.remove(stickyLastClass);
      }

      if (firstState?.lastInsetInlineEnd) {
        thEl.classList.add(stickyLastEndClass);
      } else {
        thEl.classList.remove(stickyLastEndClass);
      }

      if (!wrapperRef.current) {
        attachScrollListener();
      } else {
        computeVisibleWidth();
      }
    };

    const firstState = firstChildColumnId ? (stickyState.store.get().cellState.get(firstChildColumnId) ?? null) : null;
    const lastState = lastChildColumnId ? (stickyState.store.get().cellState.get(lastChildColumnId) ?? null) : null;
    applyStyles(firstState, lastState);

    const unsubFirst = firstSelector
      ? stickyState.store.subscribe(firstSelector, () => {
          const s1 = firstChildColumnId ? (stickyState.store.get().cellState.get(firstChildColumnId) ?? null) : null;
          const s2 = lastChildColumnId ? (stickyState.store.get().cellState.get(lastChildColumnId) ?? null) : null;
          applyStyles(s1, s2);
        })
      : null;

    const unsubLast = lastSelector
      ? stickyState.store.subscribe(lastSelector, () => {
          const s1 = firstChildColumnId ? (stickyState.store.get().cellState.get(firstChildColumnId) ?? null) : null;
          const s2 = lastChildColumnId ? (stickyState.store.get().cellState.get(lastChildColumnId) ?? null) : null;
          applyStyles(s1, s2);
        })
      : null;

    return () => {
      unsubFirst?.();
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
      isLastChildOfGroup={isLastChildOfGroup}
      columnGroupId={columnGroupId}
    >
      <div ref={innerWrapperRef} className={styles['header-cell-content-group-inner']}>
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
          <Divider className={clsx(styles['resize-divider'])} />
        )}
      </div>
    </TableThElement>
  );
}
