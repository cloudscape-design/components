// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Multiselect, MultiselectProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import { getInputFieldClassNames } from '../style-api/input-field';

import styles from './style-api-v2.scss';

const options: ReadonlyArray<MultiselectProps.Option> = [
  { value: '1', label: 'Option 1', description: 'The first option' },
  { value: '2', label: 'Option 2', description: 'The second option' },
  { value: '3', label: 'Option 3', description: 'The third option' },
  { value: '4', label: 'Option 4', description: 'The fourth option', disabled: true },
];

type StyledMultiselectProps = Omit<MultiselectProps, 'selectedOptions' | 'options'> & {
  selectedOptions?: ReadonlyArray<MultiselectProps.Option>;
};

// Owned states (invalid, warning, disabled, read-only) are passed as a different class; the interaction states
// (:hover, :focus, :focus-within) are handled by selectors in the stylesheet. The token forward gets one class for
// the tokens below the trigger and one for the inline tokens.
function StyledMultiselect({
  selectedOptions: initialSelectedOptions = [],
  invalid,
  warning,
  disabled,
  readOnly,
  inlineTokens,
  ...rest
}: StyledMultiselectProps) {
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);
  const triggerClassName = clsx({
    [styles['trigger-invalid']]: invalid,
    [styles['trigger-warning']]: warning && !invalid,
    [styles['trigger-disabled']]: disabled && !invalid && !warning,
    [styles['trigger-readonly']]: readOnly && !disabled && !invalid && !warning,
    [styles.trigger]: !invalid && !warning && !disabled && !readOnly,
  });
  const filterClassNames = getInputFieldClassNames({});
  return (
    <Multiselect
      ariaLabel="Multiselect field"
      placeholder="Choose options"
      filteringAriaLabel="Filter options"
      deselectAriaLabel={option => `Remove ${option.label}`}
      {...rest}
      options={options}
      selectedOptions={selectedOptions}
      onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
      invalid={invalid}
      warning={warning}
      disabled={disabled}
      readOnly={readOnly}
      inlineTokens={inlineTokens}
      {...{
        styleClassNames: {
          trigger: triggerClassName,
          inlineLabel: clsx(styles['inline-label'], disabled && styles['inline-label-disabled']),
          filter: {
            ...filterClassNames,
            input: clsx(filterClassNames.input, styles['filter-input-search']),
            searchIcon: styles['filter-search-icon'],
          },
          dropdown: styles.dropdown,
          token: {
            root: clsx(inlineTokens ? styles['token-inline'] : styles.token, disabled && styles['token-disabled']),
            dismissButton: clsx(styles['token-dismiss'], (disabled || readOnly) && styles['token-dismiss-disabled']),
          },
        },
      }}
    />
  );
}

// Opens the dropdown on mount so the filter and dropdown slots are visible.
function OpenStyledMultiselect(props: StyledMultiselectProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector('button')?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  }, []);
  return (
    <div ref={ref}>
      <StyledMultiselect {...props} />
    </div>
  );
}

export default function () {
  return (
    <SimplePage title="Multiselect - Style API v2" screenshotArea={{ disableAnimations: true }} i18n={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <StyledMultiselect selectedOptions={[options[0], options[1]]} />
        <StyledMultiselect />
        <StyledMultiselect selectedOptions={[options[0]]} inlineLabelText="Options" />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledMultiselect selectedOptions={[options[0]]} invalid={true} />
        <StyledMultiselect selectedOptions={[options[0]]} warning={true} />
        <StyledMultiselect selectedOptions={[options[0], options[1]]} readOnly={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <StyledMultiselect selectedOptions={[options[0], options[1]]} disabled={true} />
        <StyledMultiselect selectedOptions={[options[0]]} inlineLabelText="Options" disabled={true} />
        <StyledMultiselect selectedOptions={[options[0], options[1]]} inlineTokens={true} />
      </SpaceBetween>
      <SpaceBetween size="m" direction="horizontal">
        <OpenStyledMultiselect selectedOptions={[options[0]]} filteringType="auto" />
      </SpaceBetween>
    </SimplePage>
  );
}
