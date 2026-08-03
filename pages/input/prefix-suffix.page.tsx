// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Box from '~components/box';
import FormField from '~components/form-field';
import Icon from '~components/icon';
import Input, { InputProps } from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PrefixSuffixMode = 'none' | 'short' | 'long' | 'icon';

type PageContext = React.Context<
  AppContextType<{
    type?: InputProps.Type;
    prefix?: PrefixSuffixMode;
    suffix?: PrefixSuffixMode;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warning?: boolean;
    value?: string;
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

const prefixSuffixOptions: ReadonlyArray<SelectProps.Option> = [
  { value: 'none', label: 'None' },
  { value: 'short', label: 'Short text' },
  { value: 'long', label: 'Long text' },
  { value: 'icon', label: 'Icon' },
];

function getPrefix(mode: PrefixSuffixMode): React.ReactNode {
  switch (mode) {
    case 'short':
      return '$';
    case 'long':
      return 'https://example.com/very-long-prefix-that-overflows';
    case 'icon':
      return <Icon name="search" />;
    default:
      return undefined;
  }
}

function getSuffix(mode: PrefixSuffixMode): React.ReactNode {
  switch (mode) {
    case 'short':
      return '%';
    case 'long':
      return '.ec2.internal.very-long-domain-that-overflows';
    case 'icon':
      return <Icon name="settings" />;
    default:
      return undefined;
  }
}

export default function PrefixSuffixPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const type = urlParams.type ?? 'text';
  const prefixMode = urlParams.prefix ?? 'short';
  const suffixMode = urlParams.suffix ?? 'short';
  const disabled = urlParams.disabled ?? false;
  const readOnly = urlParams.readOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;

  return (
    <SimplePage
      title="Input prefix and suffix"
      settings={
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Select
            inlineLabelText="Type"
            selectedOption={typeOptions.find(option => option.value === type) ?? null}
            options={typeOptions}
            onChange={({ detail }) => setUrlParams({ type: detail.selectedOption.value as InputProps.Type })}
          />
          <Select
            inlineLabelText="Prefix"
            selectedOption={prefixSuffixOptions.find(option => option.value === prefixMode) ?? null}
            options={prefixSuffixOptions}
            onChange={({ detail }) => setUrlParams({ prefix: detail.selectedOption.value as PrefixSuffixMode })}
          />
          <Select
            inlineLabelText="Suffix"
            selectedOption={prefixSuffixOptions.find(option => option.value === suffixMode) ?? null}
            options={prefixSuffixOptions}
            onChange={({ detail }) => setUrlParams({ suffix: detail.selectedOption.value as PrefixSuffixMode })}
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
      <FormField
        label="Input with prefix and suffix"
        errorText={invalid ? 'Validation error.' : undefined}
        warningText={warning && !invalid ? 'Validation warning.' : undefined}
      >
        <Input
          value={urlParams.value ?? ''}
          onChange={({ detail }) => setUrlParams({ value: detail.value })}
          type={type}
          prefix={getPrefix(prefixMode)}
          suffix={getSuffix(suffixMode)}
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
          warning={warning}
          placeholder="Enter a value"
          clearAriaLabel="Clear"
        />
      </FormField>

      {type === 'search' && (
        <Box variant="small" color="text-body-secondary">
          Prefix and suffix are ignored for search inputs.
        </Box>
      )}
    </SimplePage>
  );
}
