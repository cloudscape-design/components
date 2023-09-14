// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import PropertyFilter from '~components/property-filter';
import Table from '~components/table';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Box from '~components/box';
import Header from '~components/header';
import FormField from '~components/form-field';
import Select from '~components/select';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import ScreenshotArea from '../utils/screenshot-area';
import { allItems, TableItem } from '../property-filter/table.data';
import { columnDefinitions, filteringProperties } from '../property-filter/common-props';
import { FilterSet, useFilterSets } from './use-filter-sets';

const defaultFilterSets: FilterSet[] = [
  {
    name: 'Stopped instances',
    query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: '0' }] },
  },
  {
    name: 'Old active instances',
    query: {
      operation: 'and',
      tokens: [
        { propertyKey: 'launchdate', operator: '<', value: '2023-01-01' },
        { propertyKey: 'state', operator: '!=', value: '0' },
      ],
    },
  },
];

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
    },
    sorting: {},
  });

  const [savedFilterSets, setSavedFilterSets] = useState(defaultFilterSets);

  const { buttonDropdownProps, selectProps, actionModal } = useFilterSets({
    filterSets: savedFilterSets,
    query: propertyFilterProps.query,
    filteringProperties: propertyFilterProps.filteringProperties,
    updateFilters: query => actions.setPropertyFiltering(query),
    updateSavedFilterSets: newFilterSets => {
      setSavedFilterSets(newFilterSets);

      // Sync with your back-end here
    },
  });

  return (
    <ScreenshotArea disableAnimations={true}>
      <I18nProvider messages={[messages]} locale="en">
        <Table<TableItem>
          header={<Header headingTagOverride={'h1'}>Instances</Header>}
          items={items}
          {...collectionProps}
          filter={
            <PropertyFilter
              {...propertyFilterProps}
              filteringPlaceholder="Find resources"
              countText={`${items.length} matches`}
              customControl={
                <FormField label="Saved filter sets">
                  <Select {...selectProps} />
                </FormField>
              }
              customFilterActions={<ButtonDropdown {...buttonDropdownProps} />}
            />
          }
          columnDefinitions={columnDefinitions}
        />
        {actionModal}
      </I18nProvider>
    </ScreenshotArea>
  );
}
