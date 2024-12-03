// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { PropertyFilterQuery, useCollection } from '@cloudscape-design/collection-hooks';

import {
  AppLayout,
  Box,
  Button,
  Checkbox,
  Header,
  PropertyFilter,
  PropertyFilterProps,
  SpaceBetween,
  SplitPanel,
  Table,
} from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';

import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs, Navigation, Tools } from '../app-layout/utils/content-blocks';
import appLayoutLabels from '../app-layout/utils/labels';
import * as toolsContent from '../app-layout/utils/tools-content';
import { useOptionsLoader } from '../common/options-loader';
import ScreenshotArea from '../utils/screenshot-area';
import { columnDefinitions, filteringProperties, labels } from './common-props';
import { allItems, states, TableItem } from './table.data';
import { decode, encode } from './utils';

type PageContext = React.Context<
  AppContextType<{
    virtualScroll?: boolean;
    expandToViewport?: boolean;
    enableTokenGroups?: boolean;
    disableFreeTextFiltering?: boolean;
    hideOperations?: boolean;
    asyncOptions?: boolean;
    emptyOptions?: boolean;
    propertyFilters?: string;
  }>
>;

export default function () {
  const {
    urlParams: {
      virtualScroll = true,
      expandToViewport = true,
      enableTokenGroups = true,
      disableFreeTextFiltering = false,
      hideOperations = false,
      asyncOptions = false,
      emptyOptions = false,
      propertyFilters = '',
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

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
      defaultQuery: decode<PropertyFilterQuery>(propertyFilters, { operation: 'and', tokens: [], tokenGroups: [] }),
    },
    sorting: {},
  });

  let filteringOptions = propertyFilterProps.filteringOptions
    .map(option => {
      if (option.propertyKey === 'state') {
        option.label = states[option.value];
      }
      return option;
    })
    .filter(option => option.propertyKey !== 'tags')
    .filter(option => option.propertyKey !== 'averagelatency');

  const allTags = new Set<string>();
  for (const item of allItems) {
    for (const tag of item.tags ?? []) {
      allTags.add(tag);
    }
  }
  for (const tag of allTags) {
    filteringOptions.push({ propertyKey: 'tags', value: tag });
  }

  if (emptyOptions) {
    filteringOptions = [];
  }

  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [filteringText, setFilteringText] = useState('');
  const optionsLoader = useOptionsLoader<PropertyFilterProps.FilteringOption>({ pageSize: 15, timeout: 1000 });
  const handleLoadItems = ({
    detail: { filteringProperty, filteringText, firstPage },
  }: {
    detail: PropertyFilterProps.LoadItemsDetail;
  }) => {
    if (filteringProperty) {
      const sourceItems = filteringOptions.filter(option => option.propertyKey === filteringProperty.key);
      optionsLoader.fetchItems({ sourceItems, filteringText, firstPage });
      setFilteringText(filteringText);
    } else {
      setFilteringText('');
    }
  };
  const asyncProps = asyncOptions
    ? {
        asyncProperties: false,
        filteringStatusType: optionsLoader.status,
        onLoadItems: handleLoadItems,
        filteringFinishedText: filteringText ? `End of "${filteringText}" results` : 'End of all results',
      }
    : {};

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
              <SpaceBetween size="s">
                <Checkbox
                  checked={virtualScroll}
                  onChange={({ detail }) => setUrlParams({ virtualScroll: detail.checked })}
                >
                  virtualScroll
                </Checkbox>
                <Checkbox
                  checked={expandToViewport}
                  onChange={({ detail }) => setUrlParams({ expandToViewport: detail.checked })}
                >
                  expandToViewport
                </Checkbox>
                <Checkbox
                  checked={enableTokenGroups}
                  onChange={({ detail }) => setUrlParams({ enableTokenGroups: detail.checked })}
                >
                  enableTokenGroups
                </Checkbox>
                <Checkbox
                  checked={disableFreeTextFiltering}
                  onChange={({ detail }) => setUrlParams({ disableFreeTextFiltering: detail.checked })}
                >
                  disableFreeTextFiltering
                </Checkbox>
                <Checkbox
                  checked={hideOperations}
                  onChange={({ detail }) => setUrlParams({ hideOperations: detail.checked })}
                >
                  hideOperations
                </Checkbox>
                <Checkbox
                  checked={asyncOptions}
                  onChange={({ detail }) => setUrlParams({ asyncOptions: detail.checked })}
                >
                  asyncOptions
                </Checkbox>
                <Checkbox
                  checked={emptyOptions}
                  onChange={({ detail }) => setUrlParams({ emptyOptions: detail.checked })}
                >
                  Empty options
                </Checkbox>
              </SpaceBetween>
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
                  {...asyncProps}
                  filteringOptions={asyncOptions ? optionsLoader.items : filteringOptions}
                  enableTokenGroups={enableTokenGroups}
                  disableFreeTextFiltering={disableFreeTextFiltering}
                  hideOperations={hideOperations}
                  virtualScroll={virtualScroll}
                  expandToViewport={expandToViewport}
                  countText={`${items.length} matches`}
                  onChange={event => {
                    propertyFilterProps.onChange(event);
                    setUrlParams({ propertyFilters: encode(event.detail) });
                  }}
                />
              }
              columnDefinitions={columnDefinitions}
            />
          }
        />
      </I18nProvider>
    </ScreenshotArea>
  );
}
