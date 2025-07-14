// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useModalContextLoadingComponent } from '../internal/hooks/use-modal-component-analytics/index.js';
import { SpinnerProps } from './interfaces.js';

import styles from './styles.css.js';

interface InternalSpinnerProps extends SpinnerProps, InternalBaseComponentProps {}

export default function InternalSpinner({
  size = 'normal',
  variant = 'normal',
  __internalRootRef,
  ...props
}: InternalSpinnerProps) {
  const baseProps = getBaseProps(props);
  useModalContextLoadingComponent();
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
