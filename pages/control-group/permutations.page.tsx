// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import FormField from '~components/form-field';
import Input from '~components/input';
import ControlGroup, { InternalControlGroupProps } from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import RadioGroup from '~components/radio-group';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

import { useAppContext } from '../app/app-context';
import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

type Direction = NonNullable<InternalControlGroupProps['direction']>;

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

const segments: SegmentedControlProps.Option[] = [
  { id: 'and', text: 'AND' },
  { id: 'or', text: 'OR' },
];

const suggestions: AutosuggestProps.Option[] = [{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }];

const enteredTextLabel = (value: string) => `Use: ${value}`;

const input = <Input ariaLabel="Value" value="service" onChange={noop} />;
const select = <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />;
const multiselect = (
  <Multiselect
    ariaLabel="Labels"
    inlineTokens={true}
    selectedOptions={[multiOptions[0]]}
    options={multiOptions}
    onChange={noop}
  />
);
const segmentedControl = <SegmentedControl selectedId="and" options={segments} label="Join" onChange={noop} />;
const autosuggest = (
  <Autosuggest
    ariaLabel="Metric"
    value="CPU"
    onChange={noop}
    options={suggestions}
    enteredTextLabel={enteredTextLabel}
  />
);

const permutations = createPermutations<InternalControlGroupProps>([
  {
    children: [
      input,
      autosuggest,
      segmentedControl,
      select,
      multiselect,
      <>
        {input}
        {select}
      </>,
      <>
        {input}
        {segmentedControl}
      </>,
      <>
        {autosuggest}
        {select}
      </>,
      <>
        {autosuggest}
        {segmentedControl}
      </>,
      <>
        {select}
        {multiselect}
      </>,
      <>
        {multiselect}
        {select}
      </>,
      <>
        {input}
        {select}
        {input}
      </>,
      <>
        {autosuggest}
        {select}
        {autosuggest}
      </>,
      <>
        {input}
        {multiselect}
        {input}
      </>,
      <>
        {autosuggest}
        {multiselect}
        {autosuggest}
      </>,
    ],
  },
]);

const inlineLabelPermutations = createPermutations<InternalControlGroupProps>([
  {
    inlineLabelText: ['Threshold'],
    children: [
      <>
        {input}
        {select}
      </>,
      <>
        {select}
        {input}
        {multiselect}
      </>,
    ],
  },
]);

export default function ControlGroupPermutations() {
  // The name `direction` is already taken for the LTR/RTL URL parameter
  const { urlParams, setUrlParams } = useAppContext<'controlGroupDirection'>();
  const direction: Direction = urlParams.controlGroupDirection === 'vertical' ? 'vertical' : 'horizontal';

  return (
    <PermutationsPage
      title="Control group permutations"
      i18n={{}}
      settings={
        <FormField label="Direction">
          <RadioGroup
            value={direction}
            onChange={({ detail }) => setUrlParams({ controlGroupDirection: detail.value as Direction })}
            items={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
            ]}
          />
        </FormField>
      }
    >
      <PermutationsView
        permutations={permutations}
        render={permutation => <ControlGroup {...permutation} direction={direction} />}
      />
      <PermutationsView
        permutations={inlineLabelPermutations}
        render={permutation => <ControlGroup {...permutation} />}
      />
    </PermutationsPage>
  );
}
