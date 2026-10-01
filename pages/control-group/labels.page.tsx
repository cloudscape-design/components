// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, SpaceBetween } from '~components';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';

import { SimplePage } from '../app/templates';

const noop = () => {
  /* empty handler to suppress controlled-component warnings */
};

const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

const multiOptions: MultiselectProps.Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

const suggestions: AutosuggestProps.Option[] = [{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }];

const enteredTextLabel = (value: string) => `Use: ${value}`;

export default function ControlGroupLabels() {
  return (
    <SimplePage title="Control group labels" screenshotArea={{}}>
      <SpaceBetween size="l">
        <Box variant="h2">Control groups with label</Box>

        <ControlGroup inlineLabelText="Filter by metric">
          <Select
            ariaLabel="Operator"
            selectedOption={operators[0]}
            options={operators}
            onChange={noop}
            expandToViewport={true}
          />
          <Input ariaLabel="Value" value="service" onChange={noop} />
        </ControlGroup>

        <ControlGroup inlineLabelText="Threshold">
          <Multiselect
            ariaLabel="Labels"
            inlineTokens={true}
            selectedOptions={[multiOptions[0]]}
            options={multiOptions}
            onChange={noop}
            expandToViewport={true}
          />
          <Autosuggest
            ariaLabel="Metric"
            value="CPU"
            onChange={noop}
            options={suggestions}
            enteredTextLabel={enteredTextLabel}
            expandToViewport={true}
          />
        </ControlGroup>

        <Box variant="h2">Standalone components with inline label</Box>

        <Input inlineLabelText="Service name" ariaLabel="Service name" value="service" onChange={noop} />
        <Select
          inlineLabelText="Operator"
          ariaLabel="Operator"
          selectedOption={operators[0]}
          options={operators}
          onChange={noop}
          expandToViewport={true}
        />
        <Multiselect
          inlineLabelText="Labels"
          ariaLabel="Labels"
          inlineTokens={true}
          selectedOptions={[multiOptions[0]]}
          options={multiOptions}
          onChange={noop}
          expandToViewport={true}
        />
      </SpaceBetween>
    </SimplePage>
  );
}
