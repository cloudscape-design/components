// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import InternalBox from '../../box/internal';
import { useInternalI18n } from '../../i18n/context';
import Portal from '../../internal/components/portal';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import InternalTextFilter from '../../text-filter/internal';
import { CollectionPreferencesProps } from '../interfaces';
import ContentDisplayOption from './content-display-option';
import DraggableOption from './draggable-option';
import useDragAndDropReorder from './use-drag-and-drop-reorder';
import useLiveAnnouncements from './use-live-announcements';
import { getSortedOptions, OptionWithVisibility } from './utils';

import styles from '../styles.css.js';

const componentPrefix = 'content-display';

const getClassName = (suffix: string) => styles[`${componentPrefix}-${suffix}`];

interface ContentDisplayPreferenceProps extends CollectionPreferencesProps.ContentDisplayPreference {
  onChange: (value: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>) => void;
  value?: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}

export default function ContentDisplayPreference({
  title,
  description,
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
  searchableColumns = false,
  columnFilteringPlaceholderText,
  columnFilteringAriaLabel,
  columnFilteringCountText,
  columnFilteringEmptyText,
  columnFilteringClearAriaLabel,
}: ContentDisplayPreferenceProps) {
  const idPrefix = useUniqueId(componentPrefix);
  const i18n = useInternalI18n('collection-preferences');
  const [columnFilteringText, setColumnFilteringText] = useState('');

  const onToggle = (option: OptionWithVisibility) => {
    onChange(value.map(item => (item.id === option.id ? { ...item, visible: !option.visible } : item)));
  };

  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;

  const sortedOptions = useMemo(
    () =>
      getSortedOptions({ options, contentDisplay: value }).filter(option =>
        option.label.toLowerCase().includes(columnFilteringText.toLowerCase())
      ),
    [columnFilteringText, options, value]
  );

  const { activeItem, collisionDetection, handleKeyDown, sensors, setActiveItem } = useDragAndDropReorder({
    sortedOptions,
  });

  const activeOption = activeItem ? sortedOptions.find(({ id }) => id === activeItem) : null;

  const announcements = useLiveAnnouncements({
    isDragging: activeItem !== null,
    liveAnnouncementDndStarted: i18n(
      'contentDisplayPreference.liveAnnouncementDndStarted',
      liveAnnouncementDndStarted,
      format => (position, total) => format({ position, total })
    ),
    liveAnnouncementDndItemReordered: i18n(
      'contentDisplayPreference.liveAnnouncementDndItemReordered',
      liveAnnouncementDndItemReordered,
      format => (initialPosition, currentPosition, total) =>
        format({ currentPosition, total, isInitialPosition: `${initialPosition === currentPosition}` })
    ),
    liveAnnouncementDndItemCommitted: i18n(
      'contentDisplayPreference.liveAnnouncementDndItemCommitted',
      liveAnnouncementDndItemCommitted,
      format => (initialPosition, finalPosition, total) =>
        format({ initialPosition, finalPosition, total, isInitialPosition: `${initialPosition === finalPosition}` })
    ),
    liveAnnouncementDndDiscarded: i18n(
      'contentDisplayPreference.liveAnnouncementDndDiscarded',
      liveAnnouncementDndDiscarded
    ),
    sortedOptions: value,
  });

  const renderedDragHandleAriaDescription = i18n(
    'contentDisplayPreference.dragHandleAriaDescription',
    dragHandleAriaDescription
  );

  return (
    <div className={styles[componentPrefix]}>
      <h3 className={getClassName('title')} id={titleId}>
        {i18n('contentDisplayPreference.title', title)}
      </h3>
      <p className={getClassName('description')} id={descriptionId}>
        {i18n('contentDisplayPreference.description', description)}
      </p>

      {/* Filter input */}
      {searchableColumns && (
        <div className={getClassName('text-filter')}>
          <InternalTextFilter
            filteringText={columnFilteringText}
            filteringPlaceholder={i18n(
              'contentDisplayPreference.columnFilteringPlaceholderText',
              columnFilteringPlaceholderText
            )}
            filteringAriaLabel={i18n('contentDisplayPreference.columnFilteringAriaLabel', columnFilteringAriaLabel)}
            filteringClearAriaLabel={i18n(
              'contentDisplayPreference.columnFilteringClearAriaLabel',
              columnFilteringClearAriaLabel
            )}
            onChange={({ detail }) => setColumnFilteringText(detail.filteringText)}
            countText={
              columnFilteringText.length > 0 && columnFilteringCountText
                ? columnFilteringCountText(sortedOptions?.length)
                : ''
            }
          />
        </div>
      )}

      {/* Empty state */}
      {sortedOptions.length === 0 && (
        <div className={getClassName('empty-state')}>
          <InternalBox margin={'m'} textAlign="center">
            {i18n('contentDisplayPreference.columnFilteringEmptyText', columnFilteringEmptyText)}
          </InternalBox>
        </div>
      )}

      {/* Drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        accessibility={{
          announcements,
          restoreFocus: false,
          screenReaderInstructions: renderedDragHandleAriaDescription
            ? { draggable: renderedDragHandleAriaDescription }
            : undefined,
        }}
        onDragStart={({ active }) => setActiveItem(active.id)}
        onDragEnd={event => {
          setActiveItem(null);
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = value.findIndex(({ id }) => id === active.id);
            const newIndex = value.findIndex(({ id }) => id === over.id);
            onChange(arrayMove([...value], oldIndex, newIndex));
          }
        }}
        onDragCancel={() => setActiveItem(null)}
      >
        {/* Use explicit list role to work around Safari not announcing lists as such when list-style is set to none.
            See https://bugs.webkit.org/show_bug.cgi?id=170179 */}
        <ul
          className={getClassName('option-list')}
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          role="list"
        >
          <SortableContext
            disabled={columnFilteringText.length > 0}
            items={sortedOptions.map(({ id }) => id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedOptions.map(option => {
              return (
                <DraggableOption
                  dragHandleAriaLabel={i18n('contentDisplayPreference.dragHandleAriaLabel', dragHandleAriaLabel)}
                  key={option.id}
                  onKeyDown={handleKeyDown}
                  onToggle={onToggle}
                  option={option}
                />
              );
            })}
          </SortableContext>
        </ul>
        <Portal>
          {/* Make sure that the drag overlay is above the modal
              by assigning the z-index as inline style
              so that it prevails over dnd-kit's inline z-index of 999  */}
          {/* className is a documented prop of the DragOverlay component:
              https://docs.dndkit.com/api-documentation/draggable/drag-overlay#class-name-and-inline-styles */
          /* eslint-disable-next-line react/forbid-component-props */}
          <DragOverlay className={styles['drag-overlay']} dropAnimation={null} style={{ zIndex: 5000 }}>
            {activeOption && (
              <ContentDisplayOption
                listeners={{ onKeyDown: handleKeyDown }}
                dragHandleAriaLabel={i18n('contentDisplayPreference.dragHandleAriaLabel', dragHandleAriaLabel)}
                onToggle={onToggle}
                option={activeOption}
              />
            )}
          </DragOverlay>
        </Portal>
      </DndContext>
    </div>
  );
}
