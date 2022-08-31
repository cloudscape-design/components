// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import AppLayout from '~components/app-layout';
import Table from '~components/table';
import PropertyFilter from '~components/property-filter';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import labels from '../app-layout/utils/labels';
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
    const filteringOptions: any[] = [];

    for (let i = 0; i < 500; i++) {
      for (const option of propertyFilterProps.filteringOptions) {
        filteringOptions.push(option);
      }
    }

    return filteringOptions;
  }, [propertyFilterProps.filteringOptions]);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        navigationHide={true}
        content={
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
        }
      />
    </ScreenshotArea>
  );
}
