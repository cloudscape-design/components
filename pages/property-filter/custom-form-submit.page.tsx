// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Input from '~components/input';
import PropertyFilter from '~components/property-filter';
import { PropertyFilterProps } from '~components/property-filter/interfaces';

import { i18nStrings } from './common-props';

interface Item {
  name: string;
  score: number;
}

const allItems: Item[] = [
  { name: 'alpha', score: 10 },
  { name: 'beta', score: 20 },
  { name: 'gamma', score: 30 },
  { name: 'delta', score: 40 },
];

// Custom form using a Cloudscape Input. The standard Input does not submit the property filter form on
// "Enter" by itself, so we use the injected `submit` callback to apply the token on "Enter" — mirroring
// the built-in behaviour of components such as DatePicker.
function ScoreForm({ value, onChange, submit }: PropertyFilterProps.ExtendedOperatorFormProps<string>) {
  return (
    <Input
      type="number"
      value={value ?? ''}
      placeholder="Enter a score, then press Enter"
      onChange={event => onChange(event.detail.value)}
      onKeyDown={event => {
        // keyCode 13 === Enter
        if (event.detail.keyCode === 13) {
          event.preventDefault();
          submit?.();
        }
      }}
    />
  );
}

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'name',
    propertyLabel: 'Name',
    groupValuesLabel: 'Name values',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'score',
    propertyLabel: 'Score',
    groupValuesLabel: 'Score values',
    operators: [
      { operator: '=', form: ScoreForm, match: (itemValue, tokenValue) => String(itemValue) === String(tokenValue) },
      { operator: '>', form: ScoreForm, match: (itemValue, tokenValue) => Number(itemValue) > Number(tokenValue) },
      { operator: '<', form: ScoreForm, match: (itemValue, tokenValue) => Number(itemValue) < Number(tokenValue) },
    ],
  },
];

export default function CustomFormSubmitDemo() {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ tokens: [], operation: 'and' });
  const { items, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: { filteringProperties },
  });

  return (
    <I18nProvider locale="en" messages={[messages]}>
      <div style={{ padding: 20 }}>
        <h1>Property Filter — Custom Form Submit Demo</h1>
        <p>
          Type <code>Score =</code> (or <code>Score &gt;</code> / <code>Score &lt;</code>), enter a number in the custom
          form, and press <kbd>Enter</kbd> to apply the token without clicking the Apply button. The same works when
          editing an existing token.
        </p>

        <PropertyFilter
          {...propertyFilterProps}
          query={query}
          onChange={event => {
            propertyFilterProps.onChange(event);
            setQuery(event.detail);
          }}
          i18nStrings={i18nStrings}
        />

        <h2>
          Filtered items ({items.length} / {allItems.length})
        </h2>
        <pre>{JSON.stringify(query, null, 2)}</pre>
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.name} — {item.score}
            </li>
          ))}
        </ul>
      </div>
    </I18nProvider>
  );
}
