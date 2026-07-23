// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Hook that manages drag-and-drop row reordering state for the Table component.
 *
 * Key design decisions for rows-with-inputs support:
 * 1. PointerSensor requires a minimum drag distance (distance: 4) so that clicking
 *    into an input field inside a row does not accidentally activate the drag.
 * 2. The drag handle is a dedicated element (not the whole row), so pointer events
 *    on inputs never reach the DnD sensor unless the user explicitly grabs the handle.
 * 3. During an active keyboard drag, focus is kept on the drag-handle button so that
 *    arrow keys route to the DnD sensor rather than the input element they would
 *    normally reach via tab-order.
 * 4. On drag-end / cancel we restore focus to the drag handle of the row that moved,
 *    rather than letting focus fall to the body — which is the standard behaviour when
 *    a dragged element is re-mounted at a new DOM position.
 */

import { useRef, useState } from 'react';
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

import {
  KeyboardAndUAPCoordinateGetter,
  KeyboardAndUAPSensor,
} from '../internal/components/sortable-area/keyboard-sensor';
import { EventName } from '../internal/components/sortable-area/keyboard-sensor/utilities/events';

export interface RowReorderI18nStrings {
  dragHandleAriaLabel?: string;
  dragHandleAriaDescription?: string;
  liveAnnouncementDndStarted?: (position: number, total: number) => string;
  liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
  liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
  liveAnnouncementDndDiscarded?: string;
}

export default function useRowReorder<T>({
  items,
  getItemId,
}: {
  items: readonly T[];
  getItemId: (item: T) => string;
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

  const handleKeyDown = (event: React.KeyboardEvent | Event) => {
    const key = (event as React.KeyboardEvent).key;
    const type = event.type;

    if (isKeyboard.current && activeItemId) {
      const currentTargetIndex = items.findIndex(item => getItemId(item) === activeItemId) + positionDelta.current;
      if ((key === 'ArrowDown' || type === EventName.CustomDown) && currentTargetIndex < items.length - 1) {
        positionDelta.current += 1;
      } else if ((key === 'ArrowUp' || type === EventName.CustomUp) && currentTargetIndex > 0) {
        positionDelta.current -= 1;
      }
    }
    if (activeItemId && isEscape(key)) {
      // Prevent modal / drawer from closing when pressing Esc to cancel drag.
      event.stopPropagation();
    }
  };

  const getClosestId = (active: Active) => {
    if (positionDelta.current === 0) {
      return active.id;
    }
    const currentIndex = items.findIndex(item => getItemId(item) === active.id);
    const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + positionDelta.current));
    return getItemId(items[newIndex]);
  };

  const collisionDetection: CollisionDetection = ({
    active,
    collisionRect,
    droppableContainers,
    droppableRects,
    pointerCoordinates,
  }) => {
    if (isKeyboard.current) {
      const collidingContainer = getCollidingContainer({
        activeId: active.id,
        closestId: getClosestId(active),
        droppableContainers,
      });
      return collidingContainer ? [collidingContainer] : [];
    }
    return closestCenter({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates });
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
      if (newRect && activeDroppable && newDroppable) {
        const isAfterActive = isAfterDroppable(activeDroppable, newDroppable);
        return {
          x: newRect.left - (isAfterActive ? collisionRect.width - newRect.width : 0),
          y: newRect.top - (isAfterActive ? collisionRect.height - newRect.height : 0),
        };
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require a small drag distance so clicks on inputs inside rows are
        // never accidentally treated as drag starts.
        distance: 4,
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
    handleKeyDown,
    sensors,
    isKeyboard,
  };
}

function isAfterDroppable(a: DroppableContainer, b: DroppableContainer) {
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
      data: { droppableContainer: collidingContainer, value: 0 },
    };
  }
}

const isEscape = (key: string | undefined) => key === 'Escape' || key === 'Esc';
