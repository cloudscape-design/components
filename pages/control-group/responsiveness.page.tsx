// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Input from '~components/input';
import ControlGroup, { InternalControlGroupProps } from '~components/internal/components/control-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

// The scenario containers are tied to the viewport width (`inlineSize: '100%'`) so that an
// integ test can drive the available width with `setWindowSize`. Narrowing the viewport below
// the group's required row width stacks all controls at once; widening it re-expands them.
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
          <div data-testid="auto-plain" style={scenarioContainerStyle}>
            <Group />
          </div>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="h2">Auto group inside SpaceBetween (flexbox deadlock)</Box>
          {/*
            The group sits inside a horizontal SpaceBetween (a flex row) alongside another
            element, itself inside the viewport-constrained container. A naive "measure my
            parent" group would deadlock here: once stacked, the shrink-wrapping flex item
            reports the collapsed width, so the group would never see the room to re-expand.
            The ancestor-walk skips those shrink-wrapping ancestors, so widening the viewport
            re-expands the group.
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
