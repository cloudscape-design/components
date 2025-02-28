// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component/index.js';
import { useFormFieldContext } from '../internal/context/form-field-context.js';
import useRadioGroupForwardFocus from '../internal/hooks/forward-focus/radio-group.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { GeneratedAnalyticsMetadataRadioGroupSelect } from './analytics-metadata/interfaces.js';
import { RadioGroupProps } from './interfaces.js';
import RadioButton from './radio-button.js';

import styles from './styles.css.js';

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
      readOnly,
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
        aria-readonly={readOnly ? 'true' : undefined}
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
              readOnly={readOnly}
              {...getAnalyticsMetadataAttribute(
                !item.disabled && !readOnly
                  ? {
                      detail: {
                        position: `${index + 1}`,
                        value: item.value,
                      } as Partial<GeneratedAnalyticsMetadataRadioGroupSelect['detail']>,
                    }
                  : {}
              )}
            />
          ))}
      </div>
    );
  }
);

export default InternalRadioGroup;
