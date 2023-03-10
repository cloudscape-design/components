// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
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

const isVisible = (id: string, visibleIds: ReadonlyArray<string>) => visibleIds.indexOf(id) !== -1;

interface VisibleContentPreferenceProps extends CollectionPreferencesProps.VisibleContentPreference {
  reorderContent?: boolean;
  onChange: (value: { itemOrder?: ReadonlyArray<string>; visibleItems: ReadonlyArray<string> }) => void;
  visibleItems?: ReadonlyArray<string>;
  itemOrder?: ReadonlyArray<string>;
}

export default function VisibleContentPreference({
  title,
  options,
  visibleItems = [],
  itemOrder = getFlatOptionIds(options),
  onChange,
  reorderContent = false,
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDragging && isEscape(event.key)) {
      // Prevent modal from closing when pressing Esc to cancel the dragging action
      event.stopPropagation();
    }
  };

  const outerGroupLabelId = `${idPrefix}-outer`;

  return (
    <div className={styles['visible-content']}>
      <h3 {...className('title')} id={outerGroupLabelId}>
        {title}
      </h3>
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
                <div {...className('group-label')} id={groupLabelId}>
                  {optionGroup.label}
                </div>
                <div onKeyDown={handleKeyDown}>
                  <SortableContext
                    items={getSortedOptions({ options: optionGroup.options, order: itemOrder }).map(({ id }) => id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {getSortedOptions({ options: optionGroup.options, order: itemOrder }).map(option => {
                      const labelId = `${idPrefix}-${optionGroupIndex}-${option.id}`;
                      return (
                        <SortableItem
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
