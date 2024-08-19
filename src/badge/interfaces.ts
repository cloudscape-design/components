// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface BadgeProps extends BaseComponentProps {
  /**
   * Specifies the badge color.
   */
  color?:
    | 'blue'
    | 'grey'
    | 'green'
    | 'red'
    | 'severity-critical'
    | 'severity-high'
    | 'severity-medium'
    | 'severity-low'
    | 'severity-informational';

  /**
   * Text displayed inside the badge.
   */
  children?: React.ReactNode;
}
