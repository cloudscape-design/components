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
    | 'severity-neutral';

  /**
   * Text displayed inside the badge.
   */
  children?: React.ReactNode;

  /**
   * Specifies an object of selectors and properties that are used to apply custom styles.
   *
   * - `root.background` (string) - (Optional) Background for component states.
   * - `root.borderColor` (string) - (Optional) Border color for component states.
   * - `root.borderRadius` (string) - (Optional) Border radius style.
   * - `root.borderWidth` (string) - (Optional) Border width style.
   * - `root.paddingBlock` (string) - (Optional) Block dimension padding.
   * - `root.paddingInline` (string) - (Optional) Inline dimension padding.
   * @awsuiSystem core
   */
  style?: BadgeProps.Style;
}

export namespace BadgeProps {
  export interface Style {
    root?: {
      background?: string;
      borderColor?: string;
      borderRadius?: string;
      borderWidth?: string;
      paddingBlock?: string;
      paddingInline?: string;
    };
  }
}
