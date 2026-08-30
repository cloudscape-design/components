// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalBox from '../../box/internal';
import InternalButton from '../../button/internal';
import { useInternalI18n } from '../../i18n/context';
import { SortableAreaProps } from '../../internal/components/sortable-area/interfaces';
import {
  formatDndItemCommitted,
  formatDndItemReordered,
  formatDndStarted,
} from '../../internal/components/sortable-area/use-live-announcements';
import InternalList from '../../list/internal';
import InternalSpaceBetween from '../../space-between/internal';
import InternalTextFilter from '../../text-filter/internal';
import { getAnalyticsInnerContextAttribute } from '../analytics-metadata/utils';
import { CollectionPreferencesProps } from '../interfaces';
import ContentDisplayOption from './content-display-option';
import {
  buildOptionTree,
  getFilteredOptions,
  getFilteredTree,
  getSortedOptions,
  OptionGroupNode,
  OptionTreeNode,
  OptionWithVisibility,
  toContentDisplayItems,
} from './utils';

import styles from '../styles.css.js';

const componentPrefix = 'content-display';

const getClassName = (suffix: string) => styles[`${componentPrefix}-${suffix}`];

interface ContentDisplayPreferenceProps extends CollectionPreferencesProps.ContentDisplayPreference {
  onChange: (value: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>) => void;
  value?: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}
function getDndI18nStrings(
  i18n: ReturnType<typeof useInternalI18n<'collection-preferences'>>,
  props: Pick<
    ContentDisplayPreferenceProps,
    | 'liveAnnouncementDndStarted'
    | 'liveAnnouncementDndItemReordered'
    | 'liveAnnouncementDndItemCommitted'
    | 'liveAnnouncementDndDiscarded'
    | 'dragHandleAriaLabel'
    | 'dragHandleAriaDescription'
  >
) {
  return {
    liveAnnouncementDndStarted: i18n(
      'contentDisplayPreference.liveAnnouncementDndStarted',
      props.liveAnnouncementDndStarted,
      formatDndStarted
    ),
    liveAnnouncementDndItemReordered: i18n(
      'contentDisplayPreference.liveAnnouncementDndItemReordered',
      props.liveAnnouncementDndItemReordered,
      formatDndItemReordered
    ),
    liveAnnouncementDndItemCommitted: i18n(
      'contentDisplayPreference.liveAnnouncementDndItemCommitted',
      props.liveAnnouncementDndItemCommitted,
      formatDndItemCommitted
    ),
    liveAnnouncementDndDiscarded: i18n(
      'contentDisplayPreference.liveAnnouncementDndDiscarded',
      props.liveAnnouncementDndDiscarded
    ),
    dragHandleAriaLabel: i18n('contentDisplayPreference.dragHandleAriaLabel', props.dragHandleAriaLabel),
    dragHandleAriaDescription: i18n(
      'contentDisplayPreference.dragHandleAriaDescription',
      props.dragHandleAriaDescription
    ),
  };
}

interface HierarchicalContentDisplayProps {
  tree: OptionTreeNode[];
  onToggle: (id: string) => void;
  onTreeChange: (newTree: OptionTreeNode[]) => void;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  i18nStrings: SortableAreaProps.DndAreaI18nStrings;
  sortDisabled: boolean;
  parentGroupLabel?: string;
  groupLabelFormatter: (label: string, count: number) => string;
}

function GroupItem({
  node,
  onToggle,
  onChildrenChange,
  i18nStrings,
  sortDisabled,
  groupLabelFormatter,
}: {
  node: OptionGroupNode;
  onToggle: (id: string) => void;
  onChildrenChange: (children: OptionTreeNode[]) => void;
  i18nStrings: SortableAreaProps.DndAreaI18nStrings;
  sortDisabled: boolean;
  groupLabelFormatter: (label: string, count: number) => string;
}) {
  return (
    <div data-item-type="group">
      <InternalSpaceBetween size="xxs">
        <div className={styles['content-display-group-header']}>
          <InternalBox fontWeight="bold" display="inline">
            {node.label}
          </InternalBox>
        </div>
        {node.children.length > 0 && (
          <div className={styles['content-display-group-children']}>
            <HierarchicalContentDisplay
              tree={node.children}
              onToggle={onToggle}
              onTreeChange={onChildrenChange}
              i18nStrings={i18nStrings}
              sortDisabled={sortDisabled}
              ariaLabel={node.label}
              parentGroupLabel={node.label}
              groupLabelFormatter={groupLabelFormatter}
            />
          </div>
        )}
      </InternalSpaceBetween>
    </div>
  );
}

function HierarchicalContentDisplay({
  tree,
  onToggle,
  onTreeChange,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  i18nStrings,
  sortDisabled,
  parentGroupLabel,
  groupLabelFormatter,
}: HierarchicalContentDisplayProps) {
  return (
    <InternalList
      items={tree}
      sortDisabled={sortDisabled}
      sortable={true}
      disableItemPaddings={true}
      ariaLabel={ariaLabel}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      i18nStrings={i18nStrings}
      onSortingChange={({ detail: { items } }) => onTreeChange([...items])}
      renderItem={node => ({
        id: node.id,
        announcementLabel:
          node.type === 'group'
            ? groupLabelFormatter(node.label, node.children.length)
            : parentGroupLabel
              ? `${node.label}, ${parentGroupLabel}`
              : node.label,
        content:
          node.type === 'group' ? (
            <GroupItem
              node={node}
              onToggle={onToggle}
              onChildrenChange={newChildren =>
                onTreeChange(
                  tree.map(n => (n.id === node.id && n.type === 'group' ? { ...n, children: newChildren } : n))
                )
              }
              i18nStrings={i18nStrings}
              sortDisabled={sortDisabled}
              groupLabelFormatter={groupLabelFormatter}
            />
          ) : (
            <ContentDisplayOption option={node} onToggle={() => onToggle(node.id)} />
          ),
      })}
    />
  );
}

/**
 * Renders locked options as a static (non-sortable) list above the sortable list.
 * Locked options cannot be reordered or hidden.
 */
function LockedOptionsList({ options }: { options: ReadonlyArray<OptionWithVisibility> }) {
  if (options.length === 0) {
    return null;
  }
  return (
    <div className={getClassName('locked-options')} data-testid="locked-options">
      {options.map(option => (
        <div
          key={option.id}
          className={getClassName('locked-option-item')}
          data-item-type="column"
          data-testid="locked-option-item"
        >
          <ContentDisplayOption option={option} />
        </div>
      ))}
    </div>
  );
}

export default function ContentDisplayPreference({
  title,
  description,
  options,
  value = options.map(({ id }) => ({
    id,
    visible: true,
  })),
  groups,
  onChange,
  enableColumnFiltering = false,
  i18nStrings,
  ...dndProps
}: ContentDisplayPreferenceProps) {
  const idPrefix = useUniqueId(componentPrefix);
  const i18n = useInternalI18n('collection-preferences');
  const [columnFilteringText, setColumnFilteringText] = useState('');

  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;

  const listI18nStrings = getDndI18nStrings(i18n, dndProps);
  const groupLabelFormatter = (label: string, count: number) =>
    i18n(
      'contentDisplayPreference.liveAnnouncementDndGroupLabel',
      dndProps.liveAnnouncementDndGroupLabel?.(label, count) ?? `${label}, ${count} ${count === 1 ? 'item' : 'items'}`,
      format => format({ label, count })
    );
  const hasGroups = !!groups && groups.length > 0;
  const isFiltering = columnFilteringText.trim().length > 0;

  const sortedOptions = useMemo(() => getSortedOptions({ options, contentDisplay: value }), [options, value]);

  // Separate locked options (always at top, non-sortable) from sortable options
  const lockedOptions = useMemo(() => sortedOptions.filter(opt => opt.locked === true), [sortedOptions]);
  const sortableOptions = useMemo(() => sortedOptions.filter(opt => opt.locked !== true), [sortedOptions]);

  const filteredOptions = useMemo(
    () => getFilteredOptions(sortableOptions, columnFilteringText),
    [sortableOptions, columnFilteringText]
  );
  const filteredLockedOptions = useMemo(
    () => getFilteredOptions(lockedOptions, columnFilteringText),
    [lockedOptions, columnFilteringText]
  );
  const optionTree = useMemo(
    () => (hasGroups ? buildOptionTree(options, groups, value) : null),
    [hasGroups, groups, options, value]
  );
  const filteredTree = useMemo(
    () => (optionTree ? getFilteredTree(optionTree, columnFilteringText) : null),
    [optionTree, columnFilteringText]
  );

  const handleToggle = (id: string) => {
    // Locked options cannot be toggled
    if (options.find(opt => opt.id === id)?.locked) {
      return;
    }
    // For flat (non-grouped) mode, rebuild from sortedOptions to handle items not in value
    if (!hasGroups) {
      onChange(sortedOptions.map(opt => ({ id: opt.id, visible: opt.id === id ? !opt.visible : opt.visible })));
      return;
    }
    // For grouped mode, walk the tree and flip the matching item
    const toggle = (
      items: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>
    ): CollectionPreferencesProps.ContentDisplayItem[] =>
      items.map(item => {
        if (item.type === 'group') {
          return { ...item, children: toggle(item.children) };
        }
        return item.id === id ? { ...item, visible: !item.visible } : item;
      });
    onChange(toggle(value));
  };

  // When sortable options are reordered, preserve locked options at their original positions
  const handleSortableChange = (reorderedSortable: ReadonlyArray<{ id: string; visible: boolean }>) => {
    // Rebuild full order: locked items stay in their original slots, sortable items fill the rest
    const lockedIds = new Set(lockedOptions.map(o => o.id));
    const sortableResult = reorderedSortable.map(({ id, visible }) => ({ id, visible }));
    const result: CollectionPreferencesProps.ContentDisplayItem[] = [];
    let sortableIdx = 0;
    for (const opt of sortedOptions) {
      if (lockedIds.has(opt.id)) {
        result.push({ id: opt.id, visible: opt.visible });
      } else {
        result.push({ id: sortableResult[sortableIdx].id, visible: sortableResult[sortableIdx].visible });
        sortableIdx++;
      }
    }
    onChange(result);
  };

  const noResults = filteredTree
    ? filteredTree.length === 0
    : filteredOptions.length === 0 && filteredLockedOptions.length === 0;

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles[componentPrefix]}
      {...getAnalyticsInnerContextAttribute('contentDisplay')}
    >
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
              i18nStrings?.columnFilteringCountText?.(filteredOptions.length + filteredLockedOptions.length),
              format => format({ count: filteredOptions.length + filteredLockedOptions.length })
            )}
          />
        </div>
      )}

      {noResults && (
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

      <div role="application" aria-labelledby={titleId}>
        {optionTree && filteredTree ? (
          <HierarchicalContentDisplay
            tree={isFiltering ? filteredTree : optionTree}
            onToggle={handleToggle}
            onTreeChange={newTree => onChange(toContentDisplayItems(newTree))}
            ariaLabelledby={titleId}
            ariaDescribedby={descriptionId}
            i18nStrings={listI18nStrings}
            sortDisabled={isFiltering}
            groupLabelFormatter={groupLabelFormatter}
          />
        ) : (
          <>
            {/* Locked options rendered above the sortable list, non-interactive */}
            {!isFiltering && <LockedOptionsList options={lockedOptions} />}
            {isFiltering && <LockedOptionsList options={filteredLockedOptions} />}
            <InternalList
              items={isFiltering ? filteredOptions : sortableOptions}
              sortable={true}
              sortDisabled={isFiltering}
              disableItemPaddings={true}
              ariaLabelledby={titleId}
              ariaDescribedby={descriptionId}
              i18nStrings={listI18nStrings}
              onSortingChange={({ detail: { items } }) =>
                handleSortableChange(items.map(({ id, visible }) => ({ id, visible })))
              }
              renderItem={item => ({
                id: item.id,
                announcementLabel: item.label,
                content: <ContentDisplayOption option={item} onToggle={() => handleToggle(item.id)} />,
              })}
            />
          </>
        )}
      </div>
    </div>
  );
}
