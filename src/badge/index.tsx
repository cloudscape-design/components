// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { BadgeProps } from './interfaces';
import { getBadgeStyles } from './style';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export { BadgeProps };

// Style API v2
interface StyleClassNames {
  root?: string;
}

export default function Badge({
  color = 'grey',
  children,
  iconName,
  iconAlign = 'left',
  iconUrl,
  iconSvg,
  iconAlt,
  style,
  nativeAttributes,
  ...rest
}: BadgeProps) {
  const { __internalRootRef } = useBaseComponent('Badge', { props: { color, iconAlign } });
  const baseProps = getBaseProps(rest);
  const { styleClassNames } = rest as { styleClassNames?: StyleClassNames };

  const className = clsx(baseProps.className, styleClassNames?.root, styles.badge, styles[`badge-color-${color}`]);

  const hasIcon = !!iconName || !!iconUrl || !!iconSvg;
  const hasContent = children !== undefined && children !== null && children !== '';

  const icon = hasIcon ? (
    <InternalIcon
      className={clsx(
        styles.icon,
        testUtilStyles.icon,
        styles[`icon-${iconAlign}`],
        hasContent && styles['icon-with-content']
      )}
      name={iconName}
      url={iconUrl}
      svg={iconSvg}
      alt={iconAlt}
      size="inherit"
    />
  ) : null;

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
      {iconAlign === 'left' && icon}
      {hasContent && <span className={testUtilStyles.content}>{children}</span>}
      {iconAlign === 'right' && icon}
    </WithNativeAttributes>
  );
}

applyDisplayName(Badge, 'Badge');
