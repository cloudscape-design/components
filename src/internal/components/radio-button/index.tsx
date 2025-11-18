// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { useSingleTabStopNavigation } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { getBaseProps } from '../../base-component';
import AbstractSwitch from '../../components/abstract-switch';
import { fireNonCancelableEvent } from '../../events';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { RadioButtonProps } from './interfaces';
import { getAbstractSwitchStyles, getInnerCircleStyle, getOuterCircleStyle } from './style';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export default React.forwardRef(function RadioButton(
  {
    name,
    children,
    value,
    checked,
    description,
    disabled,
    controlId,
    onChange,
    readOnly,
    className,
    style,
    ...rest
  }: RadioButtonProps & InternalBaseComponentProps,
  ref: React.Ref<HTMLInputElement>
) {
  const radioButtonRef = useRef<HTMLInputElement>(null);
  const mergedRefs = useMergeRefs(radioButtonRef, ref);

  const { tabIndex } = useSingleTabStopNavigation(radioButtonRef);
  const baseProps = getBaseProps(rest);

  return (
    <AbstractSwitch
      {...baseProps}
      className={clsx(testUtilStyles.root, className)}
      controlClassName={styles['radio-control']}
      outlineClassName={styles.outline}
      label={children}
      description={description}
      disabled={disabled}
      readOnly={readOnly}
      controlId={controlId}
      style={getAbstractSwitchStyles(style, checked, disabled, readOnly)}
      __internalRootRef={rest.__internalRootRef}
      {...copyAnalyticsMetadataAttribute(rest)}
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
        fireNonCancelableEvent(onChange, { checked: !checked });
      }}
      styledControl={
        <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
          <circle
            className={clsx(styles['styled-circle-border'], {
              [styles['styled-circle-disabled']]: disabled,
              [styles['styled-circle-readonly']]: readOnly,
            })}
            strokeWidth={6.25}
            cx={50}
            cy={50}
            r={46}
            style={getOuterCircleStyle(style, checked, disabled, readOnly)}
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
            style={getInnerCircleStyle(style, checked, disabled, readOnly)}
          />
        </svg>
      }
    />
  );
});
