// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from '../interfaces';
import styles from '../styles.css.js';
import { getSortedOptions } from './reorder-utils';
import {
  Active,
  closestCenter,
  CollisionDetection,
  DndContext,
  DroppableContainer,
  getScrollableAncestors,
  KeyboardCoordinateGetter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, hasSortableData, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { isEscape } from '../utils';
import { KeyboardSensor } from './keyboard-sensor';

const componentPrefix = 'content-display';

const isVisible = (id: string, contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplay>) =>
  !!contentDisplay.find(item => item.id === id)?.visible;

const className = (suffix: string) => ({
  className: styles[`${componentPrefix}-${suffix}`],
});

interface ContentDisplayPreferenceProps extends CollectionPreferencesProps.ContentDisplayPreference {
  onChange: (value: ReadonlyArray<CollectionPreferencesProps.ContentDisplay>) => void;
  value?: ReadonlyArray<CollectionPreferencesProps.ContentDisplay>;
}

enum KeyboardCode {
  Space = 'Space',
  Down = 'ArrowDown',
  Right = 'ArrowRight',
  Left = 'ArrowLeft',
  Up = 'ArrowUp',
  Esc = 'Escape',
  Enter = 'Enter',
}

export default function ContentDisplayPreference({
  title,
  label,
  options,
  value = options.map(({ id }) => ({
    id,
    visible: true,
  })),
  onChange,
  liveAnnouncementDndStarted,
  liveAnnouncementDndItemReordered,
  liveAnnouncementDndItemCommitted,
  liveAnnouncementDndDiscarded,
  dragHandleAriaDescription,
  dragHandleAriaLabel,
}: ContentDisplayPreferenceProps) {
  const isKeyboard = useRef(false);
  const positionDelta = useRef(0);
  const keyboardDirection = useRef<'up' | 'down' | null>(null);

  const idPrefix = useUniqueId(componentPrefix);
  const onToggle = (id: string) => {
    onChange(value.map(item => (item.id === id ? { ...item, visible: !isVisible(id, value) } : item)));
  };

  const [isDragging, setIsDragging] = useState(false);
  const isFirstAnnouncement = useRef(true);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isKeyboard.current) {
      // We can't use onDragMove for this because that function gets triggered also on window scroll.
      if (event.key === 'ArrowDown') {
        keyboardDirection.current = 'down';
      }
      if (event.key === 'ArrowUp') {
        keyboardDirection.current = 'up';
      }
      positionDelta.current += keyboardDirection.current === 'up' ? -1 : keyboardDirection.current === 'down' ? 1 : 0;
      keyboardDirection.current = null;
    }
    if (isDragging && isEscape(event.key)) {
      // Prevent modal from closing when pressing Esc to cancel the dragging action
      event.stopPropagation();
    }
  };

  const labelId = `${idPrefix}-label`;

  if (!isDragging) {
    isFirstAnnouncement.current = true;
    isKeyboard.current = false;
    positionDelta.current = 0;
  }

  const sortedOptions = getSortedOptions({ options, order: value });

  const getClosestId = (active: Active) => {
    if (positionDelta.current === 0) {
      return active.id;
    }
    const currentIndex = sortedOptions.findIndex(({ id }) => id === active.id);
    const newIndex = Math.max(0, Math.min(sortedOptions.length - 1, currentIndex + positionDelta.current));
    return sortedOptions[newIndex].id;
  };

  // A custom collision detection algorithm is used when using a keyboard to
  // work around an unexpected behavior when reordering items of variable height
  // with the keyboard.

  // Neither closestCenter nor closestCorners work really well for this case,
  // because the center (or corners) of a tall rectangle might be so low that it
  // is detected as being closest to the rectangle below of the one it should
  // actually swap with.

  // Instead of relying on coordinates, the expected results are achieved by
  // moving X positions up or down in the initially sorted array, depending on
  // the desired direction.

  // We let customCollisionDetection and customCoordinateGetter use the same
  // getClosestId function which takes its value from the current component
  // state, to make sure they are always in sync.
  const customCollisionDetection: CollisionDetection = ({
    active,
    collisionRect,
    droppableContainers,
    droppableRects,
    pointerCoordinates,
  }) => {
    if (isKeyboard.current) {
      const collidingContainerId = getClosestId(active);
      if (collidingContainerId !== active.id) {
        const collidingContainer = droppableContainers.find(({ id }) => id === collidingContainerId);
        if (collidingContainer) {
          return [
            {
              id: collidingContainer.id,
              data: {
                droppableContainer: collidingContainer,
                value: 0,
              },
            },
          ];
        }
      }
      return [];
    } else {
      return closestCenter({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates });
    }
  };

  const customCoordinateGetter: KeyboardCoordinateGetter = (
    event,
    { context: { active, collisionRect, droppableRects, droppableContainers, scrollableAncestors } }
  ) => {
    if (event.code === KeyboardCode.Up || event.code === KeyboardCode.Down) {
      event.preventDefault();

      if (!active || !collisionRect) {
        return;
      }

      const closestId = getClosestId(active);

      if (closestId !== null) {
        const activeDroppable = droppableContainers.get(active.id);
        const newDroppable = droppableContainers.get(closestId);
        const newRect = newDroppable ? droppableRects.get(newDroppable.id) : null;
        const newNode = newDroppable?.node.current;

        if (newNode && newRect && activeDroppable && newDroppable) {
          const newScrollAncestors = getScrollableAncestors(newNode);
          const hasDifferentScrollAncestors = newScrollAncestors.some(
            (element, index) => scrollableAncestors[index] !== element
          );
          const hasSameContainer = isSameContainer(activeDroppable, newDroppable);
          const isAfterActive = isAfter(activeDroppable, newDroppable);
          const offset =
            hasDifferentScrollAncestors || !hasSameContainer
              ? {
                  x: 0,
                  y: 0,
                }
              : {
                  x: isAfterActive ? collisionRect.width - newRect.width : 0,
                  y: isAfterActive ? collisionRect.height - newRect.height : 0,
                };
          const rectCoordinates = {
            x: newRect.left,
            y: newRect.top,
          };

          return offset.x && offset.y ? rectCoordinates : subtract(rectCoordinates, offset);
        }
      }
    }

    return undefined;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: customCoordinateGetter,
      keyboardCodes: {
        start: ['Space', 'Enter'],
        // Cancel reordering when pressing Escape but also when losing focus
        cancel: ['Escape', 'Tab'],
        end: ['Space', 'Enter'],
      },
      onActivation: () => {
        isKeyboard.current = true;
      },
    })
  );

  return (
    <div className={styles[componentPrefix]}>
      <h3 {...className('title')}>{title}</h3>
      <p {...className('label')} id={labelId}>
        {label}
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        accessibility={{
          announcements: {
            onDragStart({ active }) {
              if (active && liveAnnouncementDndStarted) {
                const index = sortedOptions.findIndex(option => option.id === active.id);
                return liveAnnouncementDndStarted(index + 1, options.length);
              }
            },
            onDragOver({ active, over }) {
              if (liveAnnouncementDndItemReordered) {
                // Don't announce on the first dragOver because it's redundant with onDragStart.
                if (isFirstAnnouncement.current) {
                  isFirstAnnouncement.current = false;
                  if (!over || over.id === active.id) {
                    return;
                  }
                }
                const initialIndex = sortedOptions.findIndex(option => option.id === active.id);
                const currentIdex = over ? sortedOptions.findIndex(option => option.id === over.id) : initialIndex;
                return liveAnnouncementDndItemReordered(initialIndex + 1, currentIdex + 1, options.length);
              }
            },
            onDragEnd({ active, over }) {
              if (liveAnnouncementDndItemCommitted) {
                const initialIndex = sortedOptions.findIndex(option => option.id === active.id);
                const finalIndex = over ? sortedOptions.findIndex(option => option.id === over.id) : initialIndex;
                return liveAnnouncementDndItemCommitted(initialIndex + 1, finalIndex + 1, options.length);
              }
            },
            onDragCancel() {
              return liveAnnouncementDndDiscarded;
            },
          },
          screenReaderInstructions: dragHandleAriaDescription ? { draggable: dragHandleAriaDescription } : undefined,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={event => {
          setIsDragging(false);
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = value.findIndex(({ id }) => id === active.id);
            const newIndex = value.findIndex(({ id }) => id === over.id);
            onChange(arrayMove([...value], oldIndex, newIndex));
          }
        }}
        onDragCancel={() => setIsDragging(false)}
      >
        <ul {...className('option-list')} aria-describedby={labelId}>
          <SortableContext items={sortedOptions.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
            {sortedOptions.map(option => {
              return (
                <SortableItem
                  dragHandleAriaLabel={dragHandleAriaLabel}
                  key={option.id}
                  idPrefix={idPrefix}
                  isKeyboard={isKeyboard.current}
                  isVisible={isVisible(option.id, value)}
                  onKeyDown={handleKeyDown}
                  onToggle={onToggle}
                  option={option}
                />
              );
            })}
          </SortableContext>
        </ul>
      </DndContext>
    </div>
  );
}

function isSameContainer(a: DroppableContainer, b: DroppableContainer) {
  if (!hasSortableData(a) || !hasSortableData(b)) {
    return false;
  }

  return a.data.current.sortable.containerId === b.data.current.sortable.containerId;
}

function isAfter(a: DroppableContainer, b: DroppableContainer) {
  if (!hasSortableData(a) || !hasSortableData(b)) {
    return false;
  }

  if (!isSameContainer(a, b)) {
    return false;
  }

  return a.data.current.sortable.index < b.data.current.sortable.index;
}

function createAdjustmentFn(modifier: number) {
  return <T extends Record<U, number>, U extends string>(object: T, ...adjustments: Partial<T>[]): T => {
    return adjustments.reduce<T>(
      (accumulator, adjustment) => {
        for (const key of Object.keys(adjustment)) {
          const value = accumulator[key as U];
          const valueAdjustment = adjustment[key as U];

          if (value !== null && valueAdjustment !== undefined) {
            accumulator[key as U] = (value + modifier * valueAdjustment) as T[U];
          }
        }

        return accumulator;
      },
      {
        ...object,
      }
    );
  };
}

export const add = createAdjustmentFn(1);
export const subtract = createAdjustmentFn(-1);
