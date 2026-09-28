// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

import { PermutationsPage } from '../app/templates';
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

const permutations: Array<{ inlineLabelText?: string; children: React.ReactNode }> = [
  // Input
  { children: <Input ariaLabel="Value" value="service" onChange={noop} /> },
  // Input + Select
  {
    children: (
      <>
        <Input ariaLabel="Name" value="service" onChange={noop} />
        <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />
      </>
    ),
  },
  // Input + Select + Input
  {
    children: (
      <>
        <Input ariaLabel="Name" value="service" onChange={noop} />
        <Select ariaLabel="Operator" selectedOption={operators[0]} options={operators} onChange={noop} />
        <Input ariaLabel="Value" value="" onChange={noop} placeholder="Value" />
      </>
    ),
  },
  // Select + Multiselect
  {
    children: (
      <>
        <Select ariaLabel="Aggregation" selectedOption={operators[0]} options={operators} onChange={noop} />
        <Multiselect
          ariaLabel="Labels"
          inlineTokens={true}
          selectedOptions={[multiOptions[0]]}
          options={multiOptions}
          onChange={noop}
        />
      </>
    ),
  },
  // Input + Segmented control
  {
    children: (
      <>
        <Input ariaLabel="Expression" value="" onChange={noop} placeholder="Expression" />
        <SegmentedControl selectedId="and" options={segments} label="Join" onChange={noop} />
      </>
    ),
  },
];

export default function ControlGroupPermutations() {
  return (
    <PermutationsPage title="Control group permutations" i18n={{}}>
      <PermutationsView
        permutations={permutations}
        render={permutation => <ControlGroup>{permutation.children}</ControlGroup>}
      />
    </PermutationsPage>
  );
}
