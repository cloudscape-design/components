// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface SpinnerProps extends BaseComponentProps {
  /**
   * Specifies the size of the spinner.
   */
  size?: SpinnerProps.Size;
  /**
   * Specifies the color variant of the spinner. The `normal` variant picks up the current color of its context.
   */
  variant?: SpinnerProps.Variant;
  /**
   * Attributes to add to the native element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLElement>>;
}

export namespace SpinnerProps {
  export type Size = 'normal' | 'big' | 'large';
  export type Variant = 'normal' | 'disabled' | 'inverted';
}
