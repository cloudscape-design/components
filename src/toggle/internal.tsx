// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useRef } from 'react';
import AbstractSwitch from '../internal/components/abstract-switch';
import useForwardFocus from '../internal/hooks/forward-focus';
import { fireNonCancelableEvent } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { ToggleProps } from './interfaces';
import { useFormFieldContext } from '../internal/context/form-field-context';

type InternalToggleProps = ToggleProps & InternalBaseComponentProps;

const InternalToggle = React.forwardRef<ToggleProps.Ref, InternalToggleProps>(
  (
    {
      controlId,
      checked,
      name,
      disabled,
      children,
      description,
      ariaLabel,
      ariaControls,
      onFocus,
      onBlur,
      onChange,
      __internalRootRef = null,
      ...rest
    },
    ref
  ) => {
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);
    const checkboxRef = useRef<HTMLInputElement>(null);
    useForwardFocus(ref, checkboxRef);

    return (
      <AbstractSwitch
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        controlClassName={clsx(styles['toggle-control'], {
          [styles['toggle-control-checked']]: checked,
          [styles['toggle-control-disabled']]: disabled,
        })}
        outlineClassName={styles.outline}
        controlId={controlId}
        disabled={disabled}
        label={children}
        description={description}
        descriptionBottomPadding={true}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        ariaDescribedby={ariaDescribedby}
        ariaControls={ariaControls}
        nativeControl={nativeControlProps => (
          <input
            {...nativeControlProps}
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            name={name}
            onFocus={() => fireNonCancelableEvent(onFocus)}
            onBlur={() => fireNonCancelableEvent(onBlur)}
            // empty handler to suppress React controllability warning
            onChange={() => {}}
          />
        )}
        onClick={() => {
          checkboxRef.current?.focus();
          fireNonCancelableEvent(onChange, { checked: !checked });
        }}
        styledControl={
          /*Using span, not div for HTML validity*/
          <span
            className={clsx(styles['toggle-handle'], {
              [styles['toggle-handle-checked']]: checked,
              [styles['toggle-handle-disabled']]: disabled,
            })}
          />
        }
        __internalRootRef={__internalRootRef}
      />
    );
  }
);

export default InternalToggle;
