// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { SpinnerProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

interface InternalSpinnerProps extends SpinnerProps, InternalBaseComponentProps {}

export default function InternalSpinner({
  size = 'normal',
  variant = 'normal',
  __internalRootRef,
  ...props
}: InternalSpinnerProps) {
  const baseProps = getBaseProps(props);

  return (
    <span
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[`size-${size}`], styles[`variant-${variant}`])}
      ref={__internalRootRef}
    >
      <span className={clsx(styles.circle, styles['circle-left'])} />
      <span className={clsx(styles.circle, styles['circle-right'])} />
    </span>
  );
}
