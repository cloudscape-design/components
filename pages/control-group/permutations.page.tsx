// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import ControlGroup from '~components/control-group';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const FUNCTIONS: SelectProps.Option[] = [
  { value: 'abs', label: 'abs' },
  { value: 'ceil', label: 'ceil' },
  { value: 'floor', label: 'floor' },
];

const AGGREGATIONS: SelectProps.Option[] = [
  { value: 'count_values', label: 'count_values' },
  { value: 'sum', label: 'sum' },
  { value: 'avg', label: 'avg' },
];

const BY_OPTIONS: SelectProps.Option[] = [
  { value: 'labels', label: 'By labels' },
  { value: 'none', label: 'Without labels' },
];

const OPERATORS: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '=~', label: '=~' },
  { value: '!~', label: '!~' },
];

const MULTI_OPTIONS: MultiselectProps.Option[] = Array.from({ length: 100 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const permutations = createPermutations<{ content: React.ReactElement }>([
  {
    content: [
      // Function: a single Select + a Button child (Button remains a supported control).
      <ControlGroup key="function" ariaLabel="Function">
        <Select
          ariaLabel="Function"
          inlineLabelText="Function"
          selectedOption={FUNCTIONS[0]}
          options={FUNCTIONS}
          onChange={() => {}}
        />
        <Button iconName="close" variant="icon" ariaLabel="Remove function" />
      </ControlGroup>,

      // Aggregation: two Selects + built-in remove button via `dismissible`.
      <ControlGroup
        key="aggregation"
        ariaLabel="Aggregation"
        dismissible={true}
        onDismiss={() => {}}
        i18nStrings={{ dismissAriaLabel: 'Remove aggregation' }}
      >
        <Select
          ariaLabel="Aggregation"
          inlineLabelText="Aggregation"
          selectedOption={AGGREGATIONS[0]}
          options={AGGREGATIONS}
          onChange={() => {}}
        />
        <Select ariaLabel="By" selectedOption={BY_OPTIONS[0]} options={BY_OPTIONS} onChange={() => {}} />
      </ControlGroup>,

      // Metric: an Input + built-in remove button.
      <ControlGroup
        key="metric"
        ariaLabel="Metric"
        dismissible={true}
        onDismiss={() => {}}
        i18nStrings={{ dismissAriaLabel: 'Remove metric' }}
      >
        <Input ariaLabel="Metric" value="" placeholder="Select metric name" onChange={() => {}} />
      </ControlGroup>,

      // Label: Input + operator Select + Input + built-in remove button.
      <ControlGroup
        key="label"
        ariaLabel="Label"
        dismissible={true}
        onDismiss={() => {}}
        i18nStrings={{ dismissAriaLabel: 'Remove label' }}
      >
        <Input ariaLabel="Label name" value="" placeholder="Label name" onChange={() => {}} />
        <Select ariaLabel="Operator" selectedOption={OPERATORS[0]} options={OPERATORS} onChange={() => {}} />
        <Input ariaLabel="Label value" value="" placeholder="Label value" onChange={() => {}} />
      </ControlGroup>,

      // Multiselect with inline tokens + built-in remove button.
      <ControlGroup
        key="multiselect"
        ariaLabel="Multiselect with inline tokens"
        dismissible={true}
        onDismiss={() => {}}
        i18nStrings={{ dismissAriaLabel: 'Remove options' }}
      >
        <Multiselect
          ariaLabel="Options"
          inlineTokens={true}
          selectedOptions={MULTI_OPTIONS.slice(0, 6)}
          options={MULTI_OPTIONS}
          onChange={() => {}}
        />
      </ControlGroup>,

      // Segmented control + built-in remove button.
      <ControlGroup
        key="segmented"
        ariaLabel="View"
        dismissible={true}
        onDismiss={() => {}}
        i18nStrings={{ dismissAriaLabel: 'Remove view' }}
      >
        <SegmentedControl
          selectedId="table"
          label="View"
          options={[
            { id: 'table', text: 'Table' },
            { id: 'cards', text: 'Cards' },
            { id: 'list', text: 'List' },
          ]}
          onChange={() => {}}
        />
      </ControlGroup>,
    ],
  },
]);

export default function () {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>ControlGroup permutations</h1>
        <PermutationsView permutations={permutations} render={permutation => permutation.content} />
      </article>
    </ScreenshotArea>
  );
}
