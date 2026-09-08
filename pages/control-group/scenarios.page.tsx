// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ControlGroup from '~components/control-group';
import Input from '~components/input';
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

function isValidRegex(value: string) {
  try {
    RegExp(value);
    return true;
  } catch {
    return false;
  }
}

function InteractiveLabelMatcher() {
  const { urlParams, setUrlParams } = useAppContext<
    'matcherName' | 'matcherOperator' | 'matcherValue' | 'matcherRemoved'
  >();

  // When removed, unmount the ControlGroup entirely and offer a way to restore it.
  const removed = urlParams.matcherRemoved === true;

  const name = typeof urlParams.matcherName === 'string' ? urlParams.matcherName : 'service';
  const value = typeof urlParams.matcherValue === 'string' ? urlParams.matcherValue : '';
  const operator = OPERATORS.find(option => option.value === urlParams.matcherOperator) ?? OPERATORS[0];

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
      <Box variant="h3">Label matcher (triggers error / warning)</Box>
      <Box variant="small">
        Pick <code>=~</code> or <code>!~</code> and type an invalid regex (for example <code>[abc</code>) to trigger an
        error. Pick <code>!=</code> or <code>!~</code> to trigger a warning. The remove button unmounts the group.
      </Box>
      {removed ? (
        <Button iconName="add-plus" onClick={() => setUrlParams({ matcherRemoved: false })}>
          Restore label matcher
        </Button>
      ) : (
        <ControlGroup
          ariaLabel="Label matcher"
          dismissible={true}
          onDismiss={() => setUrlParams({ matcherRemoved: true })}
          i18nStrings={{ dismissAriaLabel: 'Remove label matcher' }}
          errorText={errorText}
          warningText={warningText}
        >
          <Input
            ariaLabel="Label name"
            inlineLabelText="Label"
            value={name}
            placeholder="Label name"
            onChange={e => setUrlParams({ matcherName: e.detail.value })}
          />
          <Select
            ariaLabel="Operator"
            selectedOption={operator}
            options={OPERATORS}
            onChange={e => setUrlParams({ matcherOperator: e.detail.selectedOption.value ?? '=' })}
          />
          <Input
            ariaLabel="Label value"
            value={value}
            placeholder="Label value"
            onChange={e => setUrlParams({ matcherValue: e.detail.value })}
          />
        </ControlGroup>
      )}
    </SpaceBetween>
  );
}

export default function () {
  return (
    <SimplePage title="Control group scenarios">
      <InteractiveLabelMatcher />
    </SimplePage>
  );
}
