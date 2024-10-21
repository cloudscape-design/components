// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Badge, SpaceBetween } from '~components';
import { PropertyFilterProps } from '~components/property-filter';

import { DateForm, DateTimeForm, DateTimeFormLegacy, formatDateTime, YesNoForm, yesNoFormat } from './custom-forms';
import { states, TableItem } from './table.data';

const getStateLabel = (value: TableItem['state'], fallback = 'Invalid value') =>
  (value !== undefined && states[value]) || fallback;

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
    type: 'enum',
    getLabel: (value: any) =>
      Array.isArray(value) ? value.map(v => getStateLabel(v)).join(', ') : getStateLabel(value, value),
    propertyLabel: 'State',
    cell: (item: TableItem) => getStateLabel(item.state),
  },
  {
    id: 'stopped',
    sortingField: 'stopped',
    header: 'Stopped',
    type: 'boolean',
    propertyLabel: 'Stopped',
    cell: (item: TableItem) => item.state === 'STOPPED',
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
    type: 'enum',
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
    id: 'releasedate',
    sortingField: 'releasedate',
    header: 'Release date',
    type: 'date',
    propertyLabel: 'Release date',
    cell: (item: TableItem) => item.releasedate?.toISOString(),
  },
  {
    id: 'launchdate',
    sortingField: 'launchdate',
    header: 'Launch date',
    type: 'date',
    propertyLabel: 'Launch date',
    cell: (item: TableItem) => item.launchdate?.toISOString(),
  },
  {
    id: 'lasteventat',
    sortingField: 'lasteventat',
    header: 'Last event occurrence',
    type: 'datetime',
    propertyLabel: 'Last event occurrence',
    cell: (item: TableItem) => item.lasteventat?.toISOString(),
  },
  {
    id: 'lasteventat-legacy',
    sortingField: 'lasteventat',
    header: 'Last event occurrence (legacy)',
    type: 'datetime-legacy',
    propertyLabel: 'Last event occurrence (legacy)',
    cell: (item: TableItem) => item.lasteventat?.toISOString(),
  },
  {
    id: 'tags',
    sortingField: 'tagsIndex',
    header: 'Tags',
    type: 'enum',
    propertyLabel: 'Tags',
    minWidth: 150,
    cell: (item: TableItem) => (
      <SpaceBetween size="s" direction="horizontal">
        {(item.tags ?? []).map(tag => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </SpaceBetween>
    ),
  },
].map((item, ind) => ({ order: ind + 1, ...item }));

export const labels = {
  filteringAriaLabel: 'your choice',
  filteringPlaceholder: 'Search',
  filteringLoadingText: 'Loading suggestions',
  filteringErrorText: 'Error fetching results.',
  filteringRecoveryText: 'Retry',
  filteringFinishedText: 'End of results',
  filteringEmpty: 'No suggestions found',
};

export const i18nStrings: PropertyFilterProps.I18nStrings = {
  dismissAriaLabel: 'Dismiss',

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
  operatorStartsWithText: 'Starts with',
  operatorDoesNotStartWithText: 'Does not starts with',

  editTokenHeader: 'Edit filter',
  propertyText: 'Property',
  operatorText: 'Operator',
  valueText: 'Value',
  cancelActionText: 'Cancel',
  applyActionText: 'Apply',
  allPropertiesLabel: 'All properties',
  clearAriaLabel: 'Clear',

  tokenLimitShowMore: 'Show more',
  tokenLimitShowFewer: 'Show fewer',
  clearFiltersText: 'Clear filters',
  tokenOperatorAriaLabel: 'Boolean Operator',
  enteredTextLabel: (text: string) => `Use: "${text}"`,

  formatToken,
  removeTokenButtonAriaLabel: token => `Remove token, ${formatToken(token)}`,

  groupEditAriaLabel: group => `Edit group with ${group.tokens.length} tokens`,
  tokenEditorTokenActionsAriaLabel: token => `Filter remove actions for ${formatToken(token)}`,
  tokenEditorTokenRemoveAriaLabel: token => `Remove filter, ${formatToken(token)}`,
  tokenEditorTokenRemoveLabel: 'Remove filter',
  tokenEditorTokenRemoveFromGroupLabel: 'Remove filter from group',
  tokenEditorAddNewTokenLabel: 'Add new filter',
  tokenEditorAddTokenActionsAriaLabel: 'Add filter actions',
  tokenEditorAddExistingTokenAriaLabel: token => `Add filter ${formatToken(token)} to group`,
  tokenEditorAddExistingTokenLabel: token => `Add filter ${getTokenLabel(token)} to group`,
};

function getTokenLabel(token: PropertyFilterProps.FormattedToken) {
  return `${token.propertyLabel} ${token.operator} ${token.value}`;
}

function formatToken(token: PropertyFilterProps.FormattedToken) {
  return `${token.propertyLabel} ${operatorToLabel(token.operator)} ${token.value}`;
}

function operatorToLabel(operator: string) {
  switch (operator) {
    case '=':
      return i18nStrings.operatorEqualsText;
    case '!=':
      return i18nStrings.operatorDoesNotEqualText;
    case '>':
      return i18nStrings.operatorGreaterText;
    case '>=':
      return i18nStrings.operatorGreaterOrEqualText;
    case '<':
      return i18nStrings.operatorLessText;
    case '<=':
      return i18nStrings.operatorLessOrEqualText;
    case ':':
      return i18nStrings.operatorContainsText;
    case '!:':
      return i18nStrings.operatorDoesNotContainText;
    case '^':
      return i18nStrings.operatorStartsWithText;
    case '!^':
      return i18nStrings.operatorDoesNotStartWithText;
    default:
      return operator;
  }
}

export const filteringProperties: readonly PropertyFilterProps.FilteringProperty[] = columnDefinitions.map(def => {
  let operators: any[] = [];
  let defaultOperator: PropertyFilterProps.ComparisonOperator = '=';
  let groupValuesLabel = `${def.propertyLabel} values`;

  if (def.type === 'enum') {
    operators = [
      ...['=', '!='].map(operator => ({ operator, format: def.getLabel, tokenType: 'enum' })),
      ...[':', '!:'].map(operator => ({ operator, format: def.getLabel, tokenType: 'value' })),
    ];
  }
  if (def.id === 'tags') {
    const format = (value: string[]) =>
      value.length <= 5 ? value.join(', ') : [...value.slice(0, 5), `${value.length - 5} more`].join(', ');
    operators = [
      { operator: '=', tokenType: 'enum', format, match: (v: unknown[], t: unknown[]) => checkArrayMatches(v, t) },
      { operator: '!=', tokenType: 'enum', format, match: (v: unknown[], t: unknown[]) => !checkArrayMatches(v, t) },
      { operator: ':', tokenType: 'enum', format, match: (v: unknown[], t: unknown[]) => checkArrayContains(v, t) },
      { operator: '!:', tokenType: 'enum', format, match: (v: unknown[], t: unknown[]) => !checkArrayContains(v, t) },
    ];
  }

  if (def.type === 'text') {
    operators = ['=', '!=', ':', '!:'];
  }

  if (def.type === 'number') {
    operators = ['=', '!=', '>', '<', '<=', '>='];
  }

  if (def.type === 'date') {
    groupValuesLabel = `${def.propertyLabel} value`;
    operators = ['=', '!=', '<', '<=', '>', '>='].map(operator => ({
      operator,
      form: DateForm,
      match: 'date',
    }));
  }

  if (def.type === 'datetime' || def.type === 'datetime-legacy') {
    groupValuesLabel = `${def.propertyLabel} value`;
    defaultOperator = '>';
    operators = ['<', '<=', '>', '>='].map(operator => ({
      operator,
      form: def.type === 'datetime' ? DateTimeForm : DateTimeFormLegacy,
      format: formatDateTime,
      match: 'datetime',
    }));
  }

  if (def.type === 'boolean') {
    groupValuesLabel = `${def.propertyLabel} value`;
    operators = [
      {
        operator: '=',
        form: YesNoForm,
        format: yesNoFormat,
        match: (itemValue: boolean, tokenValue: boolean) => itemValue === tokenValue,
      },
    ];
  }

  return {
    key: def.id,
    operators: operators,
    defaultOperator,
    propertyLabel: def.propertyLabel,
    groupValuesLabel,
  };
});

function checkArrayMatches(value: unknown[], token: unknown[]) {
  if (!Array.isArray(value) || !Array.isArray(token) || value.length !== token.length) {
    return false;
  }
  const valuesMap = value.reduce<Map<unknown, number>>(
    (map, value) => map.set(value, (map.get(value) ?? 0) + 1),
    new Map()
  );
  for (const tokenEntry of token) {
    const count = valuesMap.get(tokenEntry);
    if (count) {
      count === 1 ? valuesMap.delete(tokenEntry) : valuesMap.set(tokenEntry, count - 1);
    } else {
      return false;
    }
  }
  return valuesMap.size === 0;
}

function checkArrayContains(value: unknown[], token: unknown[]) {
  if (!Array.isArray(value) || !Array.isArray(token)) {
    return false;
  }
  const valuesSet = new Set(value);
  for (const tokenEntry of token) {
    if (!valuesSet.has(tokenEntry)) {
      return false;
    }
  }
  return true;
}
