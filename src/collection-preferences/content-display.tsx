// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';
import { getSortedOptions } from './reorder-utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { isEscape } from './utils';

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
  const idPrefix = useUniqueId(componentPrefix);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onToggle = (id: string) => {
    onChange(value.map(item => (item.id === id ? { ...item, visible: !isVisible(id, value) } : item)));
  };

  const [isDragging, setIsDragging] = useState(false);
  const isFirstAnnouncement = useRef(true);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDragging && isEscape(event.key)) {
      // Prevent modal from closing when pressing Esc to cancel the dragging action
      event.stopPropagation();
    }
  };

  const outerGroupLabelId = `${idPrefix}-outer`;

  useEffect(() => {
    if (!isDragging) {
      isFirstAnnouncement.current = true;
    }
  }, [isDragging]);

  const sortedOptions = getSortedOptions({ options, order: value });

  return (
    <div className={styles[componentPrefix]}>
      <h3 {...className('title')} id={outerGroupLabelId}>
        {title}
      </h3>
      <p {...className('label')}>{label}</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
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
                const finalIndex = options.findIndex(option => option.id === over.id);
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
      >
        <div onKeyDown={handleKeyDown} {...className('group-list')}>
          <SortableContext items={sortedOptions.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
            {sortedOptions.map(option => {
              const labelId = `${idPrefix}-${option.id}`;
              return (
                <SortableItem
                  dragHandleAriaLabel={dragHandleAriaLabel}
                  key={option.id}
                  labelId={labelId}
                  isVisible={isVisible(option.id, value)}
                  onToggle={onToggle}
                  option={option}
                  reorderContent={true}
                />
              );
            })}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
