// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';
import { getSortedOptions } from './reorder-utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  CollisionDetection,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { isEscape } from './utils';
import ScreenreaderOnly from '../internal/components/screenreader-only';

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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      onActivation: () => {
        isKeyboard.current = true;
      },
    })
  );

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
    }
    if (isDragging && isEscape(event.key)) {
      // Prevent modal from closing when pressing Esc to cancel the dragging action
      event.stopPropagation();
    }
  };

  const labelId = `${idPrefix}-label`;

  useEffect(() => {
    if (!isDragging) {
      isFirstAnnouncement.current = true;
      isKeyboard.current = false;
      positionDelta.current = 0;
    }
  }, [isDragging]);

  const sortedOptions = getSortedOptions({ options, order: value });
  const dragHandleAriaLabelId = `${idPrefix}-drag-handle-aria-label`;

  // A custom collision detection algorithm is used when using a keyboard to
  // work around an unexpected behavior when reordering items of variable height
  // with the keyboard.

  // Neither closestCenter nor closestCorners work really well for this case,
  // because the center (or corners) of a tall rectangle might be so low that it
  // is detected as being closest to the rectangle below of the one it should
  // actually swap with.

  // Instead of relying on coordinates, the expected results are achieved by
  // moving X positions up or down in the initially sorted array, depending on
  // the desired direction. This is actually what the
  // sortableKeyboardCoordinates coordinateGetter already does correctly as
  // well.

  // Because a pure CollisionDetection function would have no way to know
  // whether we are moving up and down just from its arguments, we can't move
  // this one outside the component.
  const customCollisionDetection: CollisionDetection = ({
    active,
    collisionRect,
    droppableContainers,
    droppableRects,
    pointerCoordinates,
  }) => {
    if (isKeyboard.current) {
      positionDelta.current += keyboardDirection.current === 'up' ? -1 : keyboardDirection.current === 'down' ? 1 : 0;
      keyboardDirection.current = null;
      if (positionDelta.current === 0) {
        // Back at initial position, no need to check for colliding items to swap with
        return [];
      }
      const currentIndex = sortedOptions.findIndex(({ id }) => id === active.id);
      const newIndex = Math.max(0, Math.min(sortedOptions.length - 1, currentIndex + positionDelta.current));
      const collidingContainerId = sortedOptions[newIndex].id;
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
      } else {
        return [];
      }
    } else {
      return closestCenter({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates });
    }
  };

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
            onDragOver({ over }) {
              // Don't announce on the first dragOver because it's redundant with onDragStart.
              if (isFirstAnnouncement.current) {
                isFirstAnnouncement.current = false;
                return;
              }

              if (over && liveAnnouncementDndItemReordered) {
                const finalIndex = sortedOptions.findIndex(option => option.id === over.id);
                return liveAnnouncementDndItemReordered(finalIndex + 1, options.length);
              }
            },
            onDragEnd({ active, over }) {
              if (over && liveAnnouncementDndItemCommitted) {
                const initialIndex = sortedOptions.findIndex(option => option.id === active.id);
                const finalIndex = sortedOptions.findIndex(option => option.id === over.id);
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
        <div onKeyDown={handleKeyDown} {...className('group-list')} aria-describedby={labelId}>
          <SortableContext items={sortedOptions.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
            {sortedOptions.map(option => {
              return (
                <SortableItem
                  dragHandleAriaLabelId={dragHandleAriaLabelId}
                  key={option.id}
                  idPrefix={idPrefix}
                  isVisible={isVisible(option.id, value)}
                  onToggle={onToggle}
                  option={option}
                />
              );
            })}
          </SortableContext>
        </div>
      </DndContext>
      <ScreenreaderOnly id={dragHandleAriaLabelId}>{dragHandleAriaLabel}</ScreenreaderOnly>
    </div>
  );
}
