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
import { getDividerStyles } from './style';

import styles from './styles.css.js';

export { DividerProps };

export default function Divider({ decorative = true, style, nativeAttributes, ...rest }: DividerProps) {
  const { __internalRootRef } = useBaseComponent('Divider', { props: { decorative } });
  const baseProps = getBaseProps(rest);

  return (
    <WithNativeAttributes
      {...baseProps}
      tag="hr"
      componentName="Divider"
      nativeAttributes={nativeAttributes}
      className={clsx(baseProps.className, styles.divider)}
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={decorative ? undefined : 'horizontal'}
      ref={__internalRootRef}
      style={getDividerStyles(style)}
    />
  );
}

applyDisplayName(Divider, 'Divider');
