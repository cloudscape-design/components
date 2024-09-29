// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useModalComponentAnalytics } from '../internal/hooks/use-modal-component-analytics';
import { SpinnerProps } from './interfaces';

import styles from './styles.css.js';

interface InternalSpinnerProps extends SpinnerProps, InternalBaseComponentProps {}

export default function InternalSpinner({
  size = 'normal',
  variant = 'normal',
  __internalRootRef,
  ...props
}: InternalSpinnerProps) {
  const baseProps = getBaseProps(props);
  useModalComponentAnalytics();
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
