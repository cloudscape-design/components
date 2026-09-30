// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Input from '~components/input';
import ControlGroup, { InternalControlGroupProps } from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

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

const input = <Input value="service" onChange={noop} />;

const select = <Select selectedOption={operators[0]} options={operators} onChange={noop} />;

const multiselect = (
  <Multiselect inlineTokens={true} selectedOptions={[multiOptions[0]]} options={multiOptions} onChange={noop} />
);

const segmentedControl = <SegmentedControl selectedId="and" options={segments} onChange={noop} />;

const autosuggest = (
  <Autosuggest value="CPU" onChange={noop} options={suggestions} enteredTextLabel={enteredTextLabel} />
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

export default function ControlGroupPermutations() {
  return (
    <PermutationsPage title="Control group permutations" i18n={{}}>
      <PermutationsView permutations={permutations} render={permutation => <ControlGroup {...permutation} />} />
    </PermutationsPage>
  );
}
