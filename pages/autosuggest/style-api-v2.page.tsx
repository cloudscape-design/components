// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { Autosuggest, AutosuggestProps, KeyValuePairs } from '~components';

import { SimplePage } from '../app/templates';
import { getInputFieldClassNames } from '../style-api/input-field';

import styles from './style-api-v2.scss';

const options: AutosuggestProps.Options = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'avocado', label: 'Avocado', disabled: true },
];

type StyledAutosuggestProps = Omit<AutosuggestProps, 'value'> & { value?: string };

// The `input` slot forwards to the whole Input style API; the shared helper maps the owned states (invalid,
// warning, disabled, read-only) to classes. The dropdown forwards to Dropdown and opens on focus.
function StyledAutosuggest({
  value: initialValue = '',
  invalid,
  warning,
  disabled,
  readOnly,
  ...rest
}: StyledAutosuggestProps) {
  const [value, setValue] = useState(initialValue);
  const fieldClassNames = getInputFieldClassNames({ invalid, warning, disabled, readOnly });
  return (
    <Autosuggest
      ariaLabel="Autosuggest field"
      placeholder="Search fruits"
      enteredTextLabel={text => `Use: "${text}"`}
      {...rest}
      options={options}
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      invalid={invalid}
      warning={warning}
      disabled={disabled}
      readOnly={readOnly}
      {...{
        styleClassNames: {
          input: {
            ...fieldClassNames,
            input: clsx(fieldClassNames.input, styles['input-input-search']),
            searchIcon: clsx(styles['input-search-icon'], disabled && styles['input-search-icon-disabled']),
            clearButton: styles['input-clear-button'],
          },
          dropdown: { container: styles.dropdown },
        },
      }}
    />
  );
}

export default function () {
  return (
    <SimplePage title="Autosuggest - Style API v2" screenshotArea={{ disableAnimations: true }} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default with clear button',
            value: <StyledAutosuggest value="Apple" />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledAutosuggest />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledAutosuggest value="Banana" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledAutosuggest value="Apricot" warning={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <StyledAutosuggest value="Apple" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with placeholder',
            value: <StyledAutosuggest disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <StyledAutosuggest value="Apple" readOnly={true} />,
          },
          {
            type: 'pair',
            label: 'Open',
            value: <StyledAutosuggest value="Ap" autoFocus={true} />,
          },
        ]}
      />
    </SimplePage>
  );
}
