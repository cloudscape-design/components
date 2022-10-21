// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import DateRangePicker from '~components/date-range-picker/i18n';
import PropertyFilter from '~components/property-filter/i18n';
import S3ResourceSelector from '~components/s3-resource-selector/i18n';
import { allItems } from './property-filter/table.data';
import { filteringProperties } from './property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { I18NContextProvider } from '~components/i18n/context';
import { Box, DateRangePickerProps, FormField, Select, SpaceBetween, Spinner } from '~components';

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

const localeSelectOptions = [
  { value: 'default', label: 'Default' },
  { value: 'de-DE', label: 'German' },
];

export default function () {
  const [locale, setLocale] = useState<'default' | 'de-DE'>('default');

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

  const { items, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      filteringProperties,
      defaultQuery: { tokens: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }], operation: 'and' },
    },
    sorting: {},
  });
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePickerProps['value']>(null);

  return (
    <I18NContextProvider messages={messages ?? {}}>
      <Box margin="m">
        {messages ? (
          <SpaceBetween size="xxl">
            <FormField label="Interface language">
              <div style={{ width: '200px' }}>
                <Select
                  options={localeSelectOptions}
                  selectedOption={localeSelectOptions.find(o => o.value === locale) ?? localeSelectOptions[0]}
                  onChange={event => setLocale(event.detail.selectedOption.value as 'default' | 'de-DE')}
                />
              </div>
            </FormField>

            <hr />

            <FormField label="Property filter">
              <PropertyFilter
                {...propertyFilterProps}
                virtualScroll={true}
                countText={locale === 'default' ? `${items.length} matches` : `${items.length} Ergebnisse`}
                expandToViewport={true}
              />
            </FormField>

            <FormField label="Date range picker">
              <DateRangePicker
                locale={locale === 'default' ? 'en-GB' : locale}
                value={selectedDateRange}
                onChange={event => setSelectedDateRange(event.detail.value)}
                relativeOptions={[
                  {
                    key: 'previous-1-hour',
                    amount: 1,
                    unit: 'hour',
                    type: 'relative',
                  },
                  {
                    key: 'previous-6-hours',
                    amount: 6,
                    unit: 'hour',
                    type: 'relative',
                  },
                ]}
                isValidRange={() => ({ valid: true })}
              />
            </FormField>

            <FormField>
              <S3ResourceSelector
                resource={{ uri: '' }}
                viewHref=""
                selectableItemsTypes={['objects']}
                bucketsVisibleColumns={['CreationDate', 'Region', 'Name']}
                fetchBuckets={() => Promise.resolve([])}
                fetchObjects={() => Promise.resolve([])}
                fetchVersions={() => Promise.resolve([])}
              />
            </FormField>
          </SpaceBetween>
        ) : (
          <Spinner />
        )}
      </Box>
    </I18NContextProvider>
  );
}
