// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import SplitPanel from '~components/split-panel';
import Box from '~components/box';
import Table from '~components/table';
import PropertyFilter from '~components/property-filter';
import Header from '~components/header';
import Button from '~components/button';
import ScreenshotArea from '../utils/screenshot-area';
import { Navigation, Tools, Breadcrumbs } from '../app-layout/utils/content-blocks';
import * as toolsContent from '../app-layout/utils/tools-content';
import labels from '../app-layout/utils/labels';
import { allItems, TableItem } from './table.data';
import { columnDefinitions, i18nStrings, filteringProperties, propertyDefinitions } from './common-props';
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
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        splitPanelOpen={true}
        splitPanel={
          <SplitPanel
            header="Split panel header"
            i18nStrings={{
              preferencesTitle: 'Preferences',
              preferencesPositionLabel: 'Split panel position',
              preferencesPositionDescription: 'Choose the default split panel position for the service.',
              preferencesPositionSide: 'Side',
              preferencesPositionBottom: 'Bottom',
              preferencesConfirm: 'Confirm',
              preferencesCancel: 'Cancel',
              closeButtonAriaLabel: 'Close panel',
              openButtonAriaLabel: 'Open panel',
              resizeHandleAriaLabel: 'Slider',
            }}
          >
            {' '}
          </SplitPanel>
        }
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
                virtualScroll={true}
                countText={`${items.length} matches`}
                i18nStrings={i18nStrings}
                expandToViewport={true}
                propertyDefinitions={propertyDefinitions}
                filteringEmpty="No properties"
              />
            }
            columnDefinitions={columnDefinitions.slice(0, 2)}
          />
        }
      />
    </ScreenshotArea>
  );
}
