// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import DateRangePicker from '~components/date-range-picker/i18n';
import PropertyFilter from '~components/property-filter/i18n';
import S3ResourceSelector from '~components/s3-resource-selector/i18n';
import Button from '~components/button';
import { allItems } from './property-filter/table.data';
import { filteringProperties } from './property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { I18NContextProvider } from '~components/i18n/context';
import { Box, FormField, Select, SpaceBetween, Spinner } from '~components';

const componentsI18nLoader = {
  default: {
    core: () => import('~components/i18n/exports/default/core'),
    collection: () => import('~components/i18n/exports/default/collection'),
    'date-time': () => import('~components/i18n/exports/default/date-time'),
    's3-resource-selector': () => import('~components/i18n/exports/default/s3-resource-selector'),
  },
  ['de-DE']: {
    core: () => import('~components/i18n/exports/de-DE/core'),
    collection: () => import('~components/i18n/exports/de-DE/collection'),
    'date-time': () => import('~components/i18n/exports/de-DE/date-time'),
    's3-resource-selector': () => import('~components/i18n/exports/de-DE/s3-resource-selector'),
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
      componentsI18nLoader[locale]['s3-resource-selector'](),
    ]).then(([core, collection, dateTime, seResourceSelector]) => {
      setMessages({
        '@cloudscape-design/components': {
          ...core.default,
          ...collection.default,
          ...dateTime.default,
          ...seResourceSelector.default,
        },
      });
    });
  }, [locale]);

  const { items, actions, propertyFilterProps } = useCollection(allItems, {
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
              <div style={{ width: '200px' }}>
                <Select
                  options={localeSelectOptions}
                  selectedOption={localeSelectOptions.find(o => o.value === locale) ?? localeSelectOptions[0]}
                  onChange={event => setLocale(event.detail.selectedOption.value as 'default' | 'de-DE')}
                />
              </div>
            </FormField>

            <SpaceBetween size="m">
              <FormField label={<Box color="text-status-info">property-filter</Box>}>
                <PropertyFilter
                  {...propertyFilterProps}
                  virtualScroll={true}
                  countText={`${items.length} matches`}
                  expandToViewport={true}
                />
              </FormField>

              <FormField label={<Box color="text-status-info">date-range-picker</Box>}>
                <DateRangePicker
                  locale={locale === 'default' ? 'en-GB' : locale}
                  value={{ type: 'absolute', startDate: '2020-01-01', endDate: '2021-01-01' }}
                  i18nStrings={{} as any}
                  placeholder="Filter by a date and time range"
                  onChange={() => undefined}
                  relativeOptions={[]}
                  isValidRange={() => ({} as any)}
                />
              </FormField>

              <FormField label={<Box color="text-status-info">s3-resource-selector</Box>}>
                <S3ResourceSelector
                  resource={{ uri: '' }}
                  viewHref=""
                  selectableItemsTypes={['objects']}
                  bucketsVisibleColumns={['CreationDate', 'Region', 'Name']}
                  i18nStrings={
                    {
                      labelFiltering: (itemsType: string) => `Find ${itemsType}`,
                    } as any
                  }
                  fetchBuckets={() => Promise.resolve([])}
                  fetchObjects={() => Promise.resolve([])}
                  fetchVersions={() => Promise.resolve([])}
                />
              </FormField>
            </SpaceBetween>
          </SpaceBetween>
        ) : (
          <Spinner />
        )}
      </Box>
    </I18NContextProvider>
  );
}
