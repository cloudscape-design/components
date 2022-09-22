// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { getBaseProps } from '../internal/base-component';
import AbstractSwitch from '../internal/components/abstract-switch';
import { CheckboxProps } from './interfaces';
import styles from './styles.css.js';
import CheckboxIcon from '../internal/components/checkbox-icon';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

interface InternalProps extends CheckboxProps, InternalBaseComponentProps {
  tabIndex?: -1;
}

const InternalCheckbox = React.forwardRef<CheckboxProps.Ref, InternalProps>(
  (
    {
      controlId,
      name,
      checked,
      disabled,
      indeterminate,
      children,
      description,
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
      onFocus,
      onBlur,
      onChange,
      tabIndex,
      __internalRootRef,
      ...rest
    },
    ref
  ) => {
    const baseProps = getBaseProps(rest);
    const checkboxRef = useRef<HTMLInputElement>(null);
    useForwardFocus(ref, checkboxRef);
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = Boolean(indeterminate);
      }
    });

    return (
      <AbstractSwitch
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        controlClassName={styles['checkbox-control']}
        outlineClassName={styles.outline}
        controlId={controlId}
        disabled={disabled}
        label={children}
        description={description}
        descriptionBottomPadding={true}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        ariaDescribedby={ariaDescribedby}
        nativeControl={nativeControlProps => (
          <input
            {...nativeControlProps}
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            name={name}
            tabIndex={tabIndex}
            onFocus={() => fireNonCancelableEvent(onFocus)}
            onBlur={() => fireNonCancelableEvent(onBlur)}
            // empty handler to suppress React controllability warning
            onChange={() => {}}
          />
        )}
        onClick={() =>
          fireNonCancelableEvent(
            onChange,
            // for deterministic transitions "indeterminate" -> "checked" -> "unchecked"
            indeterminate ? { checked: true, indeterminate: false } : { checked: !checked, indeterminate: false }
          )
        }
        styledControl={<CheckboxIcon checked={checked} indeterminate={indeterminate} disabled={disabled} />}
        __internalRootRef={__internalRootRef}
      />
    );
  }
);

export default InternalCheckbox;
