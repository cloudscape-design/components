// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Input from '~components/input';
import ControlGroup from '~components/internal/components/control-group';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl, { SegmentedControlProps } from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

const OPERATORS: SelectProps.Option[] = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '=~', label: '=~' },
  { value: '!~', label: '!~' },
];

const AGGREGATIONS: SelectProps.Option[] = [
  { value: 'count_values', label: 'count_values' },
  { value: 'sum', label: 'sum' },
  { value: 'avg', label: 'avg' },
];

const MULTI_OPTIONS: MultiselectProps.Option[] = Array.from({ length: 8 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const SEGMENTS: SegmentedControlProps.Option[] = [
  { id: 'and', text: 'AND' },
  { id: 'or', text: 'OR' },
];

function InputAndSelect() {
  const [value, setValue] = useState('service');
  const [operator, setOperator] = useState<SelectProps.Option>(OPERATORS[0]);
  return (
    <ControlGroup>
      <Input ariaLabel="Name" value={value} onChange={event => setValue(event.detail.value)} placeholder="Name" />
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={OPERATORS}
        onChange={event => setOperator(event.detail.selectedOption)}
      />
      <Input ariaLabel="Value" value="" onChange={() => {}} placeholder="Value" />
    </ControlGroup>
  );
}

function InputAndSelectWithInlineLabels() {
  const [value, setValue] = useState('service');
  const [operator, setOperator] = useState<SelectProps.Option>(OPERATORS[0]);
  return (
    <ControlGroup>
      <Input
        inlineLabelText="Name"
        ariaLabel="Name"
        value={value}
        onChange={event => setValue(event.detail.value)}
        placeholder="Name"
      />
      <Select
        inlineLabelText="Operator"
        ariaLabel="Operator"
        selectedOption={operator}
        options={OPERATORS}
        onChange={event => setOperator(event.detail.selectedOption)}
      />
      <Input inlineLabelText="Value" ariaLabel="Value" value="" onChange={() => {}} placeholder="Value" />
    </ControlGroup>
  );
}

function SelectAndMultiselect() {
  const [aggregation, setAggregation] = useState<SelectProps.Option>(AGGREGATIONS[0]);
  const [selected, setSelected] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  return (
    <ControlGroup>
      <Select
        inlineLabelText="Aggregation"
        ariaLabel="Aggregation"
        selectedOption={aggregation}
        options={AGGREGATIONS}
        onChange={event => setAggregation(event.detail.selectedOption)}
      />
      <Multiselect
        inlineLabelText="Labels"
        ariaLabel="Labels"
        inlineTokens={true}
        selectedOptions={selected}
        options={MULTI_OPTIONS}
        placeholder="Choose labels"
        onChange={event => setSelected(event.detail.selectedOptions)}
      />
    </ControlGroup>
  );
}

function InputAndSegmentedControl() {
  const [value, setValue] = useState('');
  const [selectedId, setSelectedId] = useState('and');
  return (
    <ControlGroup>
      <Input
        ariaLabel="Expression"
        value={value}
        onChange={event => setValue(event.detail.value)}
        placeholder="Expression"
      />
      <SegmentedControl
        selectedId={selectedId}
        options={SEGMENTS}
        label="Join"
        onChange={event => setSelectedId(event.detail.selectedId)}
      />
    </ControlGroup>
  );
}

function InputWithIconAndSelect() {
  const [value, setValue] = useState('');
  const [operator, setOperator] = useState<SelectProps.Option>(OPERATORS[0]);
  return (
    <ControlGroup>
      <Input
        type="search"
        ariaLabel="Search"
        value={value}
        onChange={event => setValue(event.detail.value)}
        placeholder="Search"
      />
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={OPERATORS}
        onChange={event => setOperator(event.detail.selectedOption)}
      />
    </ControlGroup>
  );
}

function InputWithPrefixSuffixAndSelect() {
  const [value, setValue] = useState('100');
  const [operator, setOperator] = useState<SelectProps.Option>(OPERATORS[0]);
  return (
    <ControlGroup>
      <Input
        ariaLabel="Amount"
        prefix="$"
        suffix="USD"
        value={value}
        onChange={event => setValue(event.detail.value)}
        placeholder="Amount"
      />
      <Select
        ariaLabel="Operator"
        selectedOption={operator}
        options={OPERATORS}
        onChange={event => setOperator(event.detail.selectedOption)}
      />
    </ControlGroup>
  );
}

function SingleControl() {
  const [value, setValue] = useState('');
  return (
    <ControlGroup>
      <Input ariaLabel="Only" value={value} onChange={event => setValue(event.detail.value)} placeholder="Only" />
    </ControlGroup>
  );
}

export default function ControlGroupScenariosPage() {
  return (
    <article style={{ padding: 20 }}>
      <h1>Control group (internal, basic)</h1>
      <SpaceBetween size="l">
        <div>
          <h2>Input + Select + Input</h2>
          <InputAndSelect />
        </div>
        <div>
          <h2>Input + Select + Input with inline labels</h2>
          <InputAndSelectWithInlineLabels />
        </div>
        <div>
          <h2>Select + Multiselect</h2>
          <SelectAndMultiselect />
        </div>
        <div>
          <h2>Input + Segmented control</h2>
          <InputAndSegmentedControl />
        </div>
        <div>
          <h2>Input with icon + Select</h2>
          <InputWithIconAndSelect />
        </div>
        <div>
          <h2>Input with prefix and suffix + Select</h2>
          <InputWithPrefixSuffixAndSelect />
        </div>
        <div>
          <h2>Single control</h2>
          <SingleControl />
        </div>
      </SpaceBetween>
    </article>
  );
}
