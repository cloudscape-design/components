// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AvatarProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalAvatar from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { AvatarProps };

export default function Avatar({ type, fullName, ...props }: AvatarProps) {
  const baseComponentProps = useBaseComponent('Avatar', { props: { type, fullName: !!fullName } });
  return <InternalAvatar type={type} fullName={fullName} {...props} {...baseComponentProps} />;
}
applyDisplayName(Avatar, 'Avatar');
