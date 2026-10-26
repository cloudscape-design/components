// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { KeyValuePairs, Textarea, TextareaProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

function StyledTextarea({ value: initialValue, invalid, warning, disabled, readOnly, ...rest }: TextareaProps) {
  const [value, setValue] = useState(initialValue);
  const className = clsx({
    [styles['textarea-invalid']]: invalid,
    [styles['textarea-warning']]: warning && !invalid,
    [styles['textarea-disabled']]: disabled && !invalid && !warning,
    [styles['textarea-readonly']]: readOnly && !disabled && !invalid && !warning,
    [styles.textarea]: !invalid && !warning && !disabled && !readOnly,
  });
  return (
    <Textarea
      {...rest}
      ariaLabel="Textarea field"
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      invalid={invalid}
      warning={warning}
      disabled={disabled}
      readOnly={readOnly}
      {...{ styleClassNames: { textarea: className } }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="Textarea - Style API v2" screenshotArea={{}} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default',
            value: <StyledTextarea value={'First line\nSecond line'} />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledTextarea value="" placeholder="Enter a description" />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledTextarea value="Too short" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledTextarea value="Almost at the limit" warning={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <StyledTextarea value="Cannot be edited" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with placeholder',
            value: <StyledTextarea value="" placeholder="Enter a description" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <StyledTextarea value="Read-only text" readOnly={true} />,
          },
        ]}
      />
    </SimplePage>
  );
}
