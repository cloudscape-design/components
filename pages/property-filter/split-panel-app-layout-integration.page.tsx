// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import Header from '~components/header';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import PropertyFilter from '~components/property-filter/internal';
import SplitPanel from '~components/split-panel';
import Table from '~components/table';

import { Breadcrumbs, Navigation, Tools } from '../app-layout/utils/content-blocks';
import appLayoutLabels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import ScreenshotArea from '../utils/screenshot-area';
import { columnDefinitions, filteringProperties, labels } from './common-props';
import { allItems, states, TableItem } from './table.data';

export default function () {
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
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

  return (
    <ScreenshotArea gutters={false}>
      <I18nProvider messages={[messages]} locale="en">
        <AppLayout
          ariaLabels={appLayoutLabels}
          breadcrumbs={<Breadcrumbs />}
          navigation={<Navigation />}
          tools={<Tools>{toolsContent.long}</Tools>}
          splitPanelOpen={splitPanelOpen}
          onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
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
                  {...labels}
                  {...propertyFilterProps}
                  filteringOptions={filteringOptions}
                  virtualScroll={true}
                  countText={`${items.length} matches`}
                  enableTokenGroups={true}
                  expandToViewport={true}
                  filteringEmpty="No properties"
                  customGroupsText={[]}
                  disableFreeTextFiltering={false}
                />
              }
              columnDefinitions={columnDefinitions.slice(0, 2)}
            />
          }
        />
      </I18nProvider>
    </ScreenshotArea>
  );
}
