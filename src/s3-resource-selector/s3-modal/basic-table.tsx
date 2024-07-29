// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../../button/internal';
import InternalHeader from '../../header/internal';
import { ComponentFormatFunction } from '../../i18n/context';
import LiveRegion from '../../internal/components/live-region';
import useForwardFocus, { ForwardFocusRef } from '../../internal/hooks/forward-focus';
import formatDateLocalized from '../../internal/utils/date-time/format-date-localized';
import { PaginationProps } from '../../pagination/interfaces';
import InternalPagination from '../../pagination/internal';
import InternalSpaceBetween from '../../space-between/internal';
import { TableProps } from '../../table/interfaces';
import InternalTable from '../../table/internal';
import { TextFilterProps } from '../../text-filter/interfaces';
import InternalTextFilter from '../../text-filter/internal';
import { S3ResourceSelectorProps } from '../interfaces';
import { EmptyState } from './empty-state';

import styles from './styles.css.js';

interface BasicS3TableStrings<T> {
  labelRefresh?: string;
  labelsPagination?: PaginationProps.Labels;
  header?: string;
  loadingText?: string;
  filteringPlaceholder?: string;
  filteringAriaLabel?: string;
  filteringClearAriaLabel?: string;
  filteringCounterText?: S3ResourceSelectorProps.I18nStrings['filteringCounterText'];
  lastUpdatedText?: string;
  emptyText?: string;
  noMatchTitle?: string;
  noMatchSubtitle?: string;
  clearFilterButtonText?: string;
  selectionLabels?: TableProps.AriaLabels<T>;
}

interface BasicS3TableProps<T> {
  // We do not use idiomatic `ref` prop because it does not allow generics.
  // Option 3 from this solution: https://stackoverflow.com/a/58473012/1297743
  forwardFocusRef: React.Ref<ForwardFocusRef>;
  columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<T>>;
  fetchData: () => Promise<ReadonlyArray<T>>;
  trackBy: TableProps.TrackBy<T>;
  i18nStrings: BasicS3TableStrings<T>;
  isVisualRefresh?: boolean;
  visibleColumns: ReadonlyArray<string>;
  isItemDisabled: TableProps.IsItemDisabled<T> | undefined;
  onSelect: (item: T | undefined) => void;
}

export function getSharedI18Strings(
  i18n: ComponentFormatFunction<'s3-resource-selector'>,
  i18nStrings: S3ResourceSelectorProps.I18nStrings | undefined
): BasicS3TableStrings<unknown> {
  return {
    filteringCounterText: i18n(
      'i18nStrings.filteringCounterText',
      i18nStrings?.filteringCounterText,
      format => count => format({ count })
    ),
    labelRefresh: i18n('i18nStrings.labelRefresh', i18nStrings?.labelRefresh),
    labelsPagination: i18nStrings?.labelsPagination,
    noMatchTitle: i18n('i18nStrings.filteringNoMatches', i18nStrings?.filteringNoMatches),
    noMatchSubtitle: i18n('i18nStrings.filteringCantFindMatch', i18nStrings?.filteringCantFindMatch),
    clearFilterButtonText: i18n('i18nStrings.clearFilterButtonText', i18nStrings?.clearFilterButtonText),
    filteringClearAriaLabel: i18nStrings?.labelClearFilter,
    lastUpdatedText: i18n('i18nStrings.modalLastUpdatedText', i18nStrings?.modalLastUpdatedText),
  };
}

export function BasicS3Table<T>({
  forwardFocusRef,
  columnDefinitions,
  fetchData,
  trackBy,
  i18nStrings = {},
  isVisualRefresh,
  visibleColumns,
  isItemDisabled,
  onSelect,
}: BasicS3TableProps<T>) {
  const [loading, setLoading] = useState(false);
  const [allItems, setAllItems] = useState<ReadonlyArray<T>>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const textFilterRef = useRef<TextFilterProps.Ref>(null);
  const onSelectLatest = useStableCallback(onSelect);

  function loadData() {
    setLoading(true);
    return fetchData()
      .then(items => {
        setAllItems(items);
        setLoading(false);
      })
      .catch(() => {
        // error handling should happen on the customer side, outside of this component
        setLoading(false);
      });
  }

  async function reloadData() {
    await loadData();
    setLastUpdated(new Date());
  }

  useEffect(() => {
    loadData();
    // Data loading is only happening on initial render, or via refresh button
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useForwardFocus(forwardFocusRef, textFilterRef);

  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps, actions } = useCollection(
    allItems,
    {
      selection: { trackBy },
      filtering: {
        empty: i18nStrings.emptyText,
        noMatch: (
          <EmptyState
            title={i18nStrings.noMatchTitle}
            subtitle={i18nStrings.noMatchSubtitle}
            action={
              <InternalButton onClick={() => actions.setFiltering('')}>
                {i18nStrings.clearFilterButtonText}
              </InternalButton>
            }
          />
        ),
      },
      pagination: {},
      sorting: {},
    }
  );
  const selectedItem = collectionProps.selectedItems?.[0];

  // selectedItem can change internally inside the hook after pagination or filtering
  // useEffect will capture all possible changes
  useEffect(() => {
    onSelectLatest(selectedItem);
  }, [selectedItem, onSelectLatest]);

  return (
    <InternalTable<T>
      variant={isVisualRefresh ? 'borderless' : 'container'}
      {...collectionProps}
      header={
        <InternalHeader
          variant={isVisualRefresh ? 'h3' : 'h2'}
          headingTagOverride={'h3'}
          actions={
            <InternalHeaderActions<T> reloadData={reloadData} i18nStrings={i18nStrings} lastUpdated={lastUpdated} />
          }
          counter={selectedItem ? `(1/${allItems.length})` : `(${allItems.length})`}
        >
          {i18nStrings.header}
        </InternalHeader>
      }
      trackBy={trackBy}
      filter={
        <InternalTextFilter
          {...filterProps}
          ref={textFilterRef}
          filteringAriaLabel={i18nStrings.filteringAriaLabel}
          filteringClearAriaLabel={i18nStrings.filteringClearAriaLabel}
          filteringPlaceholder={i18nStrings.filteringPlaceholder}
          countText={i18nStrings.filteringCounterText ? i18nStrings.filteringCounterText(filteredItemsCount!) : ''}
        />
      }
      pagination={<InternalPagination {...paginationProps} ariaLabels={i18nStrings.labelsPagination} />}
      selectionType="single"
      ariaLabels={i18nStrings.selectionLabels}
      loading={loading}
      loadingText={i18nStrings.loadingText}
      items={items}
      visibleColumns={visibleColumns}
      isItemDisabled={isItemDisabled}
      columnDefinitions={columnDefinitions}
      enableKeyboardNavigation={true}
    />
  );
}

interface InternalHeaderActionsProps<T> {
  reloadData: () => void;
  i18nStrings: BasicS3TableProps<T>['i18nStrings'];
  lastUpdated: Date | undefined;
}

export function InternalHeaderActions<T>({ i18nStrings, reloadData, lastUpdated }: InternalHeaderActionsProps<T>) {
  function getLastUpdated() {
    if (!lastUpdated || !i18nStrings.lastUpdatedText) {
      return null;
    }

    const formattedDate = formatDateLocalized({
      date: lastUpdated.toString(),
      isDateOnly: false,
    });

    return (
      <div className={styles['last-updated-caption']}>
        {i18nStrings.lastUpdatedText}
        <br />
        {formattedDate}
        <LiveRegion visible={false} source={[i18nStrings.lastUpdatedText, formattedDate]} />
      </div>
    );
  }

  return (
    <InternalSpaceBetween size="s" direction="horizontal" alignItems="center">
      {getLastUpdated()}
      <InternalButton iconName="refresh" ariaLabel={i18nStrings.labelRefresh} onClick={reloadData} />
    </InternalSpaceBetween>
  );
}
