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
import { Box, FormField, SpaceBetween, Spinner } from '~components';
import { i18nStrings as dateRangePickerI18nStrings } from './date-range-picker/common';

export default function () {
  const [messages, setMessages] = useState<null | {
    [namespace: string]: Record<string, any>;
  }>(null);

  useEffect(() => {
    import('~components/i18n/exports/de-DE/all').then(messages => {
      setMessages({
        '@cloudscape-design/components': { ...messages.default },
      });
    });
  }, []);

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
            <SpaceBetween size="m">
              <FormField label={<Box color="text-status-info">property-filter</Box>}>
                <PropertyFilter
                  {...propertyFilterProps}
                  virtualScroll={true}
                  countText={`${items.length} matches`}
                  expandToViewport={true}
                  i18nStrings={{} as any}
                />
              </FormField>

              <FormField label={<Box color="text-status-info">date-range-picker</Box>}>
                <DateRangePicker
                  locale="de-DE"
                  value={{ type: 'absolute', startDate: '2020-01-01', endDate: '2021-01-01' }}
                  i18nStrings={
                    {
                      formatUnit: dateRangePickerI18nStrings.formatUnit,
                    } as any
                  }
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
