// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import Table from '~components/table';
import PropertyFilter from '~components/property-filter/i18n';
import Header from '~components/header';
import Button from '~components/button';
import { allItems, TableItem } from './table.data';
import { columnDefinitions, filteringProperties } from './common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { GlobalI18NContextProvider } from '~components/i18n/context';

import propertyFilterMessagesGerman from '~components/i18n/messages/de-DE/property-filter';
import propertyFilterMessagesDefault from '~components/i18n/messages/default/property-filter';
import { FormField, Select, SpaceBetween } from '~components';

export default function () {
  const [language, setLanguage] = useState<'default' | 'german'>('default');

  const languageSelectOptions = [
    { value: 'default', label: 'Default' },
    { value: 'german', label: 'German' },
  ];

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

  const messagesGerman = {
    'property-filter': propertyFilterMessagesGerman,
  };

  const messagesDefault = {
    'property-filter': propertyFilterMessagesDefault,
  };

  const messages = language === 'german' ? messagesGerman : messagesDefault;

  return (
    <GlobalI18NContextProvider messages={messages}>
      <Box margin="m">
        <SpaceBetween size="l">
          <FormField label="Interface language">
            <Select
              options={languageSelectOptions}
              selectedOption={languageSelectOptions.find(o => o.value === language) ?? languageSelectOptions[0]}
              onChange={event => setLanguage(event.detail.selectedOption.value as 'default' | 'german')}
            />
          </FormField>

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
        </SpaceBetween>
      </Box>
    </GlobalI18NContextProvider>
  );
}
