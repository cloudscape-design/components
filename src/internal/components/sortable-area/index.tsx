// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent } from '../../events';
import { joinStrings } from '../../utils/strings';
import { SortableAreaProps } from './interfaces';
import { EventName } from './keyboard-sensor/utilities/events';
import useDragAndDropReorder from './use-drag-and-drop-reorder';
import useLiveAnnouncements from './use-live-announcements';

import styles from './styles.css.js';

export { SortableAreaProps };

export default function SortableArea<Item>({
  items,
  itemDefinition,
  renderItem,
  onItemsChange,
  disableReorder,
  lockedItemsCount = 0,
  i18nStrings,
}: SortableAreaProps<Item>) {
  const { activeItemId, setActiveItemId, collisionDetection, handleKeyDown, sensors, isKeyboard } =
    useDragAndDropReorder({
      items,
      itemDefinition,
    });
  const activeItem = activeItemId ? items.find(item => itemDefinition.id(item) === activeItemId) : null;
  const isDragging = activeItemId !== null;
  const announcements = useLiveAnnouncements({ items, itemDefinition, isDragging, ...i18nStrings });
  const portalContainer = usePortalContainer();

  const effectiveLockedCount = Math.max(0, Math.min(lockedItemsCount, items.length));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{
        announcements,
        restoreFocus: false,
        screenReaderInstructions: i18nStrings?.dragHandleAriaDescription
          ? { draggable: i18nStrings.dragHandleAriaDescription }
          : undefined,
        container: portalContainer ?? undefined,
      }}
      onDragStart={({ active }) => setActiveItemId(active.id)}
      onDragEnd={event => {
        setActiveItemId(null);
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const movedItem = items.find(item => itemDefinition.id(item) === active.id)!;
          const oldIndex = items.findIndex(item => itemDefinition.id(item) === active.id);
          const newIndex = items.findIndex(item => itemDefinition.id(item) === over.id);
          // Clamp: non-locked items cannot be dropped into the locked zone (index < effectiveLockedCount).
          const clampedNewIndex = Math.max(newIndex, effectiveLockedCount);
          if (oldIndex !== clampedNewIndex) {
            fireNonCancelableEvent(onItemsChange, {
              items: arrayMove([...items], oldIndex, clampedNewIndex),
              movedItem,
            });
          }
        }
      }}
      onDragCancel={() => setActiveItemId(null)}
    >
      <SortableContext
        disabled={disableReorder}
        items={items.map(item => itemDefinition.id(item))}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <DraggableItem
            key={itemDefinition.id(item)}
            item={item}
            itemDefinition={itemDefinition}
            showDirectionButtons={item === activeItem && isKeyboard.current}
            renderItem={renderItem}
            onKeyDown={handleKeyDown}
            dragHandleAriaLabel={i18nStrings?.dragHandleAriaLabel}
            locked={index < effectiveLockedCount}
          />
        ))}
      </SortableContext>

      <Portal container={portalContainer}>
        {/* Make sure that the drag overlay is above the modal  by assigning the z-index as inline style
            so that it prevails over dnd-kit's inline z-index of 999 */}
        <DragOverlay
          className={clsx(styles['drag-overlay'], styles[`drag-overlay-${getBorderRadiusVariant(itemDefinition)}`])}
          dropAnimation={null}
          style={{ zIndex: 5000 }}
          transition={isKeyboard.current ? 'transform 250ms' : ''}
        >
          {activeItem &&
            renderItem({
              item: activeItem,
              id: activeItemId!.toString(),
              style: {},
              className: styles.active,
              isDropPlaceholder: true,
              isSortingActive: false,
              isDragGhost: true,
              dragHandleProps: {
                ariaLabel: joinStrings(i18nStrings?.dragHandleAriaLabel, itemDefinition.label(activeItem)) ?? '',
                active: true,
                onKeyDown: handleKeyDown,
              },
            })}
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}

function usePortalContainer() {
  const portalContainerRef = useRef(typeof document !== 'undefined' ? document.createElement('div') : null);
  useEffect(() => {
    const container = portalContainerRef.current;
    if (container && !container.isConnected) {
      document.body.appendChild(container);
    }
    return () => {
      if (container && container.isConnected) {
        document.body.removeChild(container);
      }
    };
  }, []);
  return portalContainerRef.current;
}

function DraggableItem<Item>({
  item,
  itemDefinition,
  dragHandleAriaLabel,
  showDirectionButtons,
  onKeyDown,
  renderItem,
  locked = false,
}: {
  item: Item;
  itemDefinition: SortableAreaProps.ItemDefinition<Item>;
  dragHandleAriaLabel?: string;
  showDirectionButtons: boolean;
  onKeyDown: (event: React.KeyboardEvent) => void;
  renderItem: (props: SortableAreaProps.RenderItemProps<Item>) => React.ReactNode;
  locked?: boolean;
}) {
  const id = itemDefinition.id(item);
  const { isDragging, isSorting, listeners, setNodeRef, transform, attributes } = useSortable({
    id,
    disabled: locked || undefined,
  });
  const style = { transform: CSS.Translate.toString(transform) };
  const isDisabled = locked || !!attributes['aria-disabled'];
  const dragHandleListeners = isDisabled
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
  const className = clsx(
    isDragging && clsx(styles.placeholder, styles[`placeholder-${getBorderRadiusVariant(itemDefinition)}`]),
    isSorting && styles.sorting
  );
  const dragHandleRef = useRef<HTMLElement>(null);
  return (
    <>
      {renderItem({
        item,
        id,
        ref: setNodeRef,
        style,
        className,
        isDropPlaceholder: isDragging,
        isSortingActive: isSorting,
        isDragGhost: false,
        dragHandleProps: {
          ...dragHandleListeners,
          active: isDragging,
          ariaLabel: joinStrings(dragHandleAriaLabel, itemDefinition.label(item)) ?? '',
          ariaDescribedby: attributes['aria-describedby'],
          disabled: isDisabled,
          triggerMode: 'controlled',
          controlledShowButtons: showDirectionButtons,
          ref: dragHandleRef,
          directions: showDirectionButtons
            ? {
                'block-start': 'active',
                'block-end': 'active',
              }
            : undefined,
          onDirectionClick: direction => {
            const event = new Event(direction === 'block-start' ? EventName.CustomUp : EventName.CustomDown, {
              bubbles: true,
              cancelable: true,
            });
            onKeyDown(event as any);
            dragHandleRef.current?.dispatchEvent(event);
          },
        },
      })}
    </>
  );
}

export function getBorderRadiusVariant(
  itemDefinition: SortableAreaProps.ItemDefinition<any>
): SortableAreaProps.BorderRadiusVariant {
  return itemDefinition.borderRadius ?? 'item';
}
