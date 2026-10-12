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
}

const allItems: Item[] = [
  { name: 'app-web-prod', env: 'production', owner: 'alice' },
  { name: 'app-api-prod', env: 'production', owner: 'bob' },
  { name: 'app-worker-staging', env: 'staging', owner: 'alice' },
  { name: 'app-web-dev', env: 'development', owner: 'charlie' },
  { name: 'svc-auth-prod', env: 'production', owner: 'bob' },
  { name: 'svc-data-staging', env: 'staging', owner: 'charlie' },
];

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'name', propertyLabel: 'Name', groupValuesLabel: 'Name values', operators: ['=', '!=', ':', '!:'] },
  { key: 'env', propertyLabel: 'Environment', groupValuesLabel: 'Environment values', operators: ['=', '!='] },
  { key: 'owner', propertyLabel: 'Owner', groupValuesLabel: 'Owner values', operators: ['=', '!='] },
];

const filteringOptions: PropertyFilterProps.FilteringOption[] = [...new Set(allItems.map(i => i.name))]
  .map(v => ({ propertyKey: 'name', value: v }))
  .concat([...new Set(allItems.map(i => i.env))].map(v => ({ propertyKey: 'env', value: v })))
  .concat([...new Set(allItems.map(i => i.owner))].map(v => ({ propertyKey: 'owner', value: v })));

// Free-text filtering that lets consumers control the operator used for free text:
// - `defaultOperator: '='` makes plain typed text an exact-match token instead of the default "contains".
// - each operator carries a custom `description` shown in the operator dropdown.
// - `~` is a custom free-text operator string with its own `match` function and `description`.
const freeTextFiltering: PropertyFilterProps.FreeTextFiltering = {
  defaultOperator: '=',
  operators: [
    { operator: '=', description: 'Exact match' },
    { operator: ':', description: 'Contains' },
    { operator: '^', description: 'Starts with' },
    {
      operator: '~',
      description: 'Matches regular expression',
      match: (itemValue: unknown, tokenValue: unknown) => {
        try {
          return new RegExp(String(tokenValue)).test(String(itemValue));
        } catch {
          return String(itemValue).toLowerCase().includes(String(tokenValue).toLowerCase());
        }
      },
    },
  ],
};

export default function FreeTextOperatorDemo() {
  const { items, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: { filteringProperties },
  });

  return (
    <I18nProvider locale="en" messages={[messages]}>
      <div style={{ padding: 20 }}>
        <h1>Property Filter — Free-text operator demo</h1>
        <p>
          Open the operator dropdown of a free-text token (or create one by typing) to see consumer-controlled operators
          with custom descriptions, including the custom <code>~</code> operator.
        </p>

        <PropertyFilter
          {...propertyFilterProps}
          filteringOptions={filteringOptions}
          freeTextFiltering={freeTextFiltering}
          i18nStrings={{
            filteringAriaLabel: 'Filter instances',
            dismissAriaLabel: 'Dismiss',
            filteringPlaceholder: 'Filter instances',
            groupValuesText: 'Values',
            groupPropertiesText: 'Properties',
            operatorsText: 'Operators',
            operationAndText: 'and',
            operationOrText: 'or',
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
            allPropertiesLabel: 'All properties',
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
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.name}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.env}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </I18nProvider>
  );
}
