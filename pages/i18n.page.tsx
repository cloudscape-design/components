// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import Box from '~components/box';
import Table from '~components/table';
import DateRangePicker from '~components/date-range-picker/i18n';
import PropertyFilter from '~components/property-filter/i18n';
import Header from '~components/header';
import Button from '~components/button';
import { allItems, TableItem } from './property-filter/table.data';
import { columnDefinitions, filteringProperties } from './property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { I18NContextProvider } from '~components/i18n/context';
import { FormField, Select, SpaceBetween, Spinner } from '~components';

const componentsI18nLoader = {
  default: {
    core: () => import('~components/i18n/exports/default/core'),
    collection: () => import('~components/i18n/exports/default/collection'),
    'date-time': () => import('~components/i18n/exports/default/date-time'),
  },
  ['de-DE']: {
    core: () => import('~components/i18n/exports/de-DE/core'),
    collection: () => import('~components/i18n/exports/de-DE/collection'),
    'date-time': () => import('~components/i18n/exports/de-DE/date-time'),
  },
};

export default function () {
  const [locale, setLocale] = useState<'default' | 'de-DE'>('default');

  const localeSelectOptions = [
    { value: 'default', label: 'Default' },
    { value: 'de-DE', label: 'German' },
  ];

  const [messages, setMessages] = useState<null | {
    [namespace: string]: Record<string, any>;
  }>(null);

  useEffect(() => {
    Promise.all([
      componentsI18nLoader[locale].core(),
      componentsI18nLoader[locale].collection(),
      componentsI18nLoader[locale]['date-time'](),
    ]).then(([core, collection, dateTime]) => {
      setMessages({
        '@cloudscape-design/components': { ...core.default, ...collection.default, ...dateTime.default },
      });
    });
  }, [locale]);

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
    <I18NContextProvider messages={messages ?? {}}>
      <Box margin="m">
        {messages ? (
          <SpaceBetween size="l">
            <FormField label="Interface language">
              <Select
                options={localeSelectOptions}
                selectedOption={localeSelectOptions.find(o => o.value === locale) ?? localeSelectOptions[0]}
                onChange={event => setLocale(event.detail.selectedOption.value as 'default' | 'de-DE')}
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
                  expandToViewport={true}
                  i18nStrings={{} as any}
                  customControl={
                    <DateRangePicker
                      locale={locale === 'default' ? 'en-GB' : locale}
                      value={{ type: 'absolute', startDate: '2020-01-01', endDate: '2021-01-01' }}
                      i18nStrings={{} as any}
                      placeholder="Filter by a date and time range"
                      onChange={() => undefined}
                      relativeOptions={[]}
                      isValidRange={() => ({} as any)}
                    />
                  }
                />
              }
              columnDefinitions={columnDefinitions.slice(0, 2)}
            />
          </SpaceBetween>
        ) : (
          <Spinner />
        )}
      </Box>
    </I18NContextProvider>
  );
}
