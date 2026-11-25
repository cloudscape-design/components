// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { i18nStrings } from './common-props';

const filteringProperties: PropertyFilterProps['filteringProperties'] = [
  { key: 'id', propertyLabel: 'Identifier', operators: ['=', '!=', ':'], groupValuesLabel: 'Identifier values' },
  { key: 'service', propertyLabel: 'Service', operators: ['=', '!='], groupValuesLabel: 'Service values' },
  { key: 'type', propertyLabel: 'Resource type', operators: ['=', '!='], groupValuesLabel: 'Resource type values' },
  { key: 'tag', propertyLabel: 'Tag', operators: ['=', '!='], groupValuesLabel: 'Tag values' },
];

const filteringOptions: PropertyFilterProps['filteringOptions'] = [
  ...[1, 2, 3, 4].map(index => ({
    propertyKey: 'id',
    value: `arn:aws:apprunner:ap-southeast-2:123456789012:autoscalingconfiguration/DefaultConfiguration/1/0000000000000000000000000000000${index}`,
  })),
  { propertyKey: 'service', value: 'AWS App Runner' },
  { propertyKey: 'type', value: 'AWS::AppRunner::AutoScalingConfiguration' },
  { propertyKey: 'tag', value: 'env' },
];

export default function PropertyFilterLongValuesPage() {
  const { urlParams } = useContext(AppContext as React.Context<AppContextType<{ expandToViewport?: boolean }>>);
  const expandToViewport = String(urlParams.expandToViewport) === 'true';
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ tokens: [], operation: 'and' });
  return (
    <SimplePage title="Property filter with long values">
      <div style={{ maxInlineSize: 600 }}>
        <PropertyFilter
          query={query}
          onChange={event => setQuery(event.detail)}
          filteringProperties={filteringProperties}
          filteringOptions={filteringOptions}
          i18nStrings={i18nStrings}
          filteringAriaLabel="Find resources"
          filteringPlaceholder="Find resources"
          expandToViewport={expandToViewport}
        />
      </div>
    </SimplePage>
  );
}
