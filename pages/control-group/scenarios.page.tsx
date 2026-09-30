// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Autosuggest, Box, SpaceBetween } from '~components';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';

const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

const multiOptions: MultiselectProps.Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

const enteredTextLabel = (value: string) => `Use: ${value}`;

// A nested control rendered inside custom dropdown content must NOT inherit the
// surrounding group's fused styling. Open each dropdown and confirm the nested
// control renders as a standalone control (rounded on all corners), not fused
// into the group.
export default function ControlGroupScenarios() {
  const [value, setValue] = useState('');

  return (
    <Box margin="m">
      <h1>Control group scenarios</h1>
      <SpaceBetween size="xxl">
        <div>
          <h2>Autosuggest with a nested control in its custom empty content</h2>
          <ControlGroup>
            <Autosuggest
              ariaLabel="Metric"
              value={value}
              onChange={event => setValue(event.detail.value)}
              options={[]}
              enteredTextLabel={enteredTextLabel}
              empty={
                <SpaceBetween size="xs">
                  <span>No matches. Refine your search:</span>
                  <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={() => {}} />
                </SpaceBetween>
              }
            />
            <Input ariaLabel="Value" value="service" onChange={() => {}} />
          </ControlGroup>
        </div>

        <div>
          <h2>Select with a nested control in its custom empty content</h2>
          <ControlGroup>
            <Select
              ariaLabel="Metric"
              selectedOption={null}
              options={[]}
              onChange={() => {}}
              empty={
                <SpaceBetween size="xs">
                  <span>No options. Pick an operator:</span>
                  <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={() => {}} />
                </SpaceBetween>
              }
            />
            <Input ariaLabel="Value" value="service" onChange={() => {}} />
          </ControlGroup>
        </div>

        <div>
          <h2>Multiselect with a nested control in its custom dropdown footer</h2>
          <ControlGroup>
            <Multiselect
              ariaLabel="Labels"
              selectedOptions={[]}
              options={multiOptions}
              onChange={() => {}}
              renderDropdownFooter={() => (
                <Box padding="xs">
                  <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={() => {}} />
                </Box>
              )}
            />
            <Input ariaLabel="Value" value="service" onChange={() => {}} />
          </ControlGroup>
        </div>
      </SpaceBetween>
    </Box>
  );
}
