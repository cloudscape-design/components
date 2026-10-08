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

const scenarioContainerStyle: React.CSSProperties = {
  inlineSize: '100%',
  overflow: 'hidden',
};

// Six controls so the group's required single-row width comfortably exceeds the narrow
// viewport, so it reliably stacks there and is a row at the wide viewport.
function Group() {
  const [name, setName] = useState('service');
  const [operator, setOperator] = useState<SelectProps.Option>(operators[0]);
  const [value, setValue] = useState('production');
  const [name2, setName2] = useState('region');
  const [operator2, setOperator2] = useState<SelectProps.Option>(operators[0]);
  const [value2, setValue2] = useState('us-east-1');
  return (
    <ControlGroup>
      <Input ariaLabel="Label name" value={name} placeholder="Label name" onChange={e => setName(e.detail.value)} />
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={operators}
        onChange={e => setOperator(e.detail.selectedOption)}
      />
      <Input ariaLabel="Label value" value={value} placeholder="Label value" onChange={e => setValue(e.detail.value)} />
      <Input ariaLabel="Label name 2" value={name2} placeholder="Label name" onChange={e => setName2(e.detail.value)} />
      <Select
        ariaLabel="Operator 2"
        selectedOption={operator2}
        options={operators}
        onChange={e => setOperator2(e.detail.selectedOption)}
      />
      <Input
        ariaLabel="Label value 2"
        value={value2}
        placeholder="Label value"
        onChange={e => setValue2(e.detail.value)}
      />
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
