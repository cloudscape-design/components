// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import ControlGroup, { ControlGroupProps } from '~components/control-group';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

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

const permutations = createPermutations<ControlGroupProps>([
  {
    // Function: a single Select + a Button child (Button remains a supported control).
    ariaLabel: ['Function'],
    children: [
      <>
        <Select
          ariaLabel="Function"
          inlineLabelText="Function"
          selectedOption={FUNCTIONS[0]}
          options={FUNCTIONS}
          onChange={() => {}}
        />
        <Button iconName="close" variant="icon" ariaLabel="Remove function" />
      </>,
    ],
    errorText: [undefined, '"sqrt" cannot be applied to a non-numeric metric.'],
  },
  {
    // Aggregation: two Selects + built-in remove button via `dismissible`.
    ariaLabel: ['Aggregation'],
    dismissible: [true],
    onDismiss: [() => {}],
    i18nStrings: [{ dismissText: 'Remove', dismissAriaLabel: 'Remove aggregation' }],
    children: [
      <>
        <Select
          ariaLabel="Aggregation"
          inlineLabelText="Aggregation"
          selectedOption={AGGREGATIONS[0]}
          options={AGGREGATIONS}
          onChange={() => {}}
        />
        <Select ariaLabel="By" selectedOption={BY_OPTIONS[0]} options={BY_OPTIONS} onChange={() => {}} />
      </>,
      <>
        <Select
          ariaLabel="Aggregation"
          inlineLabelText="Aggregation"
          selectedOption={null}
          placeholder="Select function..."
          options={AGGREGATIONS}
          onChange={() => {}}
        />
        <Select
          ariaLabel="By"
          selectedOption={BY_OPTIONS[0]}
          options={BY_OPTIONS}
          onChange={() => {}}
          disabled={true}
        />
      </>,
    ],
    errorText: [undefined, '"count_values" does not support grouping by labels. Use "sum" or "avg" instead.'],
  },
  {
    // Metric: a single Input + built-in remove button.
    ariaLabel: ['Metric'],
    dismissible: [true],
    onDismiss: [() => {}],
    i18nStrings: [{ dismissText: 'Remove', dismissAriaLabel: 'Remove metric' }],
    children: [
      <Input
        key="metric"
        ariaLabel="Metric"
        inlineLabelText="Metric"
        value=""
        placeholder="Select metric name"
        onChange={() => {}}
      />,
    ],
    errorText: [undefined, 'Metric "unknown_metric_xyz" not found. Check the metric name or select from suggestions.'],
  },
  {
    // Label: Input + operator Select + Input + built-in remove button.
    ariaLabel: ['Label'],
    dismissible: [true],
    onDismiss: [() => {}],
    i18nStrings: [{ dismissText: 'Remove', dismissAriaLabel: 'Remove label' }],
    children: [
      <>
        <Input ariaLabel="Label name" inlineLabelText="Label" value="" placeholder="Label name" onChange={() => {}} />
        <Select ariaLabel="Operator" selectedOption={OPERATORS[0]} options={OPERATORS} onChange={() => {}} />
        <Input ariaLabel="Label value" value="" placeholder="Label value" onChange={() => {}} />
      </>,
    ],
    errorText: [undefined, 'Invalid regex pattern for "=~" operator. "[invalid regex" is missing a closing bracket.'],
  },
  {
    // Multiselect with inline tokens + built-in remove button.
    ariaLabel: ['Multiselect with inline tokens'],
    dismissible: [true],
    onDismiss: [() => {}],
    i18nStrings: [{ dismissText: 'Remove', dismissAriaLabel: 'Remove options' }],
    children: [
      <Multiselect
        key="options"
        ariaLabel="Options"
        inlineTokens={true}
        selectedOptions={MULTI_OPTIONS.slice(0, 6)}
        options={MULTI_OPTIONS}
        onChange={() => {}}
      />,
    ],
    errorText: [undefined],
  },
  {
    // Search input + a segmented control choosing how the query is applied.
    ariaLabel: ['Filter results'],
    children: [
      <>
        <Input ariaLabel="Filter results" type="search" value="" placeholder="Filter results" onChange={() => {}} />
        <SegmentedControl
          selectedId="filter"
          label="Filter mode"
          options={[
            { id: 'filter', text: 'Filter' },
            { id: 'highlight', text: 'Highlight' },
          ]}
          onChange={() => {}}
        />
      </>,
    ],
    errorText: [undefined],
  },
]);

export default function () {
  return (
    <PermutationsPage title="ControlGroup permutations">
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <ControlGroup
            ariaLabel={permutation.ariaLabel}
            dismissible={permutation.dismissible}
            onDismiss={permutation.onDismiss}
            description={permutation.description}
            errorText={permutation.errorText}
            warningText={permutation.warningText}
            i18nStrings={permutation.i18nStrings}
          >
            {permutation.children}
          </ControlGroup>
        )}
      />
    </PermutationsPage>
  );
}
