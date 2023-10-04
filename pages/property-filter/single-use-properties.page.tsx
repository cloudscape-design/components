// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box from '~components/box';
import PropertyFilter from '~components/property-filter';
import Header from '~components/header';
import { allItems } from './table.data';
import { i18nStrings, filteringProperties } from './common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { SpaceBetween } from '~components';

export default function () {
  const { items, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      filteringProperties,
      defaultQuery: { tokens: [{ propertyKey: 'owner', operator: '=', value: 'admin1' }], operation: 'and' },
    },
    sorting: {},
  });

  const usedProperties = new Set(propertyFilterProps.query.tokens.map(t => t.propertyKey));
  const remainedProperties = propertyFilterProps.filteringProperties.filter(p => !usedProperties.has(p.key));

  return (
    <Box padding="m">
      <SpaceBetween size="m">
        <Header>Single-use properties demo</Header>
        <PropertyFilter
          {...propertyFilterProps}
          filteringProperties={remainedProperties}
          countText={`${items.length} matches`}
          i18nStrings={i18nStrings}
        />
      </SpaceBetween>
    </Box>
  );
}
