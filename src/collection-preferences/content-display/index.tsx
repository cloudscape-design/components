// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

import InternalBox from '../../box/internal';
import InternalButton from '../../button/internal';
import { useInternalI18n } from '../../i18n/context';
import { DndArea } from '../../internal/components/dnd-area';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import InternalSpaceBetween from '../../space-between/internal';
import InternalTextFilter from '../../text-filter/internal';
import { getAnalyticsInnerContextAttribute } from '../analytics-metadata/utils';
import { CollectionPreferencesProps } from '../interfaces';
import ContentDisplayOption, { getClassName as getOptionClassName } from './content-display-option';
import { getFilteredOptions, getSortedOptions, OptionWithVisibility } from './utils';

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

      {/* Use explicit list role to work around Safari not announcing lists as such when list-style is set to none.
            See https://bugs.webkit.org/show_bug.cgi?id=170179 */}
      <ul
        className={getClassName('option-list')}
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        role="list"
      >
        <DndArea
          items={sortedAndFilteredOptions.map(data => ({ id: data.id, label: data.label, data }))}
          onItemsChange={items => onChange(items.map(({ id, data }) => ({ id, visible: data.visible })))}
          disableReorder={columnFilteringText.trim().length > 0}
          renderItem={({ ref, item, isDragging, isSorting, isActive, style, ...dragHandle }) => {
            const className = clsx(getOptionClassName(), isDragging && styles.placeholder, isSorting && styles.sorting);
            const content = <ContentDisplayOption ref={ref} option={item.data} onToggle={onToggle} {...dragHandle} />;
            return isActive ? (
              content
            ) : (
              <li className={className} style={style}>
                {content}
              </li>
            );
          }}
          i18nStrings={{
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
                format({
                  initialPosition,
                  finalPosition,
                  total,
                  isInitialPosition: `${initialPosition === finalPosition}`,
                })
            ),
            liveAnnouncementDndDiscarded: i18n(
              'contentDisplayPreference.liveAnnouncementDndDiscarded',
              liveAnnouncementDndDiscarded
            ),
            dragHandleAriaLabel: i18n('contentDisplayPreference.dragHandleAriaLabel', dragHandleAriaLabel),
            dragHandleAriaDescription: i18n(
              'contentDisplayPreference.dragHandleAriaDescription',
              dragHandleAriaDescription
            ),
          }}
        />
      </ul>
    </div>
  );
}
