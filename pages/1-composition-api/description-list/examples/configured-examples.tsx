// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Link,
  Popover,
  ProgressBar,
  SpaceBetween,
  StatusIndicator,
} from '~components';
import DescriptionList from '~components/key-value-pairs/composition';

import KeyValue from '../configured-key-value/index';
import { KeyValueProps } from '../configured-key-value/interfaces';

export default function ConfiguredExamples() {
  return (
    <SpaceBetween size="l">
      {/* 1st example */}
      <Container header={<Box variant="h2">2nd example: Composed + configured auto column layout</Box>}>
        <KeyValue.ListAutoLayout pairsList={pairs} />
      </Container>

      {/* 2nd example */}
      <ColumnLayout columns={2}>
        <Container header={<Box variant="h2">3rd example: Composed + configured col layout list</Box>}>
          <ColumnLayout columns={2} variant="text-grid">
            <KeyValue.Group title="Column title 1" pairs={pairs.slice(0, 3)} />
            <KeyValue.Group title="Column title 2" pairs={pairs.slice(3, 6)} />
          </ColumnLayout>
        </Container>

        <Container header={<Box variant="h2">3rd example: Composed col layout list</Box>}>
          <ComposedListLayout />
        </Container>
      </ColumnLayout>

      {/* 3rd example */}
      <Container header={<Box variant="h2">4th example: Fluid list using configured pair + composed list</Box>}>
        <DescriptionList.List direction="auto">
          {pairs.map((pair: KeyValueProps.Pair, index: number) => (
            <KeyValue.Pair key={index} label={pair.label} values={pair.values} />
          ))}
        </DescriptionList.List>
      </Container>
    </SpaceBetween>
  );
}

function ComposedListLayout() {
  return (
    <ColumnLayout columns={2} variant="text-grid">
      <SpaceBetween direction="vertical" size="xs">
        <Box variant="h3">Column 1</Box>

        <DescriptionList.List>
          <DescriptionList.ListItem>
            <DescriptionList.Term>Distribution IDs</DescriptionList.Term>
            <DescriptionList.Details>E1WG1ZNPRXT0D4</DescriptionList.Details>
            <DescriptionList.Details>E1WG1ZNPRXJKFKD</DescriptionList.Details>
          </DescriptionList.ListItem>

          <DescriptionList.ListItem>
            <DescriptionList.Term>Domain names</DescriptionList.Term>
            <DescriptionList.Details>example1.com</DescriptionList.Details>
            <DescriptionList.Details>example2.com</DescriptionList.Details>
            <DescriptionList.Details>example3.com</DescriptionList.Details>
          </DescriptionList.ListItem>

          <DescriptionList.ListItem>
            <DescriptionList.Term>ARN</DescriptionList.Term>
            <DescriptionList.Details>
              <Popover
                content={<StatusIndicator type="success">ARN copied</StatusIndicator>}
                dismissButton={false}
                position="top"
                size="small"
                triggerType="custom"
              >
                <Button ariaLabel="Copy ARN" iconName="copy" variant="inline-icon" />
              </Popover>
              <span style={{ wordBreak: 'break-all' }}>
                arn:aws:cloudfront::111122223333:distribution/E1WG1ZNPRXT0D4
              </span>
            </DescriptionList.Details>
          </DescriptionList.ListItem>
        </DescriptionList.List>
      </SpaceBetween>

      <SpaceBetween direction="vertical" size="xs">
        <Box variant="h3">Column 2</Box>

        <DescriptionList.List>
          <DescriptionList.ListItem>
            <DescriptionList.Term>Status</DescriptionList.Term>
            <DescriptionList.Details>
              <StatusIndicator>Available</StatusIndicator>
            </DescriptionList.Details>
          </DescriptionList.ListItem>

          <DescriptionList.ListItem>
            <DescriptionList.Term>Price class</DescriptionList.Term>
            <DescriptionList.Details>Use only US, Canada, Europe, and Asia</DescriptionList.Details>
          </DescriptionList.ListItem>

          <DescriptionList.ListItem>
            <DescriptionList.Term>CNAMEs</DescriptionList.Term>
            <DescriptionList.Details>
              <Link external={true} href="https://www.google.com">
                Value with external link
              </Link>
            </DescriptionList.Details>
          </DescriptionList.ListItem>
        </DescriptionList.List>
      </SpaceBetween>
    </ColumnLayout>
  );
}

const pairs: KeyValueProps.Pair[] = [
  {
    label: 'Distribution IDs',
    values: ['E1WG1ZNPRXT0D44', 'E1WG1ZNPRXJKFKD'],
  },
  {
    label: 'Domain names',
    values: ['example1.com', 'example2.com', 'example3.com'],
  },
  {
    label: 'ARN',
    values: (
      <>
        <Popover
          content={<StatusIndicator type="success">ARN copied</StatusIndicator>}
          dismissButton={false}
          position="top"
          size="small"
          triggerType="custom"
        >
          <Button ariaLabel="Copy ARN" iconName="copy" variant="inline-icon" />
        </Popover>
        <span style={{ wordBreak: 'break-all' }}>arn:aws:cloudfront::111122223333:distribution/E1WG1ZNPRXT0D4</span>
      </>
    ),
  },
  {
    label: 'Status',
    values: <StatusIndicator>Available</StatusIndicator>,
  },
  {
    label: 'Price class',
    values: 'Use only US, Canada, Europe, and Asia',
  },
  {
    label: 'CNAMES',
    values: (
      <Link href="https://whatever/" external={true}>
        Value with external link
      </Link>
    ),
  },
  {
    label: 'SSL Certificate',
    values: <ProgressBar variant="key-value" label="Status" value={37} description="Update in progress" />,
  },
  {
    label: 'Custom SSL client support',
    values: '-',
  },
  {
    label: 'Logging',
    values: 'Off',
  },
];
