// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import InternalSpaceBetween from '../space-between/internal';
import InternalToggle from '../toggle/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { CollectionPreferencesProps } from './interfaces';
import styles from './styles.css.js';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';

// const isVisible = (id: string, visibleIds: ReadonlyArray<string>) => visibleIds.indexOf(id) !== -1;

interface ClassNameProps {
  className: string;
}
const className = (suffix: string): ClassNameProps => ({
  className: styles[`visible-content-${suffix}`],
});

interface VisibleContentPreferenceProps extends CollectionPreferencesProps.VisibleContentPreference {
  onChange: (value: ReadonlyArray<string>) => void;
  value?: ReadonlyArray<string>;
  multiColumnVisibleContent: boolean;
}

function SortableItem({ option }: { option: CollectionPreferencesProps.VisibleContentOption }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...className('option')} style={style}>
      <span {...attributes} {...listeners} {...className('drag-handle')}>
        <InternalIcon name="menu" variant="subtle" />
      </span>
      <label {...className('option-label')}>{option.label}</label>
      <div {...className('toggle')}>
        <InternalToggle
          // checked={isVisible(option.id, value)}
          checked={true}
          // onChange={() => onToggle(option.id)}
          disabled={option.editable === false}
        />
      </div>
    </div>
  );
}

export default function VisibleContentPreference({
  title,
  options,
  multiColumnVisibleContent,
}: /*
  value = [],
   onChange,
  */
VisibleContentPreferenceProps) {
  const idPrefix = useUniqueId('visible-content');

  const flatOptions = options.reduce<Array<CollectionPreferencesProps.VisibleContentOption>>(
    (options, group) => [
      ...options,
      ...group.options.reduce<Array<CollectionPreferencesProps.VisibleContentOption>>(
        (groupOptions, option) => [...groupOptions, option],
        []
      ),
    ],
    []
  );

  const [sortedOptions, setSortedOptions] = useState(flatOptions);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
            <DndContext
              key={optionGroupIndex}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={event => {
                const { active, over } = event;

                if (over && active.id !== over.id) {
                  setSortedOptions(items => {
                    const oldIndex = items.findIndex(option => option.id === active.id);
                    const newIndex = items.findIndex(option => option.id === over.id);

                    return arrayMove(items, oldIndex, newIndex);
                  });
                }
              }}
            >
              <div {...className('group-label')} id={groupLabelId}>
                {optionGroup.label}
              </div>
              <SortableContext items={sortedOptions} strategy={verticalListSortingStrategy}>
                <div className={clsx(multiColumnVisibleContent && styles['multi-columns'])}>
                  {sortedOptions.map(option => (
                    <SortableItem key={option.id} option={option} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          );
        })}
      </InternalSpaceBetween>
    </div>
  );
}
