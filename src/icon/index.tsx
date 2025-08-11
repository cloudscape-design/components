// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { IconProps } from './interfaces.js';
import InternalIcon from './internal.js';

export { IconProps };

export default function Icon({ size = 'normal', variant = 'normal', ...props }: IconProps) {
  const baseComponentProps = useBaseComponent('Icon', { props: { name: props.name, size, variant } });
  return <InternalIcon size={size} variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(Icon, 'Icon');
