// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AvatarProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalAvatar from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { AvatarProps };

export default function Avatar({ color = 'default', tooltipText, ...props }: AvatarProps) {
  const baseComponentProps = useBaseComponent('Avatar', { props: { color, tooltipText: !!tooltipText } });
  return <InternalAvatar color={color} tooltipText={tooltipText} {...props} {...baseComponentProps} />;
}
applyDisplayName(Avatar, 'Avatar');
