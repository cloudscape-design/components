// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

// A resizable container so the group can be narrowed below its required row width (which
// stacks all controls at once) and widened again (which re-expands them). This exercises
// the ancestor-walk + ResizeObserver.
const resizableContainerStyle: React.CSSProperties = {
  resize: 'horizontal',
  overflow: 'auto',
  inlineSize: 480,
  minInlineSize: 160,
  maxInlineSize: '100%',
  padding: 16,
  border: '1px dashed var(--awsui-color-border-divider-default, #b6bec9)',
  borderRadius: 8,
};

// A control group of real controls, matching the permutations-page fixtures.
function Group() {
  const [name, setName] = useState('service');
  const [operator, setOperator] = useState<SelectProps.Option>(operators[0]);
  const [value, setValue] = useState('production');
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
    </ControlGroup>
  );
}

export default function ControlGroupResponsiveness() {
  return (
    <SimplePage
      title="Control group responsiveness"
      subtitle="Drag each container's resize handle. Narrowing it below the group's required row width stacks all controls at once; widening it re-expands them. The SpaceBetween scenario is the flexbox deadlock case — it must re-expand when the outer container grows, not stay stuck stacked."
    >
      <SpaceBetween size="l">
        <SpaceBetween size="xs">
          <Box variant="h2">Narrow container</Box>
          <div style={resizableContainerStyle}>
            <Group />
          </div>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <Box variant="h2">Inside SpaceBetween (flexbox deadlock)</Box>
          {/*
            The group sits inside a horizontal SpaceBetween (a flex row) alongside another
            element, itself inside the resizable container. A naive "measure my parent"
            group would deadlock here: once stacked, the shrink-wrapping flex item reports
            the collapsed width, so the group would never see the room to re-expand. The
            ancestor-walk skips those shrink-wrapping ancestors, so widening the container
            re-expands the group.
          */}
          <div style={resizableContainerStyle}>
            <SpaceBetween direction="horizontal" size="s">
              <Group />
              <Box variant="p">Sibling content</Box>
            </SpaceBetween>
          </div>
        </SpaceBetween>
      </SpaceBetween>
    </SimplePage>
  );
}
