// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import InternalSpaceBetween from '../space-between/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';
import { getFlatOptionIds, getSortedOptions } from './reorder-utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { className, isEscape } from './utils';
import clsx from 'clsx';

const isVisible = (id: string, visibleIds: ReadonlyArray<string>) => visibleIds.indexOf(id) !== -1;

interface VisibleContentPreferenceProps extends CollectionPreferencesProps.VisibleContentPreference {
  reorderContent?: boolean;
  onChange: (value: { itemOrder?: ReadonlyArray<string>; visibleItems: ReadonlyArray<string> }) => void;
  visibleItems?: ReadonlyArray<string>;
  itemOrder?: ReadonlyArray<string>;
}

export default function VisibleContentPreference({
  title,
  description,
  options,
  visibleItems = [],
  itemOrder = getFlatOptionIds(options),
  onChange,
  reorderContent = false,
  i18nStrings,
}: VisibleContentPreferenceProps) {
  const idPrefix = useUniqueId('visible-content');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const flatOptionsIds = getFlatOptionIds(options);

  const onToggle = (id: string) => {
    const order = reorderContent ? itemOrder : undefined;
    if (!isVisible(id, visibleItems)) {
      onChange({
        itemOrder: order,
        visibleItems: [...visibleItems, id].sort(
          (firstId, secondId) => flatOptionsIds.indexOf(firstId) - flatOptionsIds.indexOf(secondId)
        ),
      });
    } else {
      onChange({ itemOrder: order, visibleItems: visibleItems.filter(currentId => currentId !== id) });
    }
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

  return (
    <div className={styles['visible-content']}>
      <h3
        className={clsx(className('title').className, description && styles['has-description'])}
        id={outerGroupLabelId}
      >
        {title}
      </h3>
      {description && <p {...className('description')}>{description}</p>}
      <InternalSpaceBetween {...className('groups')} size="xs">
        {options.map((optionGroup, optionGroupIndex) => {
          const groupLabelId = `${idPrefix}-${optionGroupIndex}`;
          return (
            <div
              key={optionGroupIndex}
              {...className('group')}
              role="group"
              aria-labelledby={`${outerGroupLabelId} ${groupLabelId}`}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                accessibility={{
                  announcements: {
                    onDragStart({ active }) {
                      if (active && i18nStrings?.liveAnnouncementDndStarted) {
                        const index = getSortedOptions({ options: optionGroup.options, order: itemOrder }).findIndex(
                          option => option.id === active.id
                        );
                        return i18nStrings.liveAnnouncementDndStarted(index + 1, optionGroup.options.length);
                      }
                    },
                    onDragOver({ over }) {
                      // Don't announce on the first dragOver because it's redundant with onDragStart.
                      if (isFirstAnnouncement.current) {
                        isFirstAnnouncement.current = false;
                        return;
                      }

                      if (over && i18nStrings?.liveAnnouncementDndItemReordered) {
                        const sortedOptions = getSortedOptions({
                          options: optionGroup.options,
                          order: itemOrder,
                        });
                        const finalIndex = sortedOptions.findIndex(option => option.id === over.id);
                        return i18nStrings.liveAnnouncementDndItemReordered(finalIndex + 1, optionGroup.options.length);
                      }
                    },
                    onDragEnd({ active, over }) {
                      if (over && i18nStrings?.liveAnnouncementDndItemCommitted) {
                        const initialIndex = getSortedOptions({
                          options: optionGroup.options,
                          order: itemOrder,
                        }).findIndex(option => option.id === active.id);
                        const finalIndex = optionGroup.options.findIndex(option => option.id === over.id);
                        return i18nStrings.liveAnnouncementDndItemCommitted(
                          initialIndex + 1,
                          finalIndex + 1,
                          optionGroup.options.length
                        );
                      }
                    },
                    onDragCancel() {
                      return i18nStrings ? i18nStrings.liveAnnouncementDndDiscarded : undefined;
                    },
                  },
                  screenReaderInstructions: i18nStrings?.dragHandleAriaDescription
                    ? { draggable: i18nStrings?.dragHandleAriaDescription }
                    : undefined,
                }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={event => {
                  setIsDragging(false);
                  const { active, over } = event;

                  if (over && active.id !== over.id) {
                    const oldIndex = itemOrder.findIndex(id => id === active.id);
                    const newIndex = itemOrder.findIndex(id => id === over.id);
                    onChange({ visibleItems, itemOrder: arrayMove([...itemOrder], oldIndex, newIndex) });
                  }
                }}
              >
                {!reorderContent && options.length > 1 && (
                  <div {...className('group-label')} id={groupLabelId}>
                    {optionGroup.label}
                  </div>
                )}
                <div onKeyDown={handleKeyDown} {...className('group-list')}>
                  <SortableContext
                    items={getSortedOptions({ options: optionGroup.options, order: itemOrder }).map(({ id }) => id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {getSortedOptions({ options: optionGroup.options, order: itemOrder }).map(option => {
                      const labelId = `${idPrefix}-${optionGroupIndex}-${option.id}`;
                      return (
                        <SortableItem
                          dragHandleAriaLabel={i18nStrings?.dragHandleAriaLabel}
                          key={option.id}
                          labelId={labelId}
                          isVisible={isVisible(option.id, visibleItems)}
                          onToggle={onToggle}
                          option={option}
                          reorderContent={reorderContent}
                        />
                      );
                    })}
                  </SortableContext>
                </div>
              </DndContext>
            </div>
          );
        })}
      </InternalSpaceBetween>
    </div>
  );
}
