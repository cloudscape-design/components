// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { DividerProps } from './interfaces';

import styles from './styles.css.js';

type InternalDividerProps = DividerProps & InternalBaseComponentProps;

export default function InternalDivider({
  semantic,
  orientation,
  children,
  ariaLabel,
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

  const role = semantic ? 'separator' : 'presentation';
  const ariaOrientation = semantic ? orientation : undefined;

  const labelId = useUniqueId('divider-label-');

  if (hasLabel) {
    return (
      <WithNativeAttributes
        {...baseProps}
        tag="div"
        componentName="Divider"
        nativeAttributes={nativeAttributes}
        className={className}
        role={role}
        aria-orientation={ariaOrientation}
        aria-label={semantic ? ariaLabel : undefined}
        aria-labelledby={semantic && !ariaLabel ? labelId : undefined}
        ref={__internalRootRef}
      >
        <span className={styles['divider-line']} aria-hidden="true" />
        <span id={labelId} className={styles['divider-label']}>
          {children}
        </span>
        <span className={styles['divider-line']} aria-hidden="true" />
      </WithNativeAttributes>
    );
  }

  return (
    <WithNativeAttributes
      {...baseProps}
      tag={isVertical ? 'div' : 'hr'}
      componentName="Divider"
      nativeAttributes={nativeAttributes}
      className={className}
      role={role}
      aria-orientation={ariaOrientation}
      aria-label={semantic ? ariaLabel : undefined}
      ref={__internalRootRef}
    />
  );
}
