// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import DateRangePicker from '~components/date-range-picker/i18n';
import PropertyFilter from '~components/property-filter/i18n';
import S3ResourceSelector from '~components/s3-resource-selector/i18n';
import { allItems } from '../property-filter/table.data';
import { filteringProperties } from '../property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { I18NContextProvider } from '~components/i18n/context';
import { Box, DateRangePickerProps, FormField, SpaceBetween } from '~components';

// These are the translations provided by Cloudscape.
import germanTranslationStrings from '~components/i18n/exports/de-DE/all';

export default function () {
  const { items, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      filteringProperties,
      defaultQuery: { tokens: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }], operation: 'and' },
    },
    sorting: {},
  });

  const [selectedDateRange, setSelectedDateRange] = useState<DateRangePickerProps['value']>(null);

  return (
    <I18NContextProvider
      messages={{
        '@cloudscape-design/components': germanTranslationStrings,
      }}
    >
      <Box margin="m">
        <SpaceBetween size="xxl">
          <FormField label="Property filter">
            <PropertyFilter
              {...propertyFilterProps}
              virtualScroll={true}
              countText={`${items.length} Ergebnisse`}
              expandToViewport={true}
            />
          </FormField>

          <FormField label="Date range picker">
            <DateRangePicker
              locale="de-DE"
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
              selectableItemsTypes={['objects']}
              bucketsVisibleColumns={['CreationDate', 'Region', 'Name']}
              fetchBuckets={() => Promise.resolve([])}
              fetchObjects={() => Promise.resolve([])}
              fetchVersions={() => Promise.resolve([])}
            />
          </FormField>
        </SpaceBetween>
      </Box>
    </I18NContextProvider>
  );
}
