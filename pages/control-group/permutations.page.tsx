// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Input from '~components/input';
import ControlGroup, { InternalControlGroupProps } from '~components/internal/components/control-group';
import Multiselect from '~components/multiselect';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select from '~components/select';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { DirectionSettings, enteredTextLabel, multiOptions, noop, operators, useControlGroupDirection } from './common';

const segments: SegmentedControlProps.Option[] = [
  { id: 'and', text: 'AND' },
  { id: 'or', text: 'OR' },
];

const suggestions: AutosuggestProps.Option[] = [{ value: 'CPUUtilization' }, { value: 'MemoryUtilization' }];

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

export default function ControlGroupPermutations() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <PermutationsPage
      title="Control group permutations"
      i18n={{}}
      settings={<DirectionSettings direction={direction} setDirection={setDirection} />}
    >
      <PermutationsView
        permutations={permutations}
        render={permutation => <ControlGroup {...permutation} direction={direction} />}
      />
    </PermutationsPage>
  );
}
