// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import FormField from '~components/form-field';
import Input, { InputProps } from '~components/input';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Token from '~components/token';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warning?: boolean;
  }>
>;

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
  const disabled = urlParams.disabled ?? false;
  const readOnly = urlParams.readOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;

  const sharedInputProps: Partial<InputProps> = { disabled, readOnly, invalid, warning };
  const sharedFieldProps = {
    errorText: invalid ? 'Validation error.' : undefined,
    warningText: warning && !invalid ? 'Validation warning.' : undefined,
  };

  return (
    <SimplePage
      title="Input — leadingContent"
      settings={
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
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
              value=""
              onChange={() => {}}
              ariaLabel="Filter"
              {...sharedInputProps}
              leadingContent={singleToken(disabled, readOnly)}
            />
          </div>
        </FormField>

        {/* 2. Slot absent — baseline */}
        <FormField label="Slot absent (baseline)" {...sharedFieldProps}>
          <div data-testid="slot-absent">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter baseline"
              placeholder="leadingContent not set"
              {...sharedInputProps}
            />
          </div>
        </FormField>

        {/* 3. Overflow — many tokens, slot scrolls horizontally */}
        <FormField label="Overflow (many tokens)" {...sharedFieldProps}>
          <div data-testid="slot-overflow">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter regions"
              {...sharedInputProps}
              leadingContent={overflowTokens(disabled, readOnly)}
            />
          </div>
        </FormField>

        {/* 4. Interactive content — button inside the slot */}
        <FormField label="Interactive content (button)" {...sharedFieldProps}>
          <div data-testid="slot-interactive">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter with action"
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
              value=""
              onChange={() => {}}
              ariaLabel="Filter with label"
              {...sharedInputProps}
              leadingContent={<span style={{ whiteSpace: 'nowrap' }}>Filter:</span>}
            />
          </div>
        </FormField>

        {/* 6. Alongside prefix and suffix */}
        <FormField label="With prefix and suffix" {...sharedFieldProps}>
          <div data-testid="slot-with-prefix-suffix">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter with prefix and suffix"
              prefix="$"
              suffix="USD"
              {...sharedInputProps}
              leadingContent={singleToken(disabled, readOnly)}
            />
          </div>
        </FormField>
      </SpaceBetween>
    </SimplePage>
  );
}
