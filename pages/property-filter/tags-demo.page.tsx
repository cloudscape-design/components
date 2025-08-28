// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Container, Header, PropertyFilter, SpaceBetween } from '~components';
import { PropertyFilterProps } from '~components/property-filter';

import { i18nStrings, labels } from './common-props';

// Sample filtering properties for the demo
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
    groupValuesLabel: 'All log groups', // Use "All log groups" as the group header
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

// Sample filtering options with various tag configurations
const filteringOptions: PropertyFilterProps.FilteringOption[] = [
  // Simple test options with tags
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
  // Option without tags for comparison
  {
    propertyKey: 'service',
    value: 'cloudfront',
    label: 'Amazon CloudFront',
  },

  // Log group examples - individual options only
  // Group header "All log groups" serves as the bulk selection mechanism
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
  // Simulate pagination boundary
  {
    propertyKey: 'logGroup',
    value: 'LOAD_MORE',
    label: '... Load more (showing 10 of 10,000+)',
    tags: ['Pagination', 'API-Call-Required'],
    // description: 'Load additional log groups from API',
    // disabled: true,
  },
];

export default function TagsDemoPage() {
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
          <p>This demo showcases the Property Filter component with tags support. Try searching for:</p>
          <ul>
            <li>
              <strong>Tag content:</strong> &#34;compute&#34;, &#34;storage&#34;, &#34;database&#34;,
              &#34;serverless&#34;
            </li>
            <li>
              <strong>FilteringTags content:</strong> &#34;faas&#34;, &#34;bucket&#34;, &#34;mysql&#34;,
              &#34;sandbox&#34;
            </li>
            <li>
              <strong>Service names:</strong> &#34;ec2&#34;, &#34;s3&#34;, &#34;lambda&#34;, &#34;rds&#34;
            </li>
            <li>
              <strong>Environment types:</strong> &#34;production&#34;, &#34;staging&#34;, &#34;development&#34;
            </li>
            <li>
              <strong>Region names:</strong> &#34;us-east-1&#34;, &#34;eu-west-1&#34;, &#34;singapore&#34;
            </li>
          </ul>
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
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(query, null, 2)}
          </pre>
        </Box>

        <Box>
          <Header variant="h3">Tag Examples</Header>
          <SpaceBetween size="s">
            <div>
              <strong>Services with visible tags:</strong>
              <ul>
                <li>Amazon EC2: compute, virtual-machines, aws-core</li>
                <li>Amazon S3: storage, object-storage, aws-core (+ hidden: simple-storage-service, bucket)</li>
                <li>AWS Lambda: serverless, compute, functions (+ hidden: faas, function-as-a-service)</li>
                <li>Amazon RDS: database, relational, managed (+ hidden: mysql, postgresql, oracle, sql-server)</li>
              </ul>
            </div>
            <div>
              <strong>Environments with tags:</strong>
              <ul>
                <li>Production: live, critical, high-availability</li>
                <li>Staging: pre-production, testing, qa (+ hidden: stage, pre-prod)</li>
                <li>Development: dev, testing, experimental (+ hidden: sandbox, playground)</li>
              </ul>
            </div>
            <div>
              <strong>Regions with many tags (tests truncation):</strong>
              <ul>
                <li>US East (N. Virginia): north-america, virginia, primary, main, default, legacy, established</li>
              </ul>
            </div>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </Container>
  );
}
