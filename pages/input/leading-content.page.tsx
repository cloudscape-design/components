// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import FormField from '~components/form-field';
import Input, { InputProps } from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Token from '~components/token';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    type?: InputProps.Type;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warning?: boolean;
  }>
>;

const typeOptions: ReadonlyArray<SelectProps.Option> = [
  { value: 'text', label: 'Text' },
  { value: 'password', label: 'Password' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'search', label: 'Search' },
];

const REGIONS = [
  'us-east-1',
  'us-west-2',
  'eu-west-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'sa-east-1',
  'ca-central-1',
  'eu-central-1',
];

const singleToken = (disabled: boolean, readOnly: boolean) => (
  <Token
    variant="inline"
    label="us-east-1"
    dismissLabel="Remove us-east-1"
    disabled={disabled}
    readOnly={readOnly}
    onDismiss={() => {}}
  />
);

const overflowTokens = (disabled: boolean, readOnly: boolean) => (
  <span style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
    {REGIONS.map(r => (
      <Token
        key={r}
        variant="inline"
        label={r}
        dismissLabel={`Remove ${r}`}
        disabled={disabled}
        readOnly={readOnly}
        onDismiss={() => {}}
      />
    ))}
  </span>
);

export default function LeadingContentPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const type = (urlParams.type ?? 'text') as InputProps.Type;
  const disabled = urlParams.disabled ?? false;
  const readOnly = urlParams.readOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;

  const [slotPresentValue, setSlotPresentValue] = useState('');
  const [slotAbsentValue, setSlotAbsentValue] = useState('');
  const [overflowValue, setOverflowValue] = useState('');
  const [interactiveValue, setInteractiveValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [prefixSuffixValue, setPrefixSuffixValue] = useState('');
  const [maxContentValue, setMaxContentValue] = useState('');

  const sharedInputProps: Partial<InputProps> = { type, disabled, readOnly, invalid, warning };
  const sharedFieldProps = {
    errorText: invalid ? 'Validation error.' : undefined,
    warningText: warning && !invalid ? 'Validation warning.' : undefined,
  };

  return (
    <SimplePage
      title="Input — leadingContent"
      settings={
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Select
            inlineLabelText="Type"
            selectedOption={typeOptions.find(o => o.value === type) ?? null}
            options={typeOptions}
            onChange={({ detail }) => setUrlParams({ type: detail.selectedOption.value as InputProps.Type })}
          />
          <Toggle checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
            Disabled
          </Toggle>
          <Toggle checked={readOnly} onChange={({ detail }) => setUrlParams({ readOnly: detail.checked })}>
            Read-only
          </Toggle>
          <Toggle checked={invalid} onChange={({ detail }) => setUrlParams({ invalid: detail.checked })}>
            Invalid
          </Toggle>
          <Toggle checked={warning} onChange={({ detail }) => setUrlParams({ warning: detail.checked })}>
            Warning
          </Toggle>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        {/* 1. Slot present — single token */}
        <FormField label="Slot present (single token)" {...sharedFieldProps}>
          <div data-testid="slot-present">
            <Input
              ariaLabel="Filter"
              value={slotPresentValue}
              onChange={({ detail }) => setSlotPresentValue(detail.value)}
              {...sharedInputProps}
              leadingContent={singleToken(disabled, readOnly)}
            />
          </div>
        </FormField>

        {/* 2. Slot absent — baseline */}
        <FormField label="Slot absent (baseline)" {...sharedFieldProps}>
          <div data-testid="slot-absent">
            <Input
              ariaLabel="Filter baseline"
              value={slotAbsentValue}
              onChange={({ detail }) => setSlotAbsentValue(detail.value)}
              placeholder="leadingContent not set"
              {...sharedInputProps}
            />
          </div>
        </FormField>

        {/* 3. Overflow — many tokens, slot scrolls horizontally */}
        <FormField label="Overflow (many tokens)" {...sharedFieldProps}>
          <div data-testid="slot-overflow">
            <Input
              ariaLabel="Filter regions"
              value={overflowValue}
              onChange={({ detail }) => setOverflowValue(detail.value)}
              {...sharedInputProps}
              leadingContent={overflowTokens(disabled, readOnly)}
            />
          </div>
        </FormField>

        {/* 4. Interactive content — button inside the slot */}
        <FormField label="Interactive content (button)" {...sharedFieldProps}>
          <div data-testid="slot-interactive">
            <Input
              ariaLabel="Filter with action"
              value={interactiveValue}
              onChange={({ detail }) => setInteractiveValue(detail.value)}
              {...sharedInputProps}
              leadingContent={
                <button
                  type="button"
                  disabled={disabled}
                  style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                  onClick={() => {}}
                >
                  Action
                </button>
              }
            />
          </div>
        </FormField>

        {/* 5. Plain text content (non-interactive) */}
        <FormField label="Plain text content" {...sharedFieldProps}>
          <div data-testid="slot-text">
            <Input
              ariaLabel="Filter with label"
              value={textValue}
              onChange={({ detail }) => setTextValue(detail.value)}
              {...sharedInputProps}
              leadingContent={<span style={{ whiteSpace: 'nowrap' }}>Filter:</span>}
            />
          </div>
        </FormField>

        {/* 6. Alongside prefix and suffix */}
        <FormField label="With prefix and suffix" {...sharedFieldProps}>
          <div data-testid="slot-with-prefix-suffix">
            <Input
              ariaLabel="Filter with prefix and suffix"
              value={prefixSuffixValue}
              onChange={({ detail }) => setPrefixSuffixValue(detail.value)}
              prefix="$"
              suffix="USD"
              {...sharedInputProps}
              leadingContent={singleToken(disabled, readOnly)}
            />
          </div>
        </FormField>

        {/* 7. All slots at maximum content — exercises overflow and layout under load */}
        <FormField label="Max content (prefix + leadingContent + suffix all overflowing)" {...sharedFieldProps}>
          <Input
            ariaLabel="Filter with max content"
            value={maxContentValue}
            onChange={({ detail }) => setMaxContentValue(detail.value)}
            prefix="https://very-long-prefix-that-overflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflowsoverflows"
            suffix=".ec2.internal.very-long-suffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffixsuffix"
            {...sharedInputProps}
            leadingContent={overflowTokens(disabled, readOnly)}
          />
        </FormField>
      </SpaceBetween>
    </SimplePage>
  );
}
