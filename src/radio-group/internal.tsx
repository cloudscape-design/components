// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { RadioGroupProps } from './interfaces';
import RadioButton from './radio-button';
import styles from './styles.css.js';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

type InternalRadioGroupProps = RadioGroupProps & InternalBaseComponentProps;

export default function InternalRadioGroup({
  name,
  value,
  items,
  ariaLabel,
  ariaRequired,
  onChange,
  __internalRootRef = null,
  ...props
}: InternalRadioGroupProps) {
  const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(props);
  const baseProps = getBaseProps(props);
  const generatedName = useUniqueId('awsui-radio-');
  return (
    <div
      role="radiogroup"
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-required={ariaRequired}
      {...baseProps}
      className={clsx(baseProps.className, styles.root)}
      ref={__internalRootRef}
    >
      {items &&
        items.map(item => (
          <RadioButton
            key={item.value}
            checked={item.value === value}
            name={name || generatedName}
            value={item.value}
            label={item.label}
            description={item.description}
            disabled={item.disabled}
            onChange={onChange}
            controlId={item.controlId}
          />
        ))}
    </div>
  );
}
