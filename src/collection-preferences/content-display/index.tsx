// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import InternalBox from '../../box/internal';
import InternalButton from '../../button/internal';
import { useInternalI18n } from '../../i18n/context';
import useDragAndDropReorder from '../../internal/components/dnd-container/use-drag-and-drop-reorder';
import useLiveAnnouncements from '../../internal/components/dnd-container/use-live-announcements';
import Portal from '../../internal/components/portal';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import InternalSpaceBetween from '../../space-between/internal';
import InternalTextFilter from '../../text-filter/internal';
import { getAnalyticsInnerContextAttribute } from '../analytics-metadata/utils';
import { CollectionPreferencesProps } from '../interfaces';
import ContentDisplayOption from './content-display-option';
import DraggableOption from './draggable-option';
import { getFilteredOptions, getSortedOptions, OptionWithVisibility } from './utils';

import styles from '../styles.css.js';

const componentPrefix = 'content-display';

const getClassName = (suffix: string) => styles[`${componentPrefix}-${suffix}`];

interface ContentDisplayPreferenceProps extends CollectionPreferencesProps.ContentDisplayPreference {
  onChange: (value: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>) => void;
  value?: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}

const getId = (option: CollectionPreferencesProps.ContentDisplayOption) => option.id;

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
  enableColumnFiltering = false,
  i18nStrings,
}: ContentDisplayPreferenceProps) {
  const idPrefix = useUniqueId(componentPrefix);
  const i18n = useInternalI18n('collection-preferences');
  const [columnFilteringText, setColumnFilteringText] = useState('');

  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;

  const [sortedOptions, sortedAndFilteredOptions] = useMemo(() => {
    const sorted = getSortedOptions({ options, contentDisplay: value });
    const filtered = getFilteredOptions(sorted, columnFilteringText);
    return [sorted, filtered];
  }, [columnFilteringText, options, value]);

  const onToggle = (option: OptionWithVisibility) => {
    // We use sortedOptions as base and not value because there might be options that
    // are not in the value yet, so they're added as non-visible after the known ones.
    onChange(sortedOptions.map(({ id, visible }) => ({ id, visible: id === option.id ? !option.visible : visible })));
  };

  const { activeItem, collisionDetection, handleKeyDown, sensors, setActiveItem } = useDragAndDropReorder({
    sortedOptions: sortedAndFilteredOptions,
    getId,
  });

  const activeOption = activeItem ? sortedAndFilteredOptions.find(({ id }) => id === activeItem) : null;

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
    sortedOptions: sortedAndFilteredOptions,
    getId,
  });

  const renderedDragHandleAriaDescription = i18n(
    'contentDisplayPreference.dragHandleAriaDescription',
    dragHandleAriaDescription
  );

  return (
    <div className={styles[componentPrefix]} {...getAnalyticsInnerContextAttribute('contentDisplay')}>
      <h3 className={getClassName('title')} id={titleId}>
        {i18n('contentDisplayPreference.title', title)}
      </h3>
      <p className={getClassName('description')} id={descriptionId}>
        {i18n('contentDisplayPreference.description', description)}
      </p>

      {/* Filter input */}
      {enableColumnFiltering && (
        <div className={getClassName('text-filter')}>
          <InternalTextFilter
            filteringText={columnFilteringText}
            filteringPlaceholder={i18n(
              'contentDisplayPreference.i18nStrings.columnFilteringPlaceholder',
              i18nStrings?.columnFilteringPlaceholder
            )}
            filteringAriaLabel={i18n(
              'contentDisplayPreference.i18nStrings.columnFilteringAriaLabel',
              i18nStrings?.columnFilteringAriaLabel
            )}
            filteringClearAriaLabel={i18n(
              'contentDisplayPreference.i18nStrings.columnFilteringClearFilterText',
              i18nStrings?.columnFilteringClearFilterText
            )}
            onChange={({ detail }) => setColumnFilteringText(detail.filteringText)}
            countText={i18n(
              'contentDisplayPreference.i18nStrings.columnFilteringCountText',
              i18nStrings?.columnFilteringCountText
                ? i18nStrings?.columnFilteringCountText(sortedAndFilteredOptions.length)
                : undefined,
              format => format({ count: sortedAndFilteredOptions.length })
            )}
          />
        </div>
      )}

      {/* No match */}
      {sortedAndFilteredOptions.length === 0 && (
        <div className={getClassName('no-match')}>
          <InternalSpaceBetween size="s" alignItems="center">
            <InternalBox margin={{ top: 'm' }}>
              {i18n(
                'contentDisplayPreference.i18nStrings.columnFilteringNoMatchText',
                i18nStrings?.columnFilteringNoMatchText
              )}
            </InternalBox>
            <InternalButton onClick={() => setColumnFilteringText('')}>
              {i18n(
                'contentDisplayPreference.i18nStrings.columnFilteringClearFilterText',
                i18nStrings?.columnFilteringClearFilterText
              )}
            </InternalButton>
          </InternalSpaceBetween>
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
            const oldIndex = sortedOptions.findIndex(({ id }) => id === active.id);
            const newIndex = sortedOptions.findIndex(({ id }) => id === over.id);
            // We need to remember to trim the options down to id and visible to emit changes.
            onChange(arrayMove([...sortedOptions], oldIndex, newIndex).map(({ id, visible }) => ({ id, visible })));
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
            disabled={columnFilteringText.trim().length > 0}
            items={sortedAndFilteredOptions.map(({ id }) => id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedAndFilteredOptions.map(option => {
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
