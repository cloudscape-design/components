// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Container, Header, PropertyFilter, SpaceBetween } from '~components';
import { PropertyFilterProps } from '~components/property-filter';

import { i18nStrings, labels } from './common-props';

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'service',
    propertyLabel: 'Service',
    groupValuesLabel: 'Service values',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'environment',
    propertyLabel: 'Environment',
    groupValuesLabel: 'Environment values',
    operators: ['=', '!=', ':', '!:'],
  },
  {
    key: 'logGroup',
    propertyLabel: 'Log group',
    groupValuesLabel: 'All log groups',
    operators: [
      // Set token type for equals and not equals operators as enum so that
      // the default multi-choice form and formatter are used.
      { operator: '=', tokenType: 'enum' },
      { operator: '!=', tokenType: 'enum' },
      // Keep token type for contains and not contains operators as is.
      ':',
      '!:',
    ],
    defaultOperator: '=',
  },
];

const filteringOptions: PropertyFilterProps.FilteringOption[] = [
  {
    propertyKey: 'service',
    value: 'ec2',
    label: 'Amazon EC2',
    tags: ['compute', 'virtual-machines'],
  },
  {
    propertyKey: 'service',
    value: 's3',
    label: 'Amazon S3',
    tags: ['storage', 'object-storage'],
    filteringTags: ['bucket', 'simple-storage'],
  },
  {
    propertyKey: 'service',
    value: 'lambda',
    label: 'AWS Lambda',
    tags: ['serverless', 'compute', 'functions'],
    filteringTags: ['faas', 'function-as-a-service'],
  },
  {
    propertyKey: 'service',
    value: 'rds',
    label: 'Amazon RDS',
    tags: ['database', 'relational', 'managed'],
    filteringTags: ['mysql', 'postgresql', 'oracle', 'sql-server'],
  },
  {
    propertyKey: 'environment',
    value: 'production',
    label: 'Production',
    tags: ['live', 'critical'],
  },
  {
    propertyKey: 'environment',
    value: 'staging',
    label: 'Staging',
    tags: ['pre-production', 'testing', 'qa'],
    filteringTags: ['stage', 'pre-prod'],
  },
  {
    propertyKey: 'environment',
    value: 'development',
    label: 'Development',
    tags: ['dev', 'testing', 'experimental'],
    filteringTags: ['sandbox', 'playground'],
  },
  {
    propertyKey: 'service',
    value: 'cloudfront',
    label: 'Amazon CloudFront',
  },

  {
    propertyKey: 'logGroup',
    value: 'Log-group-01',
    label: 'Log-group-01',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-02',
    label: 'Log-group-02',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-03',
    label: 'Log-group-03',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-04',
    label: 'Log-group-04',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-05',
    label: 'Log-group-05',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-06',
    label: 'Log-group-06',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-07',
    label: 'Log-group-07',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-08',
    label: 'Log-group-08',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-09',
    label: 'Log-group-09',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
  {
    propertyKey: 'logGroup',
    value: 'Log-group-10',
    label: 'Log-group-10',
    tags: ['Standard', 'AccountID', 'Tag'],
  },
];

export default function PropertyFilterTagsPage() {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({
    tokens: [],
    operation: 'and',
  });

  return (
    <Container
      header={
        <Header variant="h1" description="Demo page showcasing Property Filter with tags support">
          Property Filter Tags Demo
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box>
          <Header variant="h2">Interactive Demo</Header>
        </Box>

        <PropertyFilter
          {...labels}
          i18nStrings={i18nStrings}
          filteringProperties={filteringProperties}
          filteringOptions={filteringOptions}
          query={query}
          onChange={({ detail }) => setQuery(detail)}
          countText={`${query.tokens.length} ${query.tokens.length === 1 ? 'filter' : 'filters'} applied`}
        />

        <Box>
          <Header variant="h3">Current Query</Header>
          <Box variant="code">{JSON.stringify(query, null, 2)}</Box>
        </Box>
      </SpaceBetween>
    </Container>
  );
}
