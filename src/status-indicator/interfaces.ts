// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface StatusIndicatorProps extends BaseComponentProps {
  /**
   * Specifies the status type.
   */
  type?: StatusIndicatorProps.Type;
  /**
   * A text fragment that communicates the status.
   */
  children?: React.ReactNode;
  /**
   * Specifies an `aria-label` for the icon. If the status text alone does not fully describe the status,
   * use this to communicate additional context.
   */
  iconAriaLabel?: string;
  /**
   * Specifies an override for the status indicator color.
   */
  colorOverride?: StatusIndicatorProps.Color;
  /**
   * Specifies if the text content should wrap. If you set it to false, it prevents the text from wrapping
   * and truncates it with an ellipsis.
   */
  wrapText?: boolean;
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

export namespace StatusIndicatorProps {
  // Why not enums? Explained there
  // https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum
  export type Type = 'error' | 'warning' | 'success' | 'info' | 'stopped' | 'pending' | 'in-progress' | 'loading';
  export type Color = 'blue' | 'grey' | 'green' | 'red' | 'yellow';
}
