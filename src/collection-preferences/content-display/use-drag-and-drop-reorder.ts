// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import { isEscape } from '../utils';
import {
  Active,
  closestCenter,
  CollisionDetection,
  DroppableContainer,
  getScrollableAncestors,
  KeyboardCoordinateGetter,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CollectionPreferencesProps } from '../interfaces';
import { hasSortableData } from '@dnd-kit/sortable';
import { KeyboardSensor } from './keyboard-sensor';

enum KeyboardCode {
  Space = 'Space',
  Down = 'ArrowDown',
  Right = 'ArrowRight',
  Left = 'ArrowLeft',
  Up = 'ArrowUp',
  Esc = 'Escape',
  Enter = 'Enter',
}

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

// We let our collisionDetection and customCoordinateGetter use the same
// getClosestId function which takes its value from the current component
// state, to make sure they are always in sync.

export default function useDragAndDropReorder({
  sortedOptions,
}: {
  sortedOptions: ReadonlyArray<CollectionPreferencesProps.VisibleContentOption>;
}) {
  const isKeyboard = useRef(false);
  const positionDelta = useRef(0);
  const [activeItem, setActiveItem] = useState<UniqueIdentifier | null>(null);

  if (!activeItem) {
    isKeyboard.current = false;
    positionDelta.current = 0;
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isKeyboard.current && activeItem) {
      const currentTargetIndex = sortedOptions.findIndex(({ id }) => id === activeItem) + positionDelta.current;
      if (event.key === 'ArrowDown' && currentTargetIndex < sortedOptions.length - 1) {
        positionDelta.current += 1;
      } else if (event.key === 'ArrowUp' && currentTargetIndex > 0) {
        positionDelta.current -= 1;
      }
    }
    if (activeItem && isEscape(event.key)) {
      // Prevent modal from closing when pressing Esc to cancel the dragging action
      event.stopPropagation();
    }
  };

  const getClosestId = (active: Active) => {
    if (positionDelta.current === 0) {
      return active.id;
    }
    const currentIndex = sortedOptions.findIndex(({ id }) => id === active.id);
    const newIndex = Math.max(0, Math.min(sortedOptions.length - 1, currentIndex + positionDelta.current));
    return sortedOptions[newIndex].id;
  };

  const collisionDetection: CollisionDetection = ({
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

  const coordinateGetter: KeyboardCoordinateGetter = (
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
      coordinateGetter,
      onActivation: () => {
        isKeyboard.current = true;
      },
    })
  );

  return {
    activeItem,
    collisionDetection,
    coordinateGetter,
    handleKeyDown,
    isKeyboard: isKeyboard.current,
    sensors,
    setActiveItem,
  };
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

const subtract = createAdjustmentFn(-1);
