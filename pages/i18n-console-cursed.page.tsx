// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import DateRangePicker, { DateRangePickerProps } from '~components/date-range-picker';
import PropertyFilter from '~components/property-filter';
import S3ResourceSelector from '~components/s3-resource-selector';
import Button from '~components/button';
import { allItems } from './property-filter/table.data';
import { filteringProperties } from './property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { Box, FormField, Select, SpaceBetween } from '~components';

export default function () {
  const [locale, setLocale] = useState<'default' | 'de-DE'>('default');

  const localeSelectOptions = [
    { value: 'default', label: 'Default' },
    { value: 'de-DE', label: 'German' },
  ];

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
    <Box margin="m">
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
              i18nStrings={{
                filteringAriaLabel: 'your choice',
                dismissAriaLabel: 'Dismiss',
                filteringPlaceholder: 'Search',
                groupValuesText: 'Values',
                groupPropertiesText: 'Properties',
                operatorsText: 'Operators',
                operationAndText: 'and',
                operationOrText: 'or',
                operatorLessText: 'Less than',
                operatorLessOrEqualText: 'Less than or equal',
                operatorGreaterText: 'Greater than',
                operatorGreaterOrEqualText: 'Greater than or equal',
                operatorContainsText: 'Contains',
                operatorDoesNotContainText: 'Does not contain',
                operatorEqualsText: 'Equal',
                operatorDoesNotEqualText: 'Does not equal',
                editTokenHeader: 'Edit filter',
                propertyText: 'Property',
                operatorText: 'Operator',
                valueText: 'Value',
                cancelActionText: 'Cancel',
                applyActionText: 'Apply',
                allPropertiesLabel: 'All properties',
                tokenLimitShowMore: 'Show more',
                tokenLimitShowFewer: 'Show fewer',
                clearFiltersText: 'Clear filters',
                removeTokenButtonAriaLabel: () => 'Remove token',
                enteredTextLabel: (text: string) => `Use: "${text}"`,
              }}
            />
          </FormField>

          <FormField label={<Box color="text-status-info">date-range-picker</Box>}>
            <DateRangePicker
              locale={locale === 'default' ? 'en-GB' : locale}
              value={{ type: 'absolute', startDate: '2020-01-01', endDate: '2021-01-01' }}
              i18nStrings={{
                ariaLabel: 'Filter by a date and time range',
                todayAriaLabel: 'Today',
                nextMonthAriaLabel: 'Next month',
                previousMonthAriaLabel: 'Previous month',
                customRelativeRangeDurationLabel: 'Duration',
                customRelativeRangeDurationPlaceholder: 'Enter duration',
                customRelativeRangeOptionLabel: 'Custom range',
                customRelativeRangeOptionDescription: 'Set a custom range in the past',
                customRelativeRangeUnitLabel: 'Unit of time',
                formatRelativeRange: formatRelativeRange,
                formatUnit: (unit, value) => (value === 1 ? unit : `${unit}s`),
                dateTimeConstraintText: 'Range must be between 6 and 30 days. Use 24 hour format.',
                relativeModeTitle: 'Relative range',
                absoluteModeTitle: 'Absolute range',
                relativeRangeSelectionHeading: 'Choose a range',
                startDateLabel: 'Start date',
                endDateLabel: 'End date',
                startTimeLabel: 'Start time',
                endTimeLabel: 'End time',
                clearButtonLabel: 'Clear and dismiss',
                cancelButtonLabel: 'Cancel',
                applyButtonLabel: 'Apply',
                errorIconAriaLabel: 'Error',
                renderSelectedAbsoluteRangeAriaLive: (startDate, endDate) =>
                  `Range selected from ${startDate} to ${endDate}`,
              }}
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
              i18nStrings={{
                inContextInputPlaceholder: 's3://bucket/prefix/object',
                inContextSelectPlaceholder: 'Choose a version',
                inContextBrowseButton: 'Browse S3',
                inContextViewButton: 'View',
                inContextViewButtonAriaLabel: 'View (opens a new tab)',
                inContextLoadingText: 'Loading resource',
                inContextUriLabel: 'Resource URI',
                inContextVersionSelectLabel: 'Object version',
                modalTitle: 'Choose audio file in S3',
                modalCancelButton: 'Cancel',
                modalSubmitButton: 'Choose',
                modalBreadcrumbRootItem: 'S3 buckets',
                selectionBuckets: 'Buckets',
                selectionObjects: 'Objects',
                selectionVersions: 'Versions',
                selectionBucketsSearchPlaceholder: 'Find bucket',
                selectionObjectsSearchPlaceholder: 'Find object by prefix',
                selectionVersionsSearchPlaceholder: 'Find version',
                selectionBucketsLoading: 'Loading buckets',
                selectionBucketsNoItems: 'No buckets',
                selectionObjectsLoading: 'Loading objects',
                selectionObjectsNoItems: 'No objects',
                selectionVersionsLoading: 'Loading versions',
                selectionVersionsNoItems: 'No versions',
                filteringCounterText: count => `${count} ${count === 1 ? 'match' : 'matches'}`,
                filteringNoMatches: 'No matches',
                filteringCantFindMatch: "We can't find a match.",
                clearFilterButtonText: 'Clear filter',
                columnBucketName: 'Name',
                columnBucketCreationDate: 'Creation date',
                columnBucketRegion: 'Region',
                columnObjectKey: 'Key',
                columnObjectLastModified: 'Last modified',
                columnObjectSize: 'Size',
                columnVersionID: 'Version ID',
                columnVersionLastModified: 'Last modified',
                columnVersionSize: 'Size',
                validationPathMustBegin: 'The path must begin with s3://',
                validationBucketLowerCase: 'The bucket name must start with a lowercase character or number.',
                validationBucketMustNotContain: 'The bucket name must not contain uppercase characters.',
                validationBucketMustComplyDns: 'The bucket name must comply with DNS naming conventions',
                validationBucketLength: 'The bucket name must be from 3 to 63 characters.',
                labelSortedDescending: columnName => `${columnName}, sorted descending`,
                labelSortedAscending: columnName => `${columnName}, sorted ascending`,
                labelNotSorted: columnName => `${columnName}, not sorted`,
                labelsPagination: {
                  nextPageLabel: 'Next page',
                  previousPageLabel: 'Previous page',
                  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
                },
                labelsBucketsSelection: {
                  itemSelectionLabel: (data, item) => `${item.Name}`,
                  selectionGroupLabel: 'Buckets',
                },
                labelsObjectsSelection: {
                  itemSelectionLabel: (data, item) => `${item.Key}`,
                  selectionGroupLabel: 'Objects',
                },
                labelsVersionsSelection: {
                  itemSelectionLabel: (data, item) => `${item.LastModified}`,
                  selectionGroupLabel: 'Versions',
                },
                labelFiltering: itemsType => `Find ${itemsType}`,
                labelRefresh: 'Refresh the data',
                labelModalDismiss: 'Dismiss the modal',
                labelBreadcrumbs: 'S3 navigation',
              }}
              fetchBuckets={() => Promise.resolve([])}
              fetchObjects={() => Promise.resolve([])}
              fetchVersions={() => Promise.resolve([])}
            />
          </FormField>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}

function formatRelativeRange(range: DateRangePickerProps.RelativeValue): string {
  const unit = range.amount === 1 ? range.unit : `${range.unit}s`;
  return `Previous ${range.amount} ${unit}`;
}
