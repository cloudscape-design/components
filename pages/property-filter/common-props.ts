// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PropertyFilterProps } from '~components/property-filter';
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
    id: 'stopped',
    sortingField: 'stopped',
    header: 'Stopped',
    type: 'boolean',
    propertyLabel: 'Stopped',
    cell: (item: TableItem) => item.state === 'Stopped',
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

export const filteringProperties: readonly PropertyFilterProps.FilteringProperty[] = columnDefinitions.map(def => ({
  key: def.id,
  operators: def.type === 'text' ? [':', '!:'] : ['=', '!=', '>', '<', '<=', '>='],
  ...(def.type === 'text' ? { defaultOperator: ':' } : {}),
  propertyLabel: def.propertyLabel,
  groupValuesLabel: `${def.propertyLabel} values`,
}));
