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
import { enteredTextLabel, multiOptions, noop, operators } from './common';

const suggestions: AutosuggestProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `Metric ${i + 1}`,
}));

// Long option lists so the control groups' open dropdowns extend far enough down
// to overlap the standalone controls below, making the "dropdown paints over the
// label" behavior easy to eyeball.
const longOperators: SelectProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `op-${i + 1}`,
  label: `Operator ${i + 1}`,
}));

const longMultiOptions: MultiselectProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Option ${i + 1}`,
}));

export default function ControlGroupLabels() {
  return (
    <SimplePage title="Control group labels" screenshotArea={{}}>
      <SpaceBetween size="l">
        <Box variant="h2">Control groups with label</Box>

        <ControlGroup inlineLabelText="Filter by metric">
          <Select
            data-testid="grouped-select"
            ariaLabel="Operator"
            selectedOption={longOperators[0]}
            options={longOperators}
            onChange={noop}
            expandToViewport={true}
          />
          <Input ariaLabel="Value" value="service" onChange={noop} />
        </ControlGroup>

        <ControlGroup inlineLabelText="Threshold">
          <Multiselect
            data-testid="grouped-multiselect"
            ariaLabel="Labels"
            inlineTokens={true}
            selectedOptions={[longMultiOptions[0]]}
            options={longMultiOptions}
            onChange={noop}
            expandToViewport={true}
          />
          <Autosuggest
            ariaLabel="Metric"
            value=""
            onChange={noop}
            options={suggestions}
            enteredTextLabel={enteredTextLabel}
            expandToViewport={true}
          />
        </ControlGroup>

        <ControlGroup inlineLabelText="Metric name">
          <Autosuggest
            data-testid="grouped-autosuggest"
            ariaLabel="Metric"
            value="CPU"
            onChange={noop}
            options={suggestions}
            enteredTextLabel={enteredTextLabel}
            expandToViewport={true}
          />
          <Select
            ariaLabel="Operator"
            selectedOption={longOperators[0]}
            options={longOperators}
            onChange={noop}
            expandToViewport={true}
          />
        </ControlGroup>

        <ControlGroup inlineLabelText="Service">
          <Input data-testid="grouped-input" ariaLabel="Value" value="service" onChange={noop} />
          <Autosuggest
            ariaLabel="Metric"
            value=""
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
