// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { IconProps } from '../../icon/interfaces';

export interface AppLayoutButtonProps {
  className?: string;
  ariaLabel: string | undefined;
  ariaExpanded?: boolean;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  testId?: string;
}
