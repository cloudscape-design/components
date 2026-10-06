// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SpaceBetween } from '~components';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';

import { SimplePage } from '../app/templates';
import FocusTarget from '../common/focus-target';
import { DirectionSettings, enteredTextLabel, multiOptions, noop, operators, useControlGroupDirection } from './common';

const suggestions: AutosuggestProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `Metric ${i + 1}`,
}));

// Long option lists so the control groups' open dropdowns extend far enough down to overlap the standalone controls below,
// to test that dropdowns are rendered over labels and not the other way around.
const longOperators: SelectProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `op-${i + 1}`,
  label: `Operator ${i + 1}`,
}));

const longMultiOptions: MultiselectProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Option ${i + 1}`,
}));

export default function ControlGroupLabels() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <SimplePage
      title="Control group labels"
      subtitle="Exercises the control group inline label: how it stacks above the controls, how it
        interacts with each leading control's focus ring, and how an open dropdown paints over the
        label and the controls below. Standalone controls with an inline label are shown for
        comparison."
      settings={<DirectionSettings direction={direction} setDirection={setDirection} />}
      screenshotArea={{}}
    >
      <FocusTarget />
      <SpaceBetween size="l">
        <ControlGroup inlineLabelText="Filter by metric" direction={direction}>
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

        <ControlGroup inlineLabelText="Threshold" direction={direction}>
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

        <ControlGroup inlineLabelText="Metric name" direction={direction}>
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

        <ControlGroup inlineLabelText="Service" direction={direction}>
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
