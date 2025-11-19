// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';
import clsx from 'clsx';

import InternalRadioButton from '../internal/components/radio-button';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { RadioButtonProps } from './interfaces';

import styles from './styles.css.js';

export { RadioButtonProps };

const RadioButton = React.forwardRef((props: RadioButtonProps, ref: React.Ref<HTMLInputElement>) => {
  const baseComponentProps = useBaseComponent('RadioButton', {
    props: { readOnly: Boolean(props.readOnly), disabled: Boolean(props.disabled) },
  });
  return (
    <InternalRadioButton
      {...props}
      {...baseComponentProps}
      className={clsx(props.className, styles['radio-button'])}
      ref={ref}
    />
  );
});

applyDisplayName(RadioButton, 'RadioButton');

/**
 * @awsuiSystem core
 */
export default RadioButton;
