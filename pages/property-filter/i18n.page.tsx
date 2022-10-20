// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box from '~components/box';
import Table from '~components/table';
import PropertyFilter from '~components/property-filter/i18n';
import Header from '~components/header';
import Button from '~components/button';
import { allItems, TableItem } from './table.data';
import { columnDefinitions, filteringProperties } from './common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';

export default function () {
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
  return (
    <Box margin="m">
      <Table<TableItem>
        className="main-content"
        stickyHeader={true}
        header={<Header headingTagOverride={'h1'}>Instances</Header>}
        items={items}
        {...collectionProps}
        filter={
          <PropertyFilter
            {...propertyFilterProps}
            virtualScroll={true}
            countText={`${items.length} matches`}
            i18nStrings={{} as any}
            expandToViewport={true}
          />
        }
        columnDefinitions={columnDefinitions.slice(0, 2)}
      />
    </Box>
  );
}
