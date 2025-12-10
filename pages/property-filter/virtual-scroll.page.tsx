// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';

import { SimplePage } from '../app/templates';

const options = Array.from({ length: 1000 }, (_, i) => ({
  value: `${i}`,
  label: `Option ${i + 1}`,
}));

export default function () {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ tokens: [], operation: 'and' });

  return (
    <SimplePage title="PropertyFilter Virtual Scroll" i18n={{}} screenshotArea={{}}>
      <div
        style={{
          height: 500,
          padding: 10,
          // Prevents dropdown from expanding outside of the screenshot area
          overflow: 'auto',
        }}
      >
        <PropertyFilter
          query={query}
          onChange={({ detail }) => setQuery(detail)}
          filteringProperties={[
            {
              key: 'property',
              operators: ['=', '!='],
              propertyLabel: 'Property',
              groupValuesLabel: 'Property values',
            },
          ]}
          filteringOptions={options.map(opt => ({ propertyKey: 'property', value: opt.value! }))}
          virtualScroll={true}
          expandToViewport={false}
          data-testid="property-filter-demo"
        />
      </div>
    </SimplePage>
  );
}
