// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import Table from '~components/table';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import Header from '~components/header';
import { allItems, columnDefinitions, TableItem, i18nStrings, filteringProperties } from './table.data';
import { useCollection } from '@cloudscape-design/collection-hooks';

export default function () {
  const { items, collectionProps, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      empty: 'empty',
      noMatch: 'no match',
      filteringProperties,
      defaultQuery: { tokens: [], operation: 'and' },
    },
    sorting: {},
  });

  // Generate many autosuggest items.
  const filteringOptions = useMemo(() => {
    const filteringOptions: PropertyFilterProps.FilteringOption[] = [];

    for (let i = 0; i < 500; i++) {
      for (const option of propertyFilterProps.filteringOptions) {
        filteringOptions.push(option);
      }
    }

    return filteringOptions;
  }, [propertyFilterProps.filteringOptions]);

  return (
    <div style={{ padding: 10 }}>
      <Table<TableItem>
        className="main-content"
        stickyHeader={true}
        header={<Header headingTagOverride={'h1'}>Performance test (many filtering options)</Header>}
        items={items}
        {...collectionProps}
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            filteringOptions={filteringOptions}
            virtualScroll={true}
            countText={`${items.length} matches`}
            i18nStrings={i18nStrings}
            expandToViewport={true}
          />
        }
        columnDefinitions={columnDefinitions.slice(0, 2)}
      />
    </div>
  );
}
