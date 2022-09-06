// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PropertyFilterProps } from '~components/property-filter';
import { DatePickerEmbedded } from '~components/date-picker/embedded';
import DateInput from '~components/internal/components/date-input';
import { FormField, SpaceBetween, TimeInput } from '~components';
import { padStart } from 'lodash';
import { TableItem } from './table.data';

export const columnDefinitions = [
  {
    id: 'instanceid',
    sortingField: 'instanceid',
    header: 'Instance ID',
    type: 'text',
    propertyLabel: 'Instance ID',
    cell: (item: TableItem) => item.instanceid,
  },
  {
    id: 'state',
    sortingField: 'state',
    header: 'State',
    type: 'text',
    propertyLabel: 'State',
    cell: (item: TableItem) => item.state,
  },
  {
    id: 'instancetype',
    sortingField: 'instancetype',
    header: 'Instance type',
    type: 'text',
    propertyLabel: 'Instance type',
    cell: (item: TableItem) => item.instancetype,
  },
  {
    id: 'averagelatency',
    sortingField: 'averagelatency',
    header: 'Average latency (mb/s)',
    type: 'number',
    propertyLabel: 'Average latency',
    cell: (item: TableItem) => item.averagelatency,
  },
  {
    id: 'availablestorage',
    sortingField: 'availablestorage',
    header: 'Available storage (GiB)',
    type: 'number',
    propertyLabel: 'Available storage',
    cell: (item: TableItem) => item.availablestorage,
  },
  {
    id: 'owner',
    sortingField: 'owner',
    header: 'Owner',
    type: 'text',
    propertyLabel: 'Owner',
    cell: (item: TableItem) => item.owner,
  },
  {
    id: 'privateipaddress',
    sortingField: 'privateipaddress',
    header: 'Private IP address',
    type: 'text',
    propertyLabel: 'Private IP address',
    cell: (item: TableItem) => item.privateipaddress,
  },
  {
    id: 'publicdns',
    sortingField: 'publicdns',
    header: 'Public DNS',
    type: 'text',
    propertyLabel: 'Public DNS',
    cell: (item: TableItem) => item.publicdns,
  },
  {
    id: 'ipv4publicip',
    sortingField: 'ipv4publicip',
    header: 'IPV4 public IP',
    type: 'text',
    propertyLabel: 'IPV4 public IP',
    cell: (item: TableItem) => item.ipv4publicip,
  },
  {
    id: 'securitygroup',
    sortingField: 'securitygroup',
    header: 'Security group',
    type: 'text',
    propertyLabel: 'Security group',
    cell: (item: TableItem) => item.securitygroup,
  },
  {
    id: 'launchdate',
    sortingField: 'launchdate',
    header: 'Launch date',
    type: 'date',
    propertyLabel: 'Launch date',
    cell: (item: TableItem) => item.launchdate,
  },
  {
    id: 'lasteventat',
    sortingField: 'lasteventat',
    header: 'Last event occurrence',
    type: 'datetime',
    propertyLabel: 'Last event occurrence',
    cell: (item: TableItem) => item.lasteventat,
  },
].map((item, ind) => ({ order: ind + 1, ...item }));

export const i18nStrings: PropertyFilterProps.I18nStrings = {
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
};

function parseValue(originalValue: null | string, defaultTime = '00:00:00'): { dateValue: string; timeValue: string } {
  const [datePart = '', timePart = ''] = (originalValue ?? '').split('T');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  let dateValue = '';
  if (!isNaN(Number(year)) && Number(year) > 1970) {
    dateValue += year + '-';
    if (!isNaN(Number(month)) && Number(month) > 0) {
      dateValue += padStart(month, 2, '0') + '-';
      if (!isNaN(Number(day)) && Number(day) > 0) {
        dateValue += padStart(day, 2, '0');
      }
    }
  }

  let timeValue = '';
  if (!isNaN(Number(hours)) && Number(hours) > 0) {
    timeValue += hours + ':';
  } else {
    timeValue += '00:';
  }
  if (!isNaN(Number(minutes)) && Number(minutes) > 0) {
    timeValue += padStart(minutes, 2, '0') + ':';
  } else {
    timeValue += '00:';
  }
  if (!isNaN(Number(seconds)) && Number(seconds) > 0) {
    timeValue += padStart(seconds, 2, '0');
  } else {
    timeValue += '00';
  }

  if (timeValue === '00:00:00') {
    timeValue = defaultTime;
  }

  return { dateValue, timeValue };
}

const DateTimeForm: PropertyFilterProps.CustomOperatorForm<string> = ({ filter, operator, value, onChange }) => {
  const defaultTime = operator === '<' || operator === '>=' ? '00:00:00' : '23:59:59';
  const parsedFilter = parseValue(filter, defaultTime);
  const parsedValue = parseValue(value, defaultTime);

  const onChangeDate = (dateValue: string) => {
    if (!dateValue) {
      onChange(null);
    } else {
      const timeValue = value ? parsedValue.timeValue : parsedFilter.timeValue;
      onChange(dateValue + 'T' + timeValue);
    }
  };

  const onChangeTime = (timeValue: string) => {
    const dateValue = value ? parsedValue.dateValue : parsedFilter.dateValue;
    if (!timeValue) {
      onChange(dateValue + 'T' + '00:00:00');
    } else {
      onChange(dateValue + 'T' + timeValue);
    }
  };

  return (
    <SpaceBetween direction="horizontal" size="s">
      <DatePickerEmbedded
        value={value ? parsedValue.dateValue : parsedFilter.dateValue}
        locale={'en-EN'}
        previousMonthAriaLabel={'Previous month'}
        nextMonthAriaLabel={'Next month'}
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />

      <SpaceBetween direction="vertical" size="s">
        <FormField label="Date">
          <DateInput
            name="date"
            ariaLabel="Enter the date in YYYY/MM/DD"
            placeholder="YYYY/MM/DD"
            onChange={event => onChangeDate(event.detail.value)}
            value={value ? parsedValue.dateValue : parsedFilter.dateValue}
            disableAutocompleteOnBlur={true}
          />
        </FormField>

        <FormField label="Time">
          <TimeInput
            format="hh:mm:ss"
            placeholder="hh:mm:ss"
            ariaLabel="time-input"
            value={value ? parsedValue.timeValue : parsedFilter.timeValue}
            onChange={event => onChangeTime(event.detail.value)}
          />
        </FormField>
      </SpaceBetween>
    </SpaceBetween>
  );
};

const DateForm: PropertyFilterProps.CustomOperatorForm<string> = ({ filter, value, onChange }) => {
  const parsedFilter = parseValue(filter);
  const parsedValue = parseValue(value);

  const onChangeDate = (dateValue: string) => {
    onChange(dateValue || null);
  };

  return (
    <SpaceBetween direction="horizontal" size="s">
      <DatePickerEmbedded
        value={value ? parsedValue.dateValue : parsedFilter.dateValue}
        locale={'en-EN'}
        previousMonthAriaLabel={'Previous month'}
        nextMonthAriaLabel={'Next month'}
        todayAriaLabel="Today"
        onChange={event => onChangeDate(event.detail.value)}
      />

      <FormField label="Date">
        <DateInput
          name="date"
          ariaLabel="Enter the date in YYYY/MM/DD"
          placeholder="YYYY/MM/DD"
          onChange={event => onChangeDate(event.detail.value)}
          value={value ? parsedValue.dateValue : parsedFilter.dateValue}
          disableAutocompleteOnBlur={true}
        />
      </FormField>
    </SpaceBetween>
  );
};

export const filteringProperties: readonly any[] = columnDefinitions.map(def => {
  let operators: any[] = [];
  let defaultOperator: PropertyFilterProps.ComparisonOperator = '=';

  if (def.type === 'text') {
    operators = ['=', '!=', ':', '!:'];
  }

  if (def.type === 'number') {
    operators = ['=', '!=', '>', '<', '<=', '>='];
  }

  if (def.type === 'date') {
    operators = [
      {
        operator: '=',
        form: DateForm,
        match: 'date',
      },
      {
        operator: '!=',
        form: DateForm,
        match: 'date',
      },
      {
        operator: '>',
        form: DateForm,
        match: 'date',
      },
      {
        operator: '<',
        form: DateForm,
        match: 'date',
      },
      {
        operator: '<=',
        form: DateForm,
        match: 'date',
      },
      {
        operator: '>=',
        form: DateForm,
        match: 'date',
      },
    ];
  }

  if (def.type === 'datetime') {
    defaultOperator = '>';
    operators = [
      {
        operator: '>',
        form: DateTimeForm,
        match: 'date',
      },
      {
        operator: '<',
        form: DateTimeForm,
        match: 'date',
      },
      {
        operator: '<=',
        form: DateTimeForm,
        match: 'date',
      },
      {
        operator: '>=',
        form: DateTimeForm,
        match: 'date',
      },
    ];
  }

  return {
    key: def.id,
    operators: operators,
    defaultOperator,
    propertyLabel: def.propertyLabel,
    groupValuesLabel: `${def.propertyLabel} values`,
  };
});
