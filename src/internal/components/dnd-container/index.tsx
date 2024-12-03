// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DndContext, DraggableAttributes, DragOverlay } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Portal from '../portal';
import { ReorderAnnouncements, ReorderOptions } from './interfaces';
import useDragAndDropReorder from './use-drag-and-drop-reorder';
import useLiveAnnouncements from './use-live-announcements';

import styles from './styles.css.js';

export interface DndContainerProps<Option> extends ReorderOptions<Option> {
  onChange: (sortedOption: readonly Option[]) => void;
  disabled?: boolean;
  renderOption: (props: RenderOptionProps<Option>) => React.ReactNode;
  renderActiveOption: (props: RenderActiveOptionProps<Option>) => React.ReactNode;
  i18nStrings: ReorderAnnouncements;
  dragOverlayClassName?: string;
  children?: (optionsContent: React.ReactNode) => React.ReactNode;
}

interface RenderOptionProps<Option> extends RenderActiveOptionProps<Option> {
  ref: React.RefCallback<HTMLElement>;
  style: React.CSSProperties;
  isDragging: boolean;
  isSorting: boolean;
  attributes: DraggableAttributes;
}

interface RenderActiveOptionProps<Option> {
  option: Option;
  dragHandleAriaLabel?: string;
  listeners?: SyntheticListenerMap;
}

export function DndContainer<Option>({
  getId,
  sortedOptions,
  onChange,
  disabled,
  renderOption,
  renderActiveOption,
  i18nStrings,
  dragOverlayClassName = styles['drag-overlay'],
  children = content => content,
}: DndContainerProps<Option>) {
  const { activeItem, collisionDetection, handleKeyDown, sensors, setActiveItem } = useDragAndDropReorder({
    sortedOptions,
    getId,
  });
  const activeOption = activeItem ? sortedOptions.find(option => getId(option) === activeItem) : null;
  const isDragging = activeItem !== null;
  const announcements = useLiveAnnouncements({ sortedOptions, getId, isDragging, ...i18nStrings });
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
          const oldIndex = sortedOptions.findIndex(option => getId(option) === active.id);
          const newIndex = sortedOptions.findIndex(option => getId(option) === over.id);
          onChange(arrayMove([...sortedOptions], oldIndex, newIndex));
        }
      }}
      onDragCancel={() => setActiveItem(null)}
    >
      {children(
        <SortableContext
          disabled={disabled}
          items={sortedOptions.map(option => getId(option))}
          strategy={verticalListSortingStrategy}
        >
          {sortedOptions.map(option => (
            <DraggableOption
              key={getId(option)}
              option={option}
              getId={getId}
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
            renderActiveOption({
              option: activeOption,
              dragHandleAriaLabel: i18nStrings.dragHandleAriaLabel,
              listeners: { onKeyDown: handleKeyDown },
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
        listeners: combinedListeners,
        attributes,
      })}
    </>
  );
}
