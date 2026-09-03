// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import DragHandle from '../../internal/components/drag-handle';
import { fireNonCancelableEvent } from '../../internal/events';
import InternalLiveRegion from '../../live-region/internal';
import { RowReorderingProps } from './interfaces';

const DRAG_HANDLE_COLUMN_WIDTH = 54;

export { DRAG_HANDLE_COLUMN_WIDTH };

// ─── Sortable row wrapper ────────────────────────────────────────────────────

export interface SortableRowProps {
  id: string;
  children: (props: {
    ref: React.RefCallback<HTMLElement>;
    style: React.CSSProperties;
    isDragging: boolean;
    dragHandleProps: React.ComponentProps<typeof DragHandle>;
  }) => React.ReactElement;
}

export function SortableRow({ id, children }: SortableRowProps) {
  const { setNodeRef, transform, isDragging, listeners, attributes } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : undefined,
  };
  const dragHandleProps: React.ComponentProps<typeof DragHandle> = {
    ...listeners,
    ariaLabel: attributes['aria-roledescription'] ?? '',
    ariaDescribedby: attributes['aria-describedby'],
    disabled: !!attributes['aria-disabled'],
    active: isDragging,
  };
  return children({ ref: setNodeRef, style, isDragging, dragHandleProps });
}

// ─── DnD context wrapper ────────────────────────────────────────────────────

export interface RowReorderingContextProps<T> {
  items: readonly T[];
  getItemId: (item: T) => string;
  rowReordering: RowReorderingProps<T>;
  children: React.ReactNode;
  /** Rendered inside a Portal as the drag overlay (ghost row) */
  renderOverlay?: (item: T) => React.ReactNode;
}

export function RowReorderingContext<T>({
  items,
  getItemId,
  rowReordering,
  children,
  renderOverlay,
}: RowReorderingContextProps<T>) {
  const { onRowReorder, i18nStrings } = rowReordering;
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const initialIndexRef = useRef<number>(-1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const ids = items.map(item => getItemId(item));

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
    const idx = ids.indexOf(active.id as string);
    initialIndexRef.current = idx;
    if (i18nStrings?.liveAnnouncementDndStarted) {
      setAnnouncement(i18nStrings.liveAnnouncementDndStarted(idx + 1, items.length));
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const initialIdx = initialIndexRef.current;
    setActiveId(null);
    if (over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      const movedItem = items[oldIndex];
      const reordered = arrayMove([...items], oldIndex, newIndex);
      if (i18nStrings?.liveAnnouncementDndItemCommitted) {
        setAnnouncement(i18nStrings.liveAnnouncementDndItemCommitted(initialIdx + 1, newIndex + 1, items.length));
      }
      fireNonCancelableEvent(onRowReorder, { items: reordered, movedItem });
    } else {
      if (i18nStrings?.liveAnnouncementDndDiscarded) {
        setAnnouncement(i18nStrings.liveAnnouncementDndDiscarded);
      }
    }
  }

  const activeItem = activeId !== null ? items.find(item => getItemId(item) === activeId) : null;
  const portalContainerRef = useRef(typeof document !== 'undefined' ? document.createElement('div') : null);
  React.useEffect(() => {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      accessibility={{
        announcements: {
          onDragStart: () => announcement,
          onDragOver: () => announcement,
          onDragEnd: () => announcement,
          onDragCancel: () => i18nStrings?.liveAnnouncementDndDiscarded ?? '',
        },
        screenReaderInstructions: i18nStrings?.dragHandleAriaDescription
          ? { draggable: i18nStrings.dragHandleAriaDescription }
          : undefined,
        container: portalContainerRef.current ?? undefined,
        restoreFocus: false,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null);
        if (i18nStrings?.liveAnnouncementDndDiscarded) {
          setAnnouncement(i18nStrings.liveAnnouncementDndDiscarded);
        }
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {announcement && (
        <InternalLiveRegion assertive={false} tagName="span">
          {announcement}
        </InternalLiveRegion>
      )}
      <Portal container={portalContainerRef.current}>
        <DragOverlay dropAnimation={null} style={{ zIndex: 5000 }}>
          {activeItem && renderOverlay ? renderOverlay(activeItem) : null}
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}
