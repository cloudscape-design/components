// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { joinStrings } from '../../utils/strings';
import Portal from '../portal';
import { DndAreaItem, DndAreaProps, RenderItemProps } from './interfaces';
import useDragAndDropReorder from './use-drag-and-drop-reorder';
import useLiveAnnouncements from './use-live-announcements';

import styles from './styles.css.js';

export function DndArea<Data>({ items, renderItem, onItemsChange, disableReorder, i18nStrings }: DndAreaProps<Data>) {
  const { activeItemId, setActiveItemId, collisionDetection, handleKeyDown, sensors } = useDragAndDropReorder({
    items,
  });
  const activeItem = activeItemId ? items.find(item => item.id === activeItemId) : null;
  const isDragging = activeItemId !== null;
  const announcements = useLiveAnnouncements({ items, isDragging, ...i18nStrings });
  const portalContainer = usePortalContainer();
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{
        announcements,
        restoreFocus: false,
        screenReaderInstructions: i18nStrings.dragHandleAriaDescription
          ? { draggable: i18nStrings.dragHandleAriaDescription }
          : undefined,
        container: portalContainer,
      }}
      onDragStart={({ active }) => setActiveItemId(active.id)}
      onDragEnd={event => {
        setActiveItemId(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          onItemsChange(arrayMove([...items], oldIndex, newIndex));
        }
      }}
      onDragCancel={() => setActiveItemId(null)}
    >
      <SortableContext
        disabled={disableReorder}
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map(item => (
          <DraggableItem
            key={item.id}
            item={item}
            renderItem={renderItem}
            onKeyDown={handleKeyDown}
            dragHandleAriaLabel={i18nStrings.dragHandleAriaLabel}
          />
        ))}
      </SortableContext>

      <Portal container={portalContainer}>
        {/* Make sure that the drag overlay is above the modal  by assigning the z-index as inline style
            so that it prevails over dnd-kit's inline z-index of 999 */}
        <DragOverlay dropAnimation={null} style={{ zIndex: 5000 }}>
          {activeItem &&
            renderItem({
              item: activeItem,
              style: {},
              className: styles.active,
              isDragging: true,
              isSorting: false,
              isActive: true,
              dragHandleProps: {
                ariaLabel: joinStrings(i18nStrings.dragHandleAriaLabel, activeItem.label) ?? '',
                onKeyDown: handleKeyDown,
              },
            })}
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}

function usePortalContainer() {
  const portalContainerRef = useRef(document.createElement('div'));
  useEffect(() => {
    const container = portalContainerRef.current;
    if (!container.isConnected) {
      document.body.appendChild(container);
    }
    return () => {
      if (container.isConnected) {
        document.body.removeChild(container);
      }
    };
  }, []);
  return portalContainerRef.current;
}

function DraggableItem<Data>({
  item,
  dragHandleAriaLabel,
  onKeyDown,
  renderItem,
}: {
  item: DndAreaItem<Data>;
  dragHandleAriaLabel?: string;
  onKeyDown: (event: React.KeyboardEvent) => void;
  renderItem: (props: RenderItemProps<Data>) => React.ReactNode;
}) {
  const { isDragging, isSorting, listeners, setNodeRef, transform, attributes } = useSortable({ id: item.id });
  const style = { transform: CSS.Translate.toString(transform) };
  const dragHandleListeners = attributes['aria-disabled']
    ? {}
    : {
        ...listeners,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (onKeyDown) {
            onKeyDown(event);
          }
          if (listeners?.onKeyDown) {
            listeners.onKeyDown(event);
          }
        },
      };
  const className = clsx(isDragging && styles.placeholder, isSorting && styles.sorting);
  return (
    <>
      {renderItem({
        item,
        ref: setNodeRef,
        style,
        className,
        isDragging,
        isSorting,
        isActive: false,
        dragHandleProps: {
          ...dragHandleListeners,
          ariaLabel: joinStrings(dragHandleAriaLabel, item.label) ?? '',
          ariaDescribedby: attributes['aria-describedby'],
          disabled: attributes['aria-disabled'],
        },
      })}
    </>
  );
}
