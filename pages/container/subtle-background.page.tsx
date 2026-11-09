// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container, { ContainerProps } from '~components/container';
import ExpandableSection, { ExpandableSectionProps } from '~components/expandable-section';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import PieChart from '~components/pie-chart';
import ProgressBar from '~components/progress-bar';
import RadioGroup from '~components/radio-group';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table from '~components/table';
import Toggle from '~components/toggle';
import TokenGroup from '~components/token-group';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const containerPermutations = createPermutations<ContainerProps>([
  {
    background: ['default', 'subtle'],
    header: [undefined, <Header key="header">Container header</Header>],
    footer: [undefined, 'Container footer'],
  },
]);

const expandableSectionPermutations = createPermutations<ExpandableSectionProps>([
  {
    background: ['default', 'subtle'],
    variant: ['container', 'stacked'],
    defaultExpanded: [false, true],
  },
]);

function NestedContent() {
  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={3}>
        <FormField label="Input">
          <Input value="Value" onChange={() => {}} />
        </FormField>
        <FormField label="Select">
          <Select selectedOption={{ value: 'one', label: 'Option one' }} options={[]} onChange={() => {}} />
        </FormField>
        <FormField label="Disabled input">
          <Input value="Value" disabled={true} onChange={() => {}} />
        </FormField>
      </ColumnLayout>
      <SpaceBetween size="l" direction="horizontal">
        <Checkbox checked={false} onChange={() => {}}>
          Checkbox
        </Checkbox>
        <Checkbox checked={true} onChange={() => {}}>
          Checked
        </Checkbox>
        <Toggle checked={true} onChange={() => {}}>
          Toggle
        </Toggle>
        <RadioGroup
          value="one"
          items={[
            { value: 'one', label: 'Radio one' },
            { value: 'two', label: 'Radio two' },
          ]}
          onChange={() => {}}
        />
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Button variant="primary">Primary</Button>
        <Button>Normal</Button>
        <Button disabled={true}>Disabled</Button>
        <SegmentedControl
          selectedId="one"
          options={[
            { id: 'one', text: 'Segment one' },
            { id: 'two', text: 'Segment two' },
          ]}
          onChange={() => {}}
        />
      </SpaceBetween>
      <SpaceBetween size="s" direction="horizontal">
        <Link href="#">Link</Link>
        <StatusIndicator type="success">Success</StatusIndicator>
        <StatusIndicator type="error">Error</StatusIndicator>
        <StatusIndicator type="info">Info</StatusIndicator>
        <StatusIndicator type="stopped">Stopped</StatusIndicator>
        <Badge color="blue">Badge</Badge>
        <Box color="text-body-secondary">Secondary text</Box>
      </SpaceBetween>
      <TokenGroup
        items={[
          { label: 'Token one', dismissLabel: 'Remove token one' },
          { label: 'Token two', dismissLabel: 'Remove token two' },
        ]}
        onDismiss={() => {}}
      />
      <KeyValuePairs
        columns={3}
        items={[
          { label: 'Label', value: 'Value' },
          { label: 'Status', value: <StatusIndicator>Available</StatusIndicator> },
          { label: 'Progress', value: <ProgressBar value={40} /> },
        ]}
      />
      <Table
        variant="embedded"
        header={<Header counter="(2)">Embedded table</Header>}
        columnDefinitions={[
          { id: 'name', header: 'Name', cell: item => item.name },
          { id: 'status', header: 'Status', cell: item => item.status },
        ]}
        items={[
          { name: 'Item one', status: 'Active' },
          { name: 'Item two', status: 'Inactive' },
        ]}
      />
      <PieChart
        size="small"
        hideFilter={true}
        data={[
          { title: 'First', value: 40 },
          { title: 'Second', value: 25 },
          { title: 'Third', value: 20 },
          { title: 'Fourth', value: 10 },
          { title: 'Fifth', value: 5 },
        ]}
        ariaLabel="Pie chart"
      />
    </SpaceBetween>
  );
}

export default function SubtleBackgroundPage() {
  return (
    <article>
      <h1>Container subtle background</h1>
      <ScreenshotArea>
        <SpaceBetween size="xl">
          <PermutationsView
            permutations={containerPermutations}
            render={permutation => <Container {...permutation}>Container content</Container>}
          />
          <PermutationsView
            permutations={expandableSectionPermutations}
            render={permutation => (
              <ExpandableSection {...permutation} headerText="Expandable section">
                Expandable section content
              </ExpandableSection>
            )}
          />
          <div>
            <Container variant="stacked" background="subtle" header={<Header>Stacked container</Header>}>
              Container content
            </Container>
            <ExpandableSection variant="stacked" background="subtle" headerText="Stacked expandable section">
              Expandable section content
            </ExpandableSection>
            <Container variant="stacked" header={<Header>Stacked default container</Header>}>
              Container content
            </Container>
          </div>
          <Container
            background="subtle"
            header={
              <Header variant="h2" description="Header description" actions={<Button>Action</Button>}>
                Nested content
              </Header>
            }
            footer="Container footer"
          >
            <NestedContent />
          </Container>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
