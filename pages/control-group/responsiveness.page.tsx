// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';

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

// Each control has a fixed width so the group's required single-row width (~3 x 200px) is
// deterministic: comfortably wider than the NARROW viewport (must stack) and narrower than
// the WIDE one (must be a row).
const controlStyle = { width: 200 };

function Group() {
  const [name, setName] = useState('service');
  const [operator, setOperator] = useState<SelectProps.Option>(operators[0]);
  const [value, setValue] = useState('production');
  return (
    <ControlGroup>
      <div style={controlStyle}>
        <Input ariaLabel="Label name" value={name} placeholder="Label name" onChange={e => setName(e.detail.value)} />
      </div>
      <div style={controlStyle}>
        <Select
          ariaLabel="Operator"
          selectedOption={operator}
          options={operators}
          onChange={e => setOperator(e.detail.selectedOption)}
        />
      </div>
      <div style={controlStyle}>
        <Input
          ariaLabel="Label value"
          value={value}
          placeholder="Label value"
          onChange={e => setValue(e.detail.value)}
        />
      </div>
    </ControlGroup>
  );
}

export default function ControlGroupResponsiveness() {
  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="An auto group inside a horizontal SpaceBetween: the flexbox deadlock case. Narrowing the viewport stacks all its controls at once; widening it must re-expand them, not leave them stuck stacked."
    >
      <FocusTarget />
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
      <Button data-testid="focus-after">Focus after</Button>
    </SimplePage>
  );
}
