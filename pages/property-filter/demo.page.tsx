// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Table from '~components/table';
import PropertyFilter from '~components/property-filter';
import Header from '~components/header';
import Button from '~components/button';
import ScreenshotArea from '../utils/screenshot-area';
import { Navigation, Breadcrumbs } from '../app-layout/utils/content-blocks';
import labels from '../app-layout/utils/labels';
import { allItems, states, TableItem } from './table.data';
import { columnDefinitions, i18nStrings, filteringProperties } from './common-props';
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
      defaultQuery: {
        tokens: [],
        tokenGroups: [
          { propertyKey: 'state', operator: '=', value: '0' },
          {
            operation: 'and',
            tokens: [
              { propertyKey: 'instancetype', operator: '!=', value: 't3.nano' },
              { propertyKey: 'averagelatency', operator: '<', value: '100' },
            ],
          },
        ],
        operation: 'or',
      },
    },
    sorting: {},
  });

  const filteringOptions = propertyFilterProps.filteringOptions.map(option => {
    if (option.propertyKey === 'state') {
      option.label = states[parseInt(option.value)];
    }
    return option;
  });

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        toolsHide={true}
        content={
          <Table<TableItem>
            className="main-content"
            stickyHeader={true}
            header={<Header headingTagOverride={'h1'}>Instances</Header>}
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
                filteringEmpty="No properties"
                enableTokenGroups={true}
                tokenLimit={2}
              />
            }
            columnDefinitions={columnDefinitions.slice(0, 2)}
          />
        }
      />
    </ScreenshotArea>
  );
}
