// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import {
  Active,
  closestCenter,
  CollisionDetection,
  DroppableContainer,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { hasSortableData } from '@dnd-kit/sortable';

import { SortableAreaProps } from './interfaces';
import { KeyboardAndUAPCoordinateGetter, KeyboardAndUAPSensor } from './keyboard-sensor';
import { EventName } from './keyboard-sensor/utilities/events';

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

export default function useDragAndDropReorder<Item>({
  items,
  itemDefinition,
}: {
  items: readonly Item[];
  itemDefinition: SortableAreaProps.ItemDefinition<Item>;
}) {
  const isKeyboard = useRef(false);
  const positionDelta = useRef(0);
  const [activeItemId, setActiveItemId] = useState<UniqueIdentifier | null>(null);

  const setActiveItem = (id: UniqueIdentifier | null) => {
    setActiveItemId(id);
    if (!id) {
      isKeyboard.current = false;
      positionDelta.current = 0;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isKeyboard.current && activeItemId) {
      const currentTargetIndex =
        items.findIndex(item => itemDefinition.id(item) === activeItemId) + positionDelta.current;
      if ((event.key === 'ArrowDown' || event.type === EventName.CustomDown) && currentTargetIndex < items.length - 1) {
        positionDelta.current += 1;
      } else if ((event.key === 'ArrowUp' || event.type === EventName.CustomUp) && currentTargetIndex > 0) {
        positionDelta.current -= 1;
      }
    }
    if (activeItemId && isEscape(event.key)) {
      // Prevent modal from closing when pressing Esc to cancel the dragging action
      event.stopPropagation();
    }
  };

  const getClosestId = (active: Active) => {
    if (positionDelta.current === 0) {
      return active.id;
    }
    const currentIndex = items.findIndex(item => itemDefinition.id(item) === active.id);
    const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + positionDelta.current));
    return itemDefinition.id(items[newIndex]);
  };

  const collisionDetection: CollisionDetection = ({
    active,
    collisionRect,
    droppableContainers,
    droppableRects,
    pointerCoordinates,
  }) => {
    if (isKeyboard.current) {
      // For keyboard interaction, determine the colliding container based on the movements made by the arrow keys,
      // via getClosestId
      const collidingContainer = getCollidingContainer({
        activeId: active.id,
        closestId: getClosestId(active),
        droppableContainers,
      });
      return collidingContainer ? [collidingContainer] : [];
    } else {
      // For mouse interaction, use the closest center algorithm
      return closestCenter({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates });
    }
  };

  const coordinateGetter: KeyboardAndUAPCoordinateGetter = (
    event,
    { context: { active, collisionRect, droppableRects, droppableContainers } }
  ) => {
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
        const isAfterActive = isAfter(activeDroppable, newDroppable);
        const offset = {
          x: isAfterActive ? collisionRect.width - newRect.width : 0,
          y: isAfterActive ? collisionRect.height - newRect.height : 0,
        };
        const rectCoordinates = {
          x: newRect.left,
          y: newRect.top,
        };

        return {
          x: rectCoordinates.x - offset.x,
          y: rectCoordinates.y - offset.y,
        };
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // allow KeyboardSensor (click to display UAP) to take priority
        // if handle is clicked without movement
        distance: 1,
      },
    }),
    useSensor(KeyboardAndUAPSensor, {
      coordinateGetter,
      onActivation: () => {
        isKeyboard.current = true;
      },
    })
  );

  return {
    activeItemId,
    setActiveItemId: setActiveItem,
    collisionDetection,
    coordinateGetter,
    handleKeyDown,
    sensors,
    isKeyboard,
  };
}

function isAfter(a: DroppableContainer, b: DroppableContainer) {
  return hasSortableData(a) && hasSortableData(b) && a.data.current.sortable.index < b.data.current.sortable.index;
}

function getCollidingContainer({
  activeId,
  closestId,
  droppableContainers,
}: {
  activeId: UniqueIdentifier;
  closestId: UniqueIdentifier;
  droppableContainers: DroppableContainer[];
}) {
  if (closestId === activeId) {
    return;
  }
  const collidingContainer = droppableContainers.find(({ id }) => id === closestId);
  if (collidingContainer) {
    return {
      id: collidingContainer.id,
      data: {
        droppableContainer: collidingContainer,
        value: 0,
      },
    };
  }
}

const isEscape = (key: string) => key === 'Escape' || key === 'Esc';
