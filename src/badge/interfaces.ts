// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface BadgeProps extends BaseComponentProps {
  /**
   * Specifies the component color.
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
   * Text displayed inside the component.
   */
  children?: React.ReactNode;

  /**
   * Specifies an object of selectors and properties that are used to apply custom styles to the component.
   *
   * - `root.background` (string) - (Optional) Background color of the component.
   * - `root.borderColor` (string) - (Optional) Border color of the component.
   * - `root.borderRadius` (string) - (Optional) Corner radius of the component.
   * - `root.borderWidth` (string) - (Optional) Border thickness of the component.
   * - `root.borderStyle` (string) - (Optional) Border style of the component.
   * - `root.paddingBlock` (string) - (Optional) Vertical padding inside the component.
   * - `root.paddingInline` (string) - (Optional) Horizontal padding inside the component.
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
      borderStyle?: string;
      paddingBlock?: string;
      paddingInline?: string;
    };
  }
}
