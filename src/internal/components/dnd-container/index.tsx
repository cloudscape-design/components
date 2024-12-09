// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Portal from '../portal';
import { DndContainerProps, RenderOptionProps } from './interfaces';
import useDragAndDropReorder from './use-drag-and-drop-reorder';
import useLiveAnnouncements from './use-live-announcements';

import styles from './styles.css.js';

export function DndContainer<Option>({
  options,
  getOptionId,
  onReorder,
  disableReorder,
  renderOption,
  renderContent = content => content,
  i18nStrings,
  dragOverlayClassName = styles['drag-overlay'],
}: DndContainerProps<Option>) {
  const { activeItem, collisionDetection, handleKeyDown, sensors, setActiveItem } = useDragAndDropReorder({
    options,
    getOptionId,
  });
  const activeOption = activeItem ? options.find(option => getOptionId(option) === activeItem) : null;
  const isDragging = activeItem !== null;
  const announcements = useLiveAnnouncements({ options, getOptionId, isDragging, ...i18nStrings });
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{
        announcements,
        restoreFocus: false,
        screenReaderInstructions: i18nStrings.dragHandleAriaDescription
          ? { draggable: i18nStrings.dragHandleAriaDescription }
          : undefined,
      }}
      onDragStart={({ active }) => setActiveItem(active.id)}
      onDragEnd={event => {
        setActiveItem(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
          const oldIndex = options.findIndex(option => getOptionId(option) === active.id);
          const newIndex = options.findIndex(option => getOptionId(option) === over.id);
          onReorder(arrayMove([...options], oldIndex, newIndex));
        }
      }}
      onDragCancel={() => setActiveItem(null)}
    >
      {renderContent(
        <SortableContext
          disabled={disableReorder}
          items={options.map(option => getOptionId(option))}
          strategy={verticalListSortingStrategy}
        >
          {options.map(option => (
            <DraggableOption
              key={getOptionId(option)}
              option={option}
              getId={getOptionId}
              renderOption={renderOption}
              onKeyDown={handleKeyDown}
              dragHandleAriaLabel={i18nStrings.dragHandleAriaLabel}
            />
          ))}
        </SortableContext>
      )}

      <Portal>
        {/* Make sure that the drag overlay is above the modal
              by assigning the z-index as inline style
              so that it prevails over dnd-kit's inline z-index of 999  */}
        {/* className is a documented prop of the DragOverlay component:
              https://docs.dndkit.com/api-documentation/draggable/drag-overlay#class-name-and-inline-styles */
        /* eslint-disable-next-line react/forbid-component-props */}
        <DragOverlay className={dragOverlayClassName} dropAnimation={null} style={{ zIndex: 5000 }}>
          {activeOption &&
            renderOption({
              option: activeOption,
              dragHandleAriaLabel: i18nStrings.dragHandleAriaLabel,
              listeners: { onKeyDown: handleKeyDown },
              style: {},
              attributes: {},
              isDragging: true,
              isSorting: false,
              isActive: true,
            })}
        </DragOverlay>
      </Portal>
    </DndContext>
  );
}

function DraggableOption<Option>({
  option,
  getId,
  dragHandleAriaLabel,
  onKeyDown,
  renderOption,
}: {
  option: Option;
  getId: (option: Option) => string;
  dragHandleAriaLabel?: string;
  onKeyDown: (event: React.KeyboardEvent) => void;
  renderOption: (props: RenderOptionProps<Option>) => React.ReactNode;
}) {
  const { isDragging, isSorting, listeners, setNodeRef, transform, attributes } = useSortable({ id: getId(option) });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  const combinedListeners = {
    ...listeners,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
      if (listeners?.onKeyDown) {
        listeners.onKeyDown(event);
      }
    },
  };
  return (
    <>
      {renderOption({
        option,
        dragHandleAriaLabel,
        ref: setNodeRef,
        style,
        isDragging,
        isSorting,
        isActive: false,
        listeners: combinedListeners,
        attributes,
      })}
    </>
  );
}
