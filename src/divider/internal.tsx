// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { DividerProps } from './interfaces';

import styles from './styles.css.js';

type InternalDividerProps = DividerProps & InternalBaseComponentProps;

export default function InternalDivider({
  orientation,
  children,
  nativeAttributes,
  __internalRootRef,
  ...rest
}: InternalDividerProps) {
  const baseProps = getBaseProps(rest);

  const isVertical = orientation === 'vertical';
  const hasLabel = !isVertical && children !== null && children !== undefined;

  const className = clsx(baseProps.className, styles.divider, styles[`divider-${orientation}`], {
    [styles['divider-has-label']]: hasLabel,
  });

  if (hasLabel) {
    return (
      <WithNativeAttributes
        {...baseProps}
        tag="div"
        componentName="Divider"
        nativeAttributes={nativeAttributes}
        className={className}
        ref={__internalRootRef}
      >
        <span className={styles['divider-line']} />
        <span className={styles['divider-label']}>{children}</span>
        <span className={styles['divider-line']} />
      </WithNativeAttributes>
    );
  }

  return (
    <WithNativeAttributes
      {...baseProps}
      tag="hr"
      componentName="Divider"
      nativeAttributes={nativeAttributes}
      className={className}
      role="presentation"
      ref={__internalRootRef}
    />
  );
}
