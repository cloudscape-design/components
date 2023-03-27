// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useUniqueId } from '../../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from '../interfaces';
import styles from '../styles.css.js';
import { getSortedOptions } from './reorder-utils';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import useReordering from './use-drag-and-drop-reorder';
import useLiveAnnouncements from './use-live-announcements';

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
  const onToggle = (id: string) => {
    onChange(value.map(item => (item.id === id ? { ...item, visible: !isVisible(id, value) } : item)));
  };

  const labelId = `${idPrefix}-label`;

  const sortedOptions = getSortedOptions({ options, order: value });

  const { collisionDetection, handleKeyDown, isDragging, isKeyboard, sensors, setIsDragging } = useReordering({
    sortedOptions,
  });

  const announcements = useLiveAnnouncements({
    isDragging,
    liveAnnouncementDndStarted,
    liveAnnouncementDndItemReordered,
    liveAnnouncementDndItemCommitted,
    liveAnnouncementDndDiscarded,
    sortedOptions,
  });

  return (
    <div className={styles[componentPrefix]}>
      <h3 {...className('title')}>{title}</h3>
      <p {...className('label')} id={labelId}>
        {label}
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        accessibility={{
          announcements,
          restoreFocus: false,
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
                  isKeyboard={isKeyboard}
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
