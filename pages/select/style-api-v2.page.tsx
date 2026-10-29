// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { KeyValuePairs, Select, SelectProps } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const options: SelectProps.Options = [
  { value: '1', label: 'Option 1', description: 'The first option' },
  { value: '2', label: 'Option 2', description: 'The second option' },
  { value: '3', label: 'Option 3', description: 'The third option', disabled: true },
];

type StyledSelectProps = Omit<SelectProps, 'selectedOption' | 'options'> & { selectedOption?: SelectProps.Option };

// Owned states (invalid, warning, disabled, read-only) are passed as a different class; the interaction states
// (:hover, :focus, :focus-within) are handled by selectors in the stylesheet.
function StyledSelect({
  selectedOption: initialSelectedOption,
  invalid,
  warning,
  disabled,
  readOnly,
  ...rest
}: StyledSelectProps) {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option | null>(initialSelectedOption ?? null);
  const triggerClassName = clsx({
    [styles['trigger-invalid']]: invalid,
    [styles['trigger-warning']]: warning && !invalid,
    [styles['trigger-disabled']]: disabled && !invalid && !warning,
    [styles['trigger-readonly']]: readOnly && !disabled && !invalid && !warning,
    [styles.trigger]: !invalid && !warning && !disabled && !readOnly,
  });
  return (
    <Select
      ariaLabel="Select field"
      placeholder="Choose an option"
      filteringAriaLabel="Filter options"
      {...rest}
      options={options}
      selectedOption={selectedOption}
      onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
      invalid={invalid}
      warning={warning}
      disabled={disabled}
      readOnly={readOnly}
      {...{
        styleClassNames: {
          trigger: triggerClassName,
          inlineLabel: clsx(styles['inline-label'], disabled && styles['inline-label-disabled']),
          filter: { root: styles['filter-root'], input: styles['filter-input'] },
          dropdown: { container: styles.dropdown },
        },
      }}
    />
  );
}

// Opens the dropdown on mount so the filter and dropdown slots are visible.
function OpenStyledSelect(props: StyledSelectProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('button')?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }, []);
  return (
    <div ref={ref}>
      <StyledSelect {...props} />
    </div>
  );
}

export default function () {
  return (
    <SimplePage title="Select - Style API v2" screenshotArea={{ disableAnimations: true }} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default',
            value: <StyledSelect selectedOption={options[0]} />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledSelect />,
          },
          {
            type: 'pair',
            label: 'Inline label',
            value: <StyledSelect selectedOption={options[0]} inlineLabelText="Option" />,
          },
          {
            type: 'pair',
            label: 'Inline label disabled',
            value: <StyledSelect selectedOption={options[0]} inlineLabelText="Option" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledSelect selectedOption={options[0]} invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledSelect selectedOption={options[0]} warning={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled',
            value: <StyledSelect selectedOption={options[0]} disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with placeholder',
            value: <StyledSelect disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Read-only',
            value: <StyledSelect selectedOption={options[0]} readOnly={true} />,
          },
          {
            type: 'pair',
            label: 'Trigger variant option',
            value: <StyledSelect selectedOption={options[0]} triggerVariant="option" />,
          },
          {
            type: 'pair',
            label: 'Disabled, trigger variant option',
            value: <StyledSelect selectedOption={options[0]} disabled={true} triggerVariant="option" />,
          },
          {
            type: 'pair',
            label: 'Filtering, open',
            value: <OpenStyledSelect selectedOption={options[0]} filteringType="auto" />,
          },
        ]}
      />
    </SimplePage>
  );
}
