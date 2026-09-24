// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { Container, Input, InputProps, KeyValuePairs, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

interface StyledInputProps
  extends Pick<InputProps, 'type' | 'disabled' | 'readOnly' | 'invalid' | 'prefix' | 'suffix' | 'clearAriaLabel'> {
  ariaLabel: string;
  value?: string;
  placeholder?: string;
  inlineLabelText?: string;
  large?: boolean;
}

function StyledInput({
  value: initialValue = '',
  type,
  disabled,
  readOnly,
  invalid,
  large,
  ...rest
}: StyledInputProps) {
  const [value, setValue] = useState(initialValue);
  return (
    <Input
      {...rest}
      value={value}
      type={type}
      disabled={disabled}
      readOnly={readOnly}
      invalid={invalid}
      onChange={({ detail }) => setValue(detail.value)}
      {...{
        styleClassNames: {
          root: clsx(
            styles.field,
            disabled && styles['field-disabled'],
            readOnly && styles['field-readonly'],
            invalid && styles['field-invalid']
          ),
          input: clsx(
            styles['field-input'],
            disabled && styles['field-input-disabled'],
            type === 'search' && styles['field-input-search'],
            large && styles['field-input-large']
          ),
          label: styles['field-label'],
          searchIcon: styles['field-search-icon'],
          clearButton: styles['field-clear'],
        },
      }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="Input - Style API v2" screenshotArea={{}}>
      <KeyValuePairs
        items={[
          {
            type: 'pair',
            label: 'Default, hover and focus',
            value: <StyledInput ariaLabel="Name" placeholder="Enter a name" />,
          },
          {
            type: 'pair',
            label: 'Invalid (four-value border width keeps the start edge)',
            value: <StyledInput ariaLabel="Invalid name" value="Invalid value" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled and read-only',
            value: (
              <SpaceBetween size="xs">
                <StyledInput ariaLabel="Disabled name" placeholder="Enter a name" disabled={true} />
                <StyledInput ariaLabel="Read-only name" value="Read-only value" readOnly={true} />
              </SpaceBetween>
            ),
          },
          {
            type: 'pair',
            label: 'Search (icon, clear button and padding)',
            value: <StyledInput ariaLabel="Search" type="search" value="instances" clearAriaLabel="Clear" />,
          },
          {
            type: 'pair',
            label:
              'Prefix and suffix, nested in a container (the plain label follows the container; the last one has a prefix only)',
            value: (
              <Container>
                <SpaceBetween size="m">
                  <Input
                    ariaLabel="Plain amount"
                    value="10"
                    inlineLabelText="Amount"
                    prefix="$"
                    suffix="USD"
                    readOnly={true}
                  />
                  <StyledInput
                    ariaLabel="Amount"
                    value="10"
                    inlineLabelText="Amount"
                    prefix="$"
                    suffix="USD"
                    large={true}
                  />
                  <StyledInput ariaLabel="Price" placeholder="Enter a price" prefix="$" large={true} />
                </SpaceBetween>
              </Container>
            ),
          },
        ]}
      />
    </SimplePage>
  );
}
