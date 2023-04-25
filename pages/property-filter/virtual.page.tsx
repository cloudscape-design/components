// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import PropertyFilter from '~components/property-filter';
import ScreenshotArea from '../utils/screenshot-area';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import Table from '~components/table';
import labels from '../app-layout/utils/labels';
import { PropertyFilterProps } from '~components/property-filter/interfaces';
import { columnDefinitions, i18nStrings } from './common-props';
import { allItems, states, TableItem } from './table.data';
import { useCollection } from '@cloudscape-design/collection-hooks';

const filteringProperties: readonly PropertyFilterProps.FilteringProperty[] = columnDefinitions.map(def => ({
  key: def.id,
  operators: def.type === 'text' ? ['=', '!=', ':', '!:'] : ['=', '!=', '>', '<', '<=', '>='],
  propertyLabel: def.propertyLabel,
  groupValuesLabel: `${def.propertyLabel} values`,
}));

export default function () {
  const [virtualScroll, setVirtualScroll] = useState<boolean>(false);
  const { items, collectionProps, actions, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      empty: 'empty',
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            No matches
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            We can’t find a match.
          </Box>
          <Button
            onClick={() => actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })}
          >
            Clear filter
          </Button>
        </Box>
      ),
      filteringProperties,
      defaultQuery: { tokens: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }], operation: 'and' },
    },
    sorting: {},
  });

  const filteringOptions = propertyFilterProps.filteringOptions.map(option => {
    if (option.propertyKey === 'state') {
      option.label = states[parseInt(option.value)];
    }
    return option;
  });

  console.log('items.length', items.length);
  console.log('propertyFilterProps.filteringOptions.length', propertyFilterProps.filteringOptions.length);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        content={
          <>
            <Button
              onClick={() => {
                setVirtualScroll(value => !value);
              }}
            >
              Toggle virtual scroll {virtualScroll ? 'off' : 'on'}
            </Button>
            <Table<TableItem>
              items={items.slice(0, 100)}
              {...collectionProps}
              filter={
                <PropertyFilter
                  {...propertyFilterProps}
                  filteringOptions={filteringOptions}
                  virtualScroll={virtualScroll}
                  countText={`${items.length} matches`}
                  i18nStrings={i18nStrings}
                  expandToViewport={true}
                />
              }
              columnDefinitions={columnDefinitions.slice(0, 2)}
            />
          </>
        }
      />
    </ScreenshotArea>
  );
}
