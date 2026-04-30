// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { DividerProps } from './interfaces';

import styles from './styles.css.js';

export { DividerProps };

export default function Divider({
  semantic = false,
  orientation = 'horizontal',
  children,
  nativeAttributes,
  ...rest
}: DividerProps) {
  const { __internalRootRef } = useBaseComponent('Divider', { props: { semantic, orientation } });
  const baseProps = getBaseProps(rest);

  const isVertical = orientation === 'vertical';
  const hasLabel = !isVertical && children !== null && children !== undefined;

  const className = clsx(baseProps.className, styles.divider, styles[`divider-${orientation}`], {
    [styles['divider-has-label']]: hasLabel,
  });

  const role = semantic ? 'separator' : 'presentation';
  const ariaOrientation = semantic ? orientation : undefined;

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
        ref={__internalRootRef}
      >
        <span className={styles['divider-line']} aria-hidden="true" />
        <span className={styles['divider-label']}>{children}</span>
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
      ref={__internalRootRef}
    />
  );
}

applyDisplayName(Divider, 'Divider');
