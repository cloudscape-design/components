// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { BadgeProps } from './interfaces';

export { BadgeProps };

export default function Badge({ color = 'grey', children, ...rest }: BadgeProps) {
  const { __internalRootRef } = useBaseComponent('Badge', { props: { color } });
  const baseProps = getBaseProps(rest);

  const className = clsx(baseProps.className, styles.badge, styles[`badge-color-${color}`]);

  return (
    <span {...baseProps} {...{ className }} ref={__internalRootRef}>
      {children}
    </span>
  );
}

applyDisplayName(Badge, 'Badge');
