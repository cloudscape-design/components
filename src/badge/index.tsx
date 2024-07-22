// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { BadgeProps } from './interfaces';

import styles from './styles.css.js';

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
