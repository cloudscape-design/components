// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import AbstractSwitch from '../internal/components/abstract-switch';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { RadioGroupProps } from './interfaces';

import styles from './styles.css.js';

interface RadioButtonProps extends RadioGroupProps.RadioButtonDefinition {
  name: string;
  checked: boolean;
  onChange?: NonCancelableEventHandler<RadioGroupProps.ChangeDetail>;
  readOnly?: boolean;
}

export default React.forwardRef(function RadioButton(
  { name, label, value, checked, description, disabled, controlId, onChange, readOnly }: RadioButtonProps,
  ref: React.Ref<HTMLInputElement>
) {
  const isVisualRefresh = useVisualRefresh();
  const radioButtonRef = useRef<HTMLInputElement>(null);
  const mergedRefs = useMergeRefs(radioButtonRef, ref);

  const { tabIndex } = useSingleTabStopNavigation(radioButtonRef);

  return (
    <AbstractSwitch
      className={clsx(styles.radio, description && styles['radio--has-description'])}
      controlClassName={styles['radio-control']}
      outlineClassName={styles.outline}
      label={label}
      description={description}
      disabled={disabled}
      readOnly={readOnly}
      controlId={controlId}
      nativeControl={nativeControlProps => (
        <input
          {...nativeControlProps}
          tabIndex={tabIndex}
          type="radio"
          ref={mergedRefs}
          name={name}
          value={value}
          checked={checked}
          aria-disabled={readOnly && !disabled ? 'true' : undefined}
          // empty handler to suppress React controllability warning
          onChange={() => {}}
        />
      )}
      onClick={() => {
        radioButtonRef.current?.focus();
        if (checked) {
          return;
        }
        fireNonCancelableEvent(onChange, { value });
      }}
      styledControl={
        <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
          <circle
            className={clsx(styles['styled-circle-border'], {
              [styles['styled-circle-disabled']]: disabled,
              [styles['styled-circle-readonly']]: readOnly,
            })}
            strokeWidth={isVisualRefresh ? 12 : 8}
            cx={50}
            cy={50}
            r={isVisualRefresh ? 44 : 46}
          />
          <circle
            className={clsx(styles['styled-circle-fill'], {
              [styles['styled-circle-disabled']]: disabled,
              [styles['styled-circle-checked']]: checked,
              [styles['styled-circle-readonly']]: readOnly,
            })}
            strokeWidth={30}
            cx={50}
            cy={50}
            r={35}
          />
        </svg>
      }
    />
  );
});
