// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import SpaceBetween from '~components/space-between';

export default function () {
  const [query, setQuery] = React.useState<PropertyFilterProps['query']>({
    tokens: [
      {
        operator: '=',
        propertyKey: 'instanceid',
        value: 'i-2dc5ce28a0328391',
      },
    ],
    operation: 'and',
  });
  const [countText, setCountText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const propertyFilterRef = React.useRef<PropertyFilterProps.Ref>(null);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <h1>Demo page for countText live announcement testing</h1>
      <SpaceBetween size="l">
        <PropertyFilter
          query={query}
          onChange={({ detail }) => setQuery(detail)}
          countText={countText}
          ref={propertyFilterRef}
          expandToViewport={true}
          filteringAriaLabel="Find distributions"
          loading={loading}
          filteringOptions={[
            {
              propertyKey: 'instanceid',
              value: 'i-2dc5ce28a0328391',
            },
            {
              propertyKey: 'instanceid',
              value: 'i-d0312e022392efa0',
            },
            {
              propertyKey: 'instanceid',
              value: 'i-070eef935c1301e6',
            },
            {
              propertyKey: 'instanceid',
              value: 'i-3b44795b1fea36ac',
            },
            { propertyKey: 'state', value: 'Stopped' },
            { propertyKey: 'state', value: 'Stopping' },
            { propertyKey: 'state', value: 'Pending' },
            { propertyKey: 'state', value: 'Running' },
            {
              propertyKey: 'instancetype',
              value: 't3.small',
            },
            {
              propertyKey: 'instancetype',
              value: 't2.small',
            },
            { propertyKey: 'instancetype', value: 't3.nano' },
            {
              propertyKey: 'instancetype',
              value: 't2.medium',
            },
            {
              propertyKey: 'instancetype',
              value: 't3.medium',
            },
            {
              propertyKey: 'instancetype',
              value: 't2.large',
            },
            { propertyKey: 'instancetype', value: 't2.nano' },
            {
              propertyKey: 'instancetype',
              value: 't2.micro',
            },
            {
              propertyKey: 'instancetype',
              value: 't3.large',
            },
            {
              propertyKey: 'instancetype',
              value: 't3.micro',
            },
            { propertyKey: 'averagelatency', value: '17' },
            { propertyKey: 'averagelatency', value: '53' },
            { propertyKey: 'averagelatency', value: '73' },
            { propertyKey: 'averagelatency', value: '74' },
            { propertyKey: 'averagelatency', value: '107' },
            { propertyKey: 'averagelatency', value: '236' },
            { propertyKey: 'averagelatency', value: '242' },
            { propertyKey: 'averagelatency', value: '375' },
            { propertyKey: 'averagelatency', value: '402' },
            { propertyKey: 'averagelatency', value: '636' },
            { propertyKey: 'averagelatency', value: '639' },
            { propertyKey: 'averagelatency', value: '743' },
            { propertyKey: 'averagelatency', value: '835' },
            { propertyKey: 'averagelatency', value: '981' },
            { propertyKey: 'averagelatency', value: '995' },
          ]}
          filteringPlaceholder="Find distributions"
          filteringProperties={[
            {
              key: 'instanceid',
              operators: ['=', '!=', ':', '!:', '^', '!^'],
              propertyLabel: 'Instance ID',
              groupValuesLabel: 'Instance ID values',
            },
            {
              key: 'state',
              operators: ['=', '!=', ':', '!:', '^', '!^'],
              propertyLabel: 'State',
              groupValuesLabel: 'State values',
            },
            {
              key: 'instancetype',
              operators: ['=', '!=', ':', '!:', '^', '!^'],
              propertyLabel: 'Instance type',
              groupValuesLabel: 'Instance type values',
            },
            {
              key: 'averagelatency',
              operators: ['=', '!=', '>', '<', '<=', '>='],
              propertyLabel: 'Average latency',
              groupValuesLabel: 'Average latency values',
            },
          ]}
        />
        <Button onClick={() => setCountText('18 matches')}>Set count text to [18 matches]</Button>
        <Button onClick={() => setCountText('36 matches')}>Set count text to [36 matches]</Button>
        <Button onClick={() => setCountText('')}>Remove count text</Button>
        <Button onClick={() => setLoading(prevIsLoading => !prevIsLoading)}>
          Toggle loading state (current value: [{String(loading)}])
        </Button>
      </SpaceBetween>
    </I18nProvider>
  );
}
