// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Input from '~components/input';
import ControlGroup, { ControlGroupProps } from '~components/internal/components/control-group';
import Multiselect from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select from '~components/select';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import {
  DirectionSettings,
  enteredTextLabel,
  multiOptions,
  noop,
  operators,
  segments,
  useControlGroupDirection,
} from './common';

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

const permutations = createPermutations<ControlGroupProps>([
  {
    children: [
      input,
      <>
        {input}
        {select}
      </>,
      <>
        {autosuggest}
        {segmentedControl}
      </>,
      <>
        {input}
        {select}
        {input}
      </>,
      <>
        {autosuggest}
        {select}
        {multiselect}
      </>,
      <>
        {input}
        {select}
        {multiselect}
        {input}
      </>,
    ],
    actionButton: [
      { iconName: 'remove', ariaLabel: 'Remove' },
      { iconName: 'close', ariaLabel: 'Close' },
      { iconName: 'remove', ariaLabel: 'Remove', disabled: true },
      {
        iconName: 'remove',
        ariaLabel: 'Remove',
        disabled: true,
        disabledReason: 'Cannot remove the last clause',
      },
    ],
  },
]);

export default function ControlGroupActionPermutations() {
  const { direction, setDirection } = useControlGroupDirection();

  return (
    <PermutationsPage
      title="Control group action button"
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
