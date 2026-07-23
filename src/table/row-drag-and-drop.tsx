// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Drag-and-drop row reordering for Table.
 *
 * Design goals:
 * - Rows with form inputs (text fields, selects, checkboxes, etc.) work correctly.
 *   Clicking an input does NOT activate drag — only grabbing the dedicated handle does.
 * - Keyboard DnD (Space/Enter to pick up, Arrow keys to move, Space/Enter to drop,
 *   Escape to cancel) is fully supported via the shared KeyboardAndUAPSensor.
 * - ARIA live-region announcements are wired up via DndContext accessibility prop.
 * - Focus is managed: after a drop the drag handle of the moved row receives focus.
 */

import React, { useEffect, useRef } from 'react';
import { DndContext, DragOverlay, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import DragHandle from '../internal/components/drag-handle';
import { fireNonCancelableEvent } from '../internal/events';
import { TableProps } from './interfaces';
import useRowReorder from './use-row-reorder';

import styles from './styles.css.js';

// Symbol used as drag-handle column id (avoids collisions with user-defined column ids).
export const dragHandleColumnId = Symbol('drag-handle-column');

/** Width of the drag-handle column in pixels. */
export const DRAG_HANDLE_COLUMN_WIDTH = 44;

// ---------------------------------------------------------------------------
// SortableDraggableRow
// ---------------------------------------------------------------------------

interface SortableDraggableRowProps<T> {
  rowId: string;
  item: T;
  isActiveRow: boolean;
  isKeyboardDrag: boolean;
  ariaLabel: string;
  ariaDescribedby?: string;
  onHandleKeyDown: (event: React.KeyboardEvent | Event) => void;
  children: (dragHandleCell: React.ReactNode) => React.ReactNode;
}

/**
 * Wraps a single table row with @dnd-kit's `useSortable` hook.
 * Renders a drag-handle `<td>` as the first cell and passes it to `children`.
 * The row itself becomes the sortable element; the handle is the activation point.
 */
export function SortableDraggableRow<T>({
  rowId,
  isActiveRow,
  isKeyboardDrag,
  ariaLabel,
  ariaDescribedby,
  onHandleKeyDown,
  children,
}: SortableDraggableRowProps<T>) {
  const { isDragging, isSorting, listeners, setNodeRef, transform, attributes } = useSortable({ id: rowId });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
  };

  const dragHandleRef = useRef<HTMLElement>(null);

  // When keyboard drag ends/drops, restore focus to the drag handle.
  const wasDragging = useRef(false);
  useEffect(() => {
    if (wasDragging.current && !isDragging) {
      dragHandleRef.current?.focus();
    }
    wasDragging.current = isDragging;
  }, [isDragging]);

  // Merge dnd-kit listeners with our keyDown handler.
  const handleKeyDown = (event: React.KeyboardEvent) => {
    onHandleKeyDown(event);
    listeners?.onKeyDown?.(event);
  };

  const dragHandleCell = (
    <td
      className={styles['drag-handle-cell']}
      style={{ width: DRAG_HANDLE_COLUMN_WIDTH, minWidth: DRAG_HANDLE_COLUMN_WIDTH }}
      // Prevent the cell from being interactive for screen-reader table navigation —
      // the drag handle button itself carries all the necessary ARIA.
      aria-hidden={undefined}
    >
      <DragHandle
        ref={dragHandleRef}
        ariaLabel={ariaLabel}
        ariaDescribedby={ariaDescribedby}
        active={isDragging}
        disabled={attributes['aria-disabled'] as boolean | undefined}
        triggerMode="controlled"
        controlledShowButtons={isActiveRow && isKeyboardDrag}
        directions={isActiveRow && isKeyboardDrag ? { 'block-start': 'active', 'block-end': 'active' } : undefined}
        {...(attributes['aria-disabled'] ? {} : { ...listeners, onKeyDown: handleKeyDown })}
      />
    </td>
  );

  return (
    <tr
      ref={setNodeRef as React.RefCallback<HTMLTableRowElement>}
      style={isDragging ? {} : style}
      className={isDragging ? styles['row-drag-placeholder'] : isSorting ? styles['row-drag-sorting'] : undefined}
      data-row-drag-active={isDragging || undefined}
    >
      {children(dragHandleCell)}
    </tr>
  );
}

// ---------------------------------------------------------------------------
// TableBodyWithDnd
// ---------------------------------------------------------------------------

export interface TableBodyWithDndProps<T> {
  items: readonly T[];
  trackBy: TableProps.TrackBy<T> | undefined;
  ariaLabels: TableProps.AriaLabels<T> | undefined;
  onRowReorder: TableProps['onRowReorder'];
  children: (
    item: T,
    rowIndex: number,
    opts: {
      /** Wrap your <tr> inside this to get DnD behaviour */
      SortableRow: typeof SortableDraggableRow;
      rowId: string;
      isActiveRow: boolean;
      isKeyboardDrag: boolean;
      activeItemId: UniqueIdentifier | null;
      handleKeyDown: (event: React.KeyboardEvent | Event) => void;
      dragHandleAriaLabel: string;
      dragHandleAriaDescribedby: string | undefined;
    }
  ) => React.ReactNode;
}

function getItemId<T>(item: T, trackBy: TableProps.TrackBy<T> | undefined, index: number): string {
  if (!trackBy) {
    return String(index);
  }
  if (typeof trackBy === 'function') {
    return String(trackBy(item));
  }
  return String((item as any)[trackBy]);
}

/**
 * Wraps the tbody children with a DndContext + SortableContext.
 * Consumers render each row by calling the `children` render-prop, which receives
 * the `SortableRow` wrapper and related props.
 */
export function TableBodyWithDnd<T>({ items, trackBy, ariaLabels, onRowReorder, children }: TableBodyWithDndProps<T>) {
  const itemIds = items.map((item, i) => getItemId(item, trackBy, i));

  // Re-derive getItemId using the real index
  const getIdForItem = (item: T) => {
    const idx = items.indexOf(item);
    return getItemId(item, trackBy, idx);
  };

  const { activeItemId, setActiveItemId, collisionDetection, handleKeyDown, sensors, isKeyboard } = useRowReorder({
    items,
    getItemId: getIdForItem,
  });

  const portalContainerRef = useRef(typeof document !== 'undefined' ? document.createElement('div') : null);
  useEffect(() => {
    const el = portalContainerRef.current;
    if (el && !el.isConnected) {
      document.body.appendChild(el);
    }
    return () => {
      if (el && el.isConnected) {
        document.body.removeChild(el);
      }
    };
  }, []);

  const announcements = {
    onDragStart: ({ active }: any) => {
      const idx = itemIds.indexOf(String(active.id));
      return ariaLabels?.liveAnnouncementDndStarted?.(idx + 1, items.length);
    },
    onDragOver: ({ active, over }: any) => {
      if (!over) {
        return;
      }
      const initIdx = itemIds.indexOf(String(active.id));
      const curIdx = itemIds.indexOf(String(over.id));
      return ariaLabels?.liveAnnouncementDndItemReordered?.(initIdx + 1, curIdx + 1, items.length);
    },
    onDragEnd: ({ active, over }: any) => {
      const initIdx = itemIds.indexOf(String(active.id));
      const finalIdx = over ? itemIds.indexOf(String(over.id)) : initIdx;
      return ariaLabels?.liveAnnouncementDndItemCommitted?.(initIdx + 1, finalIdx + 1, items.length);
    },
    onDragCancel: () => ariaLabels?.liveAnnouncementDndDiscarded,
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{
        announcements,
        restoreFocus: false,
        screenReaderInstructions: ariaLabels?.dragHandleAriaDescription
          ? { draggable: ariaLabels.dragHandleAriaDescription }
          : undefined,
        container: portalContainerRef.current ?? undefined,
      }}
      onDragStart={({ active }) => setActiveItemId(active.id)}
      onDragEnd={event => {
        setActiveItemId(null);
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const oldIndex = itemIds.indexOf(String(active.id));
          const newIndex = itemIds.indexOf(String(over.id));
          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove([...items], oldIndex, newIndex);
            const movedItem = items[oldIndex];
            fireNonCancelableEvent(onRowReorder, { items: reordered, movedItem });
          }
        }
      }}
      onDragCancel={() => setActiveItemId(null)}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {items.map((item, rowIndex) => {
          const rowId = itemIds[rowIndex];
          const isActiveRow = activeItemId === rowId;
          return children(item, rowIndex, {
            SortableRow: SortableDraggableRow,
            rowId,
            isActiveRow,
            isKeyboardDrag: isKeyboard.current,
            activeItemId,
            handleKeyDown,
            dragHandleAriaLabel: ariaLabels?.rowDragLabel?.(item) ?? ariaLabels?.dragHandleAriaLabel ?? 'Drag handle',
            dragHandleAriaDescribedby: undefined,
          });
        })}
      </SortableContext>

      <Portal container={portalContainerRef.current}>
        <DragOverlay dropAnimation={null} style={{ zIndex: 5000 }}>
          {activeItemId &&
            (() => {
              const idx = itemIds.indexOf(String(activeItemId));
              const ghostItem = idx !== -1 ? items[idx] : null;
              if (!ghostItem) {
                return null;
              }
              return (
                <table style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr className={styles['row-drag-ghost']}>
                      <td style={{ width: DRAG_HANDLE_COLUMN_WIDTH, minWidth: DRAG_HANDLE_COLUMN_WIDTH }}>
                        <DragHandle
                          ariaLabel={
                            ariaLabels?.rowDragLabel?.(ghostItem) ?? ariaLabels?.dragHandleAriaLabel ?? 'Drag handle'
                          }
                          active={true}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              );
            })()}
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}
