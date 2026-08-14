// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { VisualAccentProps } from './interfaces';

import styles from './styles.css.js';

export { VisualAccentProps };

export default function VisualAccent({
  color,
  content,
  fontSize = 'body-m',
  fontWeight = 'normal',
  iconName,
  iconSize = 'normal',
  shape = 'sharp',
  ...rest
}: VisualAccentProps) {
  const { __internalRootRef } = useBaseComponent('VisualAccent', { props: { color, shape } });
  const baseProps = getBaseProps(rest);

  const className = clsx(
    baseProps.className,
    styles.root,
    styles[`color-${color}`],
    styles[`shape-${shape}`],
    styles[`font-size-${fontSize}`],
    styles[`font-weight-${fontWeight}`]
  );

  return (
    <span {...baseProps} className={className} ref={__internalRootRef}>
      {iconName ? <InternalIcon name={iconName} size={iconSize} /> : content}
    </span>
  );
}

applyDisplayName(VisualAccent, 'VisualAccent');
