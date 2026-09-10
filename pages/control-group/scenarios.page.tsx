// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ControlGroup from '~components/control-group';
import FormField from '~components/form-field';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { useAppContext } from '../app/app-context';
import { SimplePage } from '../app/templates';

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

const BY_OPTIONS: SelectProps.Option[] = [
  { value: 'labels', label: 'By labels' },
  { value: 'none', label: 'Without labels' },
];

const MULTI_OPTIONS: MultiselectProps.Option[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

function isValidRegex(value: string) {
  try {
    RegExp(value);
    return true;
  } catch {
    return false;
  }
}

type MatcherParam = 'Name' | 'Operator' | 'Value' | 'Removed';

// A single interactive label-matcher ControlGroup whose state lives in URL params.
// When `labeled` is true, every control shows a visible inline label; otherwise the
// controls are named only via `ariaLabel`. The two variants use different URL-param
// prefixes so they can be driven independently.
function InteractiveLabelMatcher<Prefix extends string>({ prefix, labeled }: { prefix: Prefix; labeled: boolean }) {
  const { urlParams, setUrlParams } = useAppContext<`${Prefix}${MatcherParam}`>();

  const nameKey = `${prefix}Name` as const;
  const operatorKey = `${prefix}Operator` as const;
  const valueKey = `${prefix}Value` as const;
  const removedKey = `${prefix}Removed` as const;

  // Typed setter: a computed-key object literal would widen its key to `string`,
  // which does not match the template-literal-keyed params, so build it explicitly.
  const set = (key: `${Prefix}${MatcherParam}`, value: string | boolean) =>
    setUrlParams({ [key]: value } as Parameters<typeof setUrlParams>[0]);

  // When removed, unmount the ControlGroup entirely and offer a way to restore it.
  const removed = urlParams[removedKey] === true;

  const name = typeof urlParams[nameKey] === 'string' ? (urlParams[nameKey] as string) : 'service';
  const value = typeof urlParams[valueKey] === 'string' ? (urlParams[valueKey] as string) : '';
  const operator = OPERATORS.find(option => option.value === urlParams[operatorKey]) ?? OPERATORS[0];

  const isRegexOperator = operator.value === '=~' || operator.value === '!~';
  const isNegativeOperator = operator.value === '!=' || operator.value === '!~';

  const errorText =
    isRegexOperator && value.length > 0 && !isValidRegex(value)
      ? `Invalid regex pattern for the "${operator.value}" operator.`
      : undefined;

  const warningText =
    !errorText && isNegativeOperator
      ? 'Negative matchers can match a large number of series and may be slow.'
      : undefined;

  return (
    <SpaceBetween size="xs">
      <Box variant="h3">Label matcher{labeled ? ' with visible labels' : ''} (triggers error / warning)</Box>
      <Box variant="small">
        Pick <code>=~</code> or <code>!~</code> and type an invalid regex (for example <code>[abc</code>) to trigger an
        error. Pick <code>!=</code> or <code>!~</code> to trigger a warning. The remove button unmounts the group.
      </Box>
      {removed ? (
        <Button iconName="add-plus" onClick={() => set(removedKey, false)}>
          Restore label matcher
        </Button>
      ) : (
        <ControlGroup
          ariaLabel="Label matcher"
          dismissible={true}
          onDismiss={() => set(removedKey, true)}
          i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove label matcher' }}
          errorText={errorText}
          warningText={warningText}
        >
          <Input
            inlineLabelText="Label"
            value={name}
            placeholder="Label name"
            onChange={e => set(nameKey, e.detail.value)}
          />
          <Select
            ariaLabel={labeled ? undefined : 'Operator'}
            inlineLabelText={labeled ? 'Operator' : undefined}
            selectedOption={operator}
            options={OPERATORS}
            onChange={e => set(operatorKey, e.detail.selectedOption.value ?? '=')}
          />
          <Input
            ariaLabel={labeled ? undefined : 'Label value'}
            inlineLabelText={labeled ? 'Value' : undefined}
            value={value}
            placeholder="Label value"
            onChange={e => set(valueKey, e.detail.value)}
          />
        </ControlGroup>
      )}
    </SpaceBetween>
  );
}

// A search Input fused with a Filter/Highlight SegmentedControl, like the case on
// the permutations page but interactive: both the query and the selected mode live
// in URL params, and choosing "Highlight" with an empty query raises a warning.
function InteractiveFilterControl() {
  const { urlParams, setUrlParams } = useAppContext<'filterQuery' | 'filterMode'>();

  const query = typeof urlParams.filterQuery === 'string' ? urlParams.filterQuery : '';
  const mode = urlParams.filterMode === 'highlight' ? 'highlight' : 'filter';

  const warningText =
    mode === 'highlight' && query.trim().length === 0 ? 'Enter a query to highlight matching results.' : undefined;

  return (
    <SpaceBetween size="xs">
      <Box variant="h3">Filter results (input + segmented control)</Box>
      <Box variant="small">
        Choose <code>Highlight</code> with an empty query to trigger a warning.
      </Box>
      <ControlGroup ariaLabel="Filter results" warningText={warningText}>
        <Input
          ariaLabel="Filter results"
          type="search"
          value={query}
          placeholder="Filter results"
          onChange={e => setUrlParams({ filterQuery: e.detail.value })}
        />
        <SegmentedControl
          selectedId={mode}
          label="Filter mode"
          options={[
            { id: 'filter', text: 'Filter' },
            { id: 'highlight', text: 'Highlight' },
          ]}
          onChange={e => setUrlParams({ filterMode: e.detail.selectedId })}
        />
      </ControlGroup>
    </SpaceBetween>
  );
}

// An aggregation group whose second control (the "By" Select) is disabled, like the
// disabled permutation on the permutations page. The aggregation choice is stateful;
// choosing "count_values" (which cannot group by labels) raises an error.
function InteractiveDisabledControl() {
  const { urlParams, setUrlParams } = useAppContext<'aggregation'>();

  // Default to "sum" (a valid choice) so the example does not start in an error state.
  const aggregation =
    AGGREGATIONS.find(option => option.value === urlParams.aggregation) ??
    AGGREGATIONS.find(option => option.value === 'sum')!;

  const errorText =
    aggregation.value === 'count_values'
      ? '"count_values" does not support grouping by labels. Use "sum" or "avg" instead.'
      : undefined;

  return (
    <SpaceBetween size="xs">
      <Box variant="h3">Aggregation (with a disabled control)</Box>
      <Box variant="small">
        Choose <code>count_values</code> to trigger an error. The trailing &ldquo;By&rdquo; select is disabled.
      </Box>
      <ControlGroup ariaLabel="Aggregation" errorText={errorText}>
        <Select
          ariaLabel="Aggregation"
          inlineLabelText="Aggregation"
          selectedOption={aggregation}
          options={AGGREGATIONS}
          onChange={e => setUrlParams({ aggregation: e.detail.selectedOption.value ?? 'sum' })}
        />
        <Select
          ariaLabel="By"
          selectedOption={BY_OPTIONS[0]}
          options={BY_OPTIONS}
          onChange={() => {}}
          disabled={true}
        />
      </ControlGroup>
    </SpaceBetween>
  );
}

// A Multiselect (inline tokens) fused with the built-in remove button, like the
// multiselect permutation. The selection is stateful; clearing it raises a warning.
function InteractiveMultiselectControl() {
  const { urlParams, setUrlParams } = useAppContext<'options' | 'optionsRemoved'>();

  const removed = urlParams.optionsRemoved === true;

  const selectedValues =
    typeof urlParams.options === 'string' && urlParams.options.length > 0
      ? urlParams.options.split(',')
      : ['option-1', 'option-2', 'option-3'];
  const selectedOptions = MULTI_OPTIONS.filter(option => selectedValues.includes(option.value!));

  const warningText = selectedOptions.length === 0 ? 'Select at least one option.' : undefined;

  return (
    <SpaceBetween size="xs">
      <Box variant="h3">Multiselect (inline tokens)</Box>
      <Box variant="small">Clear the selection to trigger a warning. The remove button unmounts the group.</Box>
      {removed ? (
        <Button iconName="add-plus" onClick={() => setUrlParams({ optionsRemoved: false })}>
          Restore multiselect
        </Button>
      ) : (
        <ControlGroup
          ariaLabel="Options"
          dismissible={true}
          onDismiss={() => setUrlParams({ optionsRemoved: true })}
          i18nStrings={{ dismissText: 'Remove', dismissAriaLabel: 'Remove options' }}
          warningText={warningText}
        >
          <Multiselect
            ariaLabel="Options"
            inlineTokens={true}
            selectedOptions={selectedOptions}
            options={MULTI_OPTIONS}
            onChange={e => setUrlParams({ options: e.detail.selectedOptions.map(option => option.value).join(',') })}
          />
        </ControlGroup>
      )}
    </SpaceBetween>
  );
}

const FIELD_STATES: SelectProps.Option[] = [
  { value: 'none', label: 'No validation' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
];

// A ControlGroup nested inside a FormField. The FormField's errorText / warningText
// is toggled via URL param to show how the FormField-level validation propagates:
// the message renders once below the group (from the FormField), and the invalid /
// warning state flows through FormFieldContext to every control in the group.
function NestedInFormFieldControl() {
  const { urlParams, setUrlParams } = useAppContext<'fieldState'>();

  const state = FIELD_STATES.find(option => option.value === urlParams.fieldState) ?? FIELD_STATES[0];

  return (
    <SpaceBetween size="xs">
      <Box variant="h3">ControlGroup nested in a FormField</Box>
      <Box variant="small">
        Toggle the FormField&rsquo;s validation state. The message renders once below the group, and the invalid /
        warning styling propagates to every control in the group.
      </Box>
      <SpaceBetween size="s">
        <Select
          ariaLabel="FormField validation state"
          selectedOption={state}
          options={FIELD_STATES}
          onChange={e => setUrlParams({ fieldState: e.detail.selectedOption.value ?? 'none' })}
        />
        <FormField
          label="Label"
          description="A ControlGroup rendered as this FormField's control."
          errorText={state.value === 'error' ? 'This field has a FormField-level error.' : undefined}
          warningText={state.value === 'warning' ? 'This field has a FormField-level warning.' : undefined}
        >
          <ControlGroup ariaLabel="Label matcher">
            <Input ariaLabel="Label name" value="service" placeholder="Label name" onChange={() => {}} />
            <Select ariaLabel="Operator" selectedOption={OPERATORS[0]} options={OPERATORS} onChange={() => {}} />
            <Input ariaLabel="Label value" value="" placeholder="Label value" onChange={() => {}} />
          </ControlGroup>
        </FormField>
      </SpaceBetween>
    </SpaceBetween>
  );
}

export default function () {
  return (
    <SimplePage title="Control group scenarios">
      <SpaceBetween size="xl">
        <InteractiveLabelMatcher prefix="matcher" labeled={false} />
        <InteractiveLabelMatcher prefix="labeledMatcher" labeled={true} />
        <InteractiveFilterControl />
        <InteractiveDisabledControl />
        <InteractiveMultiselectControl />
        <NestedInFormFieldControl />
      </SpaceBetween>
    </SimplePage>
  );
}
