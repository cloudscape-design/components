// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../internal/base-component';
import RadioButton from '../internal/components/radio-button';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireNonCancelableEvent } from '../internal/events';
import useRadioGroupForwardFocus from '../internal/hooks/forward-focus/radio-group';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { GeneratedAnalyticsMetadataRadioGroupSelect } from './analytics-metadata/interfaces';
import { RadioGroupProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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
      __internalRootRef,
      style,
      direction,
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
        className={clsx(
          baseProps.className,
          testUtilStyles.root,
          styles['radio-group'],
          direction === 'horizontal' && styles['horizontal-group']
        )}
        ref={__internalRootRef}
      >
        {items &&
          items.map((item, index) => (
            <RadioButton
              key={item.value}
              ref={index === radioButtonRefIndex ? radioButtonRef : undefined}
              className={clsx(
                styles.radio,
                item.description && styles['radio--has-description'],
                direction === 'horizontal' && styles.horizontal,
                item.value === value && analyticsSelectors.selected
              )}
              checked={item.value === value}
              name={name || generatedName}
              value={item.value}
              description={item.description}
              disabled={item.disabled}
              onSelect={() => fireNonCancelableEvent(onChange, { value: item.value })}
              controlId={item.controlId}
              readOnly={readOnly}
              style={style}
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
            >
              {item.label}
            </RadioButton>
          ))}
      </div>
    );
  }
);

export default InternalRadioGroup;
