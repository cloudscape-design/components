// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ControlGroup from '~components/control-group';
import Input from '~components/input';
import Multiselect from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const OPERATORS: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '=~', label: '=~' },
  { value: '!~', label: '!~' },
];

const REGIONS: SelectProps.Option[] = [
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'eu-west-1', label: 'eu-west-1' },
];

export default function ControlGroupSimplePage() {
  const [key, setKey] = useState('service');
  const [op, setOp] = useState<SelectProps.Option>(OPERATORS[0]);
  const [value, setValue] = useState('');

  const [op2, setOp2] = useState<SelectProps.Option>(OPERATORS[2]);
  const [value2, setValue2] = useState('bad-input');

  const [regions, setRegions] = useState<ReadonlyArray<SelectProps.Option>>([REGIONS[0]]);

  return (
    <ScreenshotArea disableAnimations={true}>
      <Box padding="l">
        <h1>ControlGroup</h1>

        <SpaceBetween size="xl">
          <div>
            <Box variant="h2">Label matcher (default variant)</Box>
            <ControlGroup ariaLabel="Label matcher">
              <Input value={key} onChange={e => setKey(e.detail.value)} placeholder="key" />
              <Select
                selectedOption={op}
                options={OPERATORS}
                onChange={e => setOp(e.detail.selectedOption)}
                ariaLabel="Operator"
              />
              <Input value={value} onChange={e => setValue(e.detail.value)} placeholder="value" />
              <Button iconName="close" variant="icon" ariaLabel="Remove label matcher" />
            </ControlGroup>
          </div>

          <div>
            <Box variant="h2">With group-level error</Box>
            <ControlGroup ariaLabel="Label matcher with error" errorText="Enter a valid label value.">
              <Input value={key} onChange={e => setKey(e.detail.value)} placeholder="key" />
              <Select
                selectedOption={op2}
                options={OPERATORS}
                onChange={e => setOp2(e.detail.selectedOption)}
                ariaLabel="Operator"
              />
              <Input value={value2} onChange={e => setValue2(e.detail.value)} placeholder="value" />
              <Button iconName="close" variant="icon" ariaLabel="Remove label matcher" />
            </ControlGroup>
          </div>

          <div>
            <Box variant="h2">With group-level warning and description</Box>
            <ControlGroup
              ariaLabel="Region matcher"
              warningText="This expression may match a large number of results."
              description="Select one or more regions to filter by."
            >
              <Multiselect
                selectedOptions={regions}
                options={REGIONS}
                onChange={e => setRegions(e.detail.selectedOptions)}
                ariaLabel="Regions"
                inlineTokens={true}
              />
              <Button iconName="close" variant="icon" ariaLabel="Remove region matcher" />
            </ControlGroup>
          </div>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
