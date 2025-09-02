// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useModalContextLoadingComponent } from '../internal/hooks/use-modal-component-analytics';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { SpinnerProps } from './interfaces';

import styles from './styles.css.js';

interface InternalSpinnerProps extends SpinnerProps, InternalBaseComponentProps {}

export default function InternalSpinner({
  size = 'normal',
  variant = 'normal',
  nativeAttributes,
  __internalRootRef,
  ...props
}: InternalSpinnerProps) {
  const baseProps = getBaseProps(props);
  useModalContextLoadingComponent();
  return (
    <WithNativeAttributes
      tag="span"
      nativeAttributes={nativeAttributes}
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[`size-${size}`], styles[`variant-${variant}`])}
      ref={__internalRootRef}
    >
      <span className={clsx(styles.circle, styles['circle-left'])} />
      <span className={clsx(styles.circle, styles['circle-right'])} />
    </WithNativeAttributes>
  );
}
