// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { Input, InputProps, KeyValuePairs } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

// Owned states (invalid, warning, disabled, read-only) are passed as a different class per slot; the interaction
// states (:hover, :focus-within, :focus, :placeholder-shown) are handled by selectors in the stylesheet.
function StyledInput({ value: initialValue, invalid, warning, disabled, readOnly, ...rest }: InputProps) {
  const [value, setValue] = useState(initialValue);
  const rootClassName = clsx({
    [styles['input-root-invalid']]: invalid,
    [styles['input-root-warning']]: warning && !invalid,
    [styles['input-root-disabled']]: disabled && !invalid && !warning,
    [styles['input-root-readonly']]: readOnly && !disabled && !invalid && !warning,
    [styles['input-root']]: !invalid && !warning && !disabled && !readOnly,
  });
  return (
    <Input
      {...rest}
      ariaLabel="Input field"
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      invalid={invalid}
      warning={warning}
      disabled={disabled}
      readOnly={readOnly}
      {...{
        styleClassNames: {
          root: rootClassName,
          input: clsx(
            styles['input-input'],
            rest.type === 'search' && styles['input-input-search'],
            disabled && styles['input-input-disabled'],
            readOnly && !disabled && styles['input-input-readonly']
          ),
          inlineLabel: clsx(styles['input-inline-label'], disabled && styles['input-inline-label-disabled']),
          searchIcon: clsx(styles['input-search-icon'], disabled && styles['input-search-icon-disabled']),
          clearButton: styles['input-clear-button'],
        },
      }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="Input - Style API v2" screenshotArea={{}} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default with prefix and suffix',
            value: <StyledInput value="1200" prefix="$" suffix="USD" />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledInput value="" placeholder="Enter an amount" />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledInput value="-5" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledInput value="999999" warning={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with prefix and suffix',
            value: <StyledInput value="1200" prefix="$" suffix="USD" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <StyledInput value="1200" readOnly={true} />,
          },
          {
            type: 'pair',
            label: 'Inline label',
            value: <StyledInput value="1200" inlineLabelText="Amount" />,
          },
          {
            type: 'pair',
            label: 'Inline label disabled',
            value: <StyledInput value="1200" inlineLabelText="Amount" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Search with clear button',
            value: <StyledInput type="search" value="invoices" />,
          },
          {
            type: 'pair',
            label: 'Search disabled',
            value: <StyledInput type="search" value="invoices" disabled={true} />,
          },
        ]}
      />
    </SimplePage>
  );
}
