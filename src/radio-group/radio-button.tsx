// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import AbstractSwitch from '../internal/components/abstract-switch';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { RadioGroupProps } from './interfaces';
import styles from './styles.css.js';

interface RadioButtonProps extends RadioGroupProps.RadioButtonDefinition {
  name: string;
  checked: boolean;
  withoutLabel?: boolean;
  onChange?: NonCancelableEventHandler<RadioGroupProps.ChangeDetail>;
}

export default function RadioButton({
  name,
  label,
  value,
  checked,
  withoutLabel,
  description,
  disabled,
  controlId,
  onChange,
}: RadioButtonProps) {
  const isVisualRefresh = useVisualRefresh();
  return (
    <AbstractSwitch
      className={clsx(styles.radio, description && styles['radio--has-description'])}
      controlClassName={styles['radio-control']}
      label={label}
      description={description}
      disabled={disabled}
      controlId={controlId}
      nativeControl={nativeControlProps => (
        <input
          {...nativeControlProps}
          className={styles.input}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange && (() => fireNonCancelableEvent(onChange, { value }))}
        />
      )}
      styledControl={
        <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
          <circle
            className={clsx(styles['styled-circle-border'], { [styles['styled-circle-disabled']]: disabled })}
            strokeWidth={isVisualRefresh ? 12 : 8}
            cx={50}
            cy={50}
            r={isVisualRefresh ? 44 : 46}
          />
          <circle
            className={clsx(styles['styled-circle-fill'], {
              [styles['styled-circle-disabled']]: disabled,
              [styles['styled-circle-checked']]: checked,
            })}
            strokeWidth={30}
            cx={50}
            cy={50}
            r={35}
          />
        </svg>
      }
      withoutLabel={withoutLabel}
    />
  );
}
