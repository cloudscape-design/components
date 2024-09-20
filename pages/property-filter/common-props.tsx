// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PropertyFilterProps } from '~components/property-filter';

import {
  DateForm,
  DateTimeForm,
  DateTimeFormLegacy,
  formatDateTime,
  formatOwners,
  OwnerMultiSelectForm,
  YesNoForm,
  yesNoFormat,
} from './custom-forms';
import { states, TableItem } from './table.data';

const getStateLabel = (value: TableItem['state']) => (value !== undefined && states[value]) || 'Unknown';

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
    getLabel: getStateLabel,
    propertyLabel: 'State',
    cell: (item: TableItem) => getStateLabel(item.state),
  },
  {
    id: 'stopped',
    sortingField: 'stopped',
    header: 'Stopped',
    type: 'boolean',
    propertyLabel: 'Stopped',
    cell: (item: TableItem) => item.state === 0,
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
].map((item, ind) => ({ order: ind + 1, ...item }));

export const labels = {
  filteringAriaLabel: 'your choice',
  filteringPlaceholder: 'Search',
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
    operators = ['=', '!='].map(operator => ({ operator, format: def.getLabel }));
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

  // This is not recommended as it nests
  if (def.id === 'owner') {
    operators = [
      {
        operator: '=',
        form: OwnerMultiSelectForm,
        format: formatOwners,
        match: (itemValue: string, tokenValue: string[]) =>
          Array.isArray(tokenValue) && tokenValue.some(value => itemValue === value),
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
