// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface BadgeProps extends BaseComponentProps {
  /**
   * Specifies the badge color.
   */
  color?: 'blue' | 'grey' | 'green' | 'red' | 'critical' | 'high' | 'medium' | 'low' | 'neutral';

  /**
   * Text displayed inside the badge.
   */
  children?: React.ReactNode;
}
