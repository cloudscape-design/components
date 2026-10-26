// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import FormField from '~components/form-field';
import Input from '~components/input';
import { ControlGroupProps } from '~components/internal/components/control-group/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

import { useAppContext } from '../app/app-context';

export const noop = () => {
  /* empty handler to suppress controlled-component warnings */
};

export const operators: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

export const multiOptions: MultiselectProps.Option[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

export const segments: SegmentedControlProps.Option[] = [
  { id: 'and', text: 'AND' },
  { id: 'or', text: 'OR' },
];

export const enteredTextLabel = (value: string) => `Use: ${value}`;

export const suggestions: AutosuggestProps.Option[] = [{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }];

export const input = <Input ariaLabel="Value" value="service" onChange={noop} />;

export const select = <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />;

export const multiselect = (
  <Multiselect
    ariaLabel="Labels"
    inlineTokens={true}
    selectedOptions={[multiOptions[0]]}
    options={multiOptions}
    onChange={noop}
  />
);

export const segmentedControl = <SegmentedControl selectedId="and" options={segments} label="Join" onChange={noop} />;

export const autosuggest = (
  <Autosuggest
    ariaLabel="Metric"
    value="CPU"
    onChange={noop}
    options={suggestions}
    enteredTextLabel={enteredTextLabel}
  />
);

export const autosuggestTokens = (
  <Autosuggest
    data-testid="autosuggest-tokens"
    ariaLabel="Metrics"
    value=""
    tokens={[{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }]}
    onChange={noop}
    options={suggestions}
    enteredTextLabel={enteredTextLabel}
  />
);

export type Direction = NonNullable<ControlGroupProps['direction']>;

export function useControlGroupDirection() {
  const { urlParams, setUrlParams } = useAppContext<'controlGroupDirection'>(); // The name `direction` is already taken for the LTR/RTL URL parameter
  const direction: Direction = urlParams.controlGroupDirection === 'vertical' ? 'vertical' : 'horizontal';
  const setDirection = (value: Direction) => setUrlParams({ controlGroupDirection: value });
  return { direction, setDirection };
}

export function DirectionSettings({
  direction,
  setDirection,
}: {
  direction: Direction;
  setDirection: (value: Direction) => void;
}) {
  return (
    <FormField label="Direction">
      <RadioGroup
        value={direction}
        onChange={({ detail }) => setDirection(detail.value as Direction)}
        items={[
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ]}
      />
    </FormField>
  );
}
