// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { BadgeProps } from './interfaces';
import { getBadgeStyles } from './style';

import styles from './styles.css.js';

export { BadgeProps };

// Style API v2
interface StyleClassNames {
  root?: string;
}

export default function Badge({ color = 'grey', children, style, nativeAttributes, ...rest }: BadgeProps) {
  const { __internalRootRef } = useBaseComponent('Badge', { props: { color } });
  const baseProps = getBaseProps(rest);
  const { styleClassNames } = rest as { styleClassNames?: StyleClassNames };

  const className = clsx(baseProps.className, styleClassNames?.root, styles.badge, styles[`badge-color-${color}`]);

  return (
    <WithNativeAttributes
      {...baseProps}
      tag="span"
      componentName="Badge"
      nativeAttributes={nativeAttributes}
      className={className}
      ref={__internalRootRef}
      style={getBadgeStyles(style)}
    >
      {children}
    </WithNativeAttributes>
  );
}

applyDisplayName(Badge, 'Badge');
