// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface NavigationBarProps extends BaseComponentProps {
  /**
   * Content of the navigation bar.
   */
  content?: ReactNode;

  /**
   * Accessible label for the navigation landmark.
   */
  ariaLabel?: string;
}
