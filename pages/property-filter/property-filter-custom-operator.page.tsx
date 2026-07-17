// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import PropertyFilter from '~components/property-filter';
import { PropertyFilterProps } from '~components/property-filter/interfaces';

interface Item {
  name: string;
  env: string;
  owner: string;
  created: string;
  priority: number;
}

const allItems: Item[] = [
  { name: 'app-web-prod', env: 'production', owner: 'alice', created: '2025-01-15', priority: 1 },
  { name: 'app-api-prod', env: 'production', owner: 'bob', created: '2025-03-20', priority: 2 },
  { name: 'app-worker-staging', env: 'staging', owner: 'alice', created: '2025-06-01', priority: 3 },
  { name: 'app-web-dev', env: 'development', owner: 'charlie', created: '2025-08-10', priority: 1 },
  { name: 'svc-auth-prod', env: 'production', owner: 'bob', created: '2024-11-05', priority: 2 },
  { name: 'svc-data-staging', env: 'staging', owner: 'charlie', created: '2025-02-28', priority: 3 },
];

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  // Demo 1: Custom symbolic operators (~, !~)
  {
    key: 'name',
    propertyLabel: 'Name',
    groupValuesLabel: 'Name values',
    operators: [
      '=',
      '!=',
      ':',
      '!:',
      {
        operator: '~',
        match: (itemValue: unknown, tokenValue: unknown) => {
          try {
            return new RegExp(String(tokenValue)).test(String(itemValue));
          } catch {
            return String(itemValue).toLowerCase().includes(String(tokenValue).toLowerCase());
          }
        },
        description: 'Matches regular expression',
      },
      {
        operator: '!~',
        match: (itemValue: unknown, tokenValue: unknown) => {
          try {
            return !new RegExp(String(tokenValue)).test(String(itemValue));
          } catch {
            return !String(itemValue).toLowerCase().includes(String(tokenValue).toLowerCase());
          }
        },
        description: 'Does not match regular expression',
      },
    ],
  },
  // Demo 2: Description override on predefined operators (> = "After", < = "Before")
  {
    key: 'created',
    propertyLabel: 'Created',
    groupValuesLabel: 'Created values',
    operators: [
      { operator: '=', description: 'On' },
      { operator: '>', description: 'After', match: 'date' as const },
      { operator: '<', description: 'Before', match: 'date' as const },
      { operator: '>=', description: 'On or after', match: 'date' as const },
      { operator: '<=', description: 'On or before', match: 'date' as const },
    ],
  },
  // Demo 3: Text-based operators (in, NOT IN)
  {
    key: 'env',
    propertyLabel: 'Environment',
    groupValuesLabel: 'Environment values',
    operators: [
      '=',
      '!=',
      {
        operator: 'in',
        match: (itemValue: unknown, tokenValue: unknown) => {
          const values = String(tokenValue)
            .split(',')
            .map(v => v.trim().toLowerCase());
          return values.includes(String(itemValue).toLowerCase());
        },
        description: 'Is one of',
      },
      {
        operator: 'NOT IN',
        match: (itemValue: unknown, tokenValue: unknown) => {
          const values = String(tokenValue)
            .split(',')
            .map(v => v.trim().toLowerCase());
          return !values.includes(String(itemValue).toLowerCase());
        },
        description: 'Is not one of',
      },
    ],
  },
  {
    key: 'owner',
    propertyLabel: 'Owner',
    groupValuesLabel: 'Owner values',
    operators: ['=', '!='],
  },
  {
    key: 'priority',
    propertyLabel: 'Priority',
    groupValuesLabel: 'Priority values',
    operators: ['=', '!=', '>', '<', '>=', '<='],
  },
];

const filteringOptions: PropertyFilterProps.FilteringOption[] = [...new Set(allItems.map(i => i.name))]
  .map(v => ({ propertyKey: 'name', value: v }))
  .concat([...new Set(allItems.map(i => i.env))].map(v => ({ propertyKey: 'env', value: v })))
  .concat([...new Set(allItems.map(i => i.owner))].map(v => ({ propertyKey: 'owner', value: v })))
  .concat([...new Set(allItems.map(i => String(i.priority)))].map(v => ({ propertyKey: 'priority', value: v })));

export default function CustomOperatorDemo() {
  const { items, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      filteringProperties,
    },
  });

  return (
    <I18nProvider locale="en" messages={[messages]}>
      <div style={{ padding: 20 }}>
        <h1>Property Filter — Custom Operator Demo</h1>

        <PropertyFilter
          {...propertyFilterProps}
          filteringOptions={filteringOptions}
          freeTextFiltering={{ operators: [':', '!:', '~', 'in'] }}
          i18nStrings={{
            filteringAriaLabel: 'Filter instances',
            dismissAriaLabel: 'Dismiss',
            filteringPlaceholder: 'Filter instances',
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
            operatorEqualsText: 'Equals',
            operatorDoesNotEqualText: 'Does not equal',
            operatorStartsWithText: 'Starts with',
            operatorDoesNotStartWithText: 'Does not start with',
            editTokenHeader: 'Edit filter',
            propertyText: 'Property',
            operatorText: 'Operator',
            valueText: 'Value',
            cancelActionText: 'Cancel',
            applyActionText: 'Apply',
            clearFiltersText: 'Clear filters',
            removeTokenButtonAriaLabel: token =>
              `Remove filter, ${token.propertyLabel} ${token.operator} ${token.value}`,
            enteredTextLabel: text => `Use: "${text}"`,
          }}
        />

        <h2>
          Filtered items ({items.length} / {allItems.length})
        </h2>
        <h3>Current query</h3>
        <pre>{JSON.stringify(propertyFilterProps.query, null, 2)}</pre>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 8 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Environment</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Owner</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Created</th>
              <th style={{ border: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.name}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.env}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.owner}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.created}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </I18nProvider>
  );
}
