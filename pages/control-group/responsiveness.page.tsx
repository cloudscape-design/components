// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Input from '~components/input';
import ControlGroup, { InternalControlGroupProps } from '~components/internal/components/control-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

// Full-width so an integ test can drive the available width with `setWindowSize`.
const scenarioContainerStyle: React.CSSProperties = {
  inlineSize: '100%',
  padding: 16,
  border: '1px dashed var(--awsui-color-border-divider-default, #b6bec9)',
  borderRadius: 8,
};

// A control group of real controls, matching the permutations-page fixtures.
function Group({ direction }: { direction?: InternalControlGroupProps['direction'] }) {
  const [name, setName] = useState('service');
  const [operator, setOperator] = useState<SelectProps.Option>(operators[0]);
  const [value, setValue] = useState('production');
  return (
    <ControlGroup direction={direction}>
      <Input ariaLabel="Label name" value={name} placeholder="Label name" onChange={e => setName(e.detail.value)} />
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={operators}
        onChange={e => setOperator(e.detail.selectedOption)}
      />
      <Input ariaLabel="Label value" value={value} placeholder="Label value" onChange={e => setValue(e.detail.value)} />
    </ControlGroup>
  );
}

export default function ControlGroupResponsiveness() {
  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="Narrow the viewport below a group's required row width to stack all its controls at once; widen it to re-expand them. The SpaceBetween scenario is the flexbox deadlock case — it must re-expand when the viewport grows, not stay stuck stacked."
    >
      <SpaceBetween size="l">
        <SpaceBetween size="xs">
          <Box variant="h2">Auto group</Box>
          {/* Sentinels for the integ test to tab through the group and out the other side. */}
          <Button data-testid="focus-before">Focus before</Button>
          <div data-testid="auto-plain" style={scenarioContainerStyle}>
            <Group />
          </div>
          <Button data-testid="focus-after">Focus after</Button>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="h2">Auto group inside SpaceBetween (flexbox deadlock)</Box>
          {/*
            Inside a flex row, a naive "measure my parent" group would stay stuck stacked once
            collapsed. The ancestor-walk skips the shrink-wrapping flex item, so it re-expands.
          */}
          <div data-testid="auto-spacebetween" style={scenarioContainerStyle}>
            <SpaceBetween direction="horizontal" size="s">
              <Group />
              <Box variant="p">Sibling content</Box>
            </SpaceBetween>
          </div>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="h2">Forced horizontal</Box>
          <div data-testid="forced-horizontal" style={scenarioContainerStyle}>
            <Group direction="horizontal" />
          </div>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="h2">Forced vertical</Box>
          <div data-testid="forced-vertical" style={scenarioContainerStyle}>
            <Group direction="vertical" />
          </div>
        </SpaceBetween>
      </SpaceBetween>
    </SimplePage>
  );
}
