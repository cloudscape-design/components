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
import useRadioGroupForwardFocus from '../internal/hooks/forward-focus/radio-group';

type InternalRadioGroupProps = RadioGroupProps & InternalBaseComponentProps;

const InternalRadioGroup = React.forwardRef(
  (
    {
      name,
      value,
      items,
      ariaLabel,
      ariaRequired,
      ariaControls,
      onChange,
      __internalRootRef = null,
      ...props
    }: InternalRadioGroupProps,
    ref: React.Ref<RadioGroupProps.Ref>
  ) => {
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(props);
    const baseProps = getBaseProps(props);
    const generatedName = useUniqueId('awsui-radio-');

    const [radioButtonRef, radioButtonRefIndex] = useRadioGroupForwardFocus(ref, items, value);

    return (
      <div
        role="radiogroup"
        aria-labelledby={ariaLabelledby}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-required={ariaRequired}
        aria-controls={ariaControls}
        {...baseProps}
        className={clsx(baseProps.className, styles.root)}
        ref={__internalRootRef}
      >
        {items &&
          items.map((item, index) => (
            <RadioButton
              key={item.value}
              ref={index === radioButtonRefIndex ? radioButtonRef : undefined}
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
);

export default InternalRadioGroup;
