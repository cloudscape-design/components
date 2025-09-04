// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
/**
 * @awsuiSystem core
 */
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface SpaceBetweenProps extends BaseComponentProps {
  /**
   * Defines the direction in which the content is laid out.
   */
  direction?: SpaceBetweenProps.Direction;

  /**
   * Defines the spacing between the individual items of the content.
   */
  size: SpaceBetweenProps.Size;

  /**
   * Content of this component.
   */
  children?: React.ReactNode;

  /**
   * Determines how the child elements will be aligned based on the [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) property of the CSS Flexbox.
   */
  alignItems?: SpaceBetweenProps.AlignItems;

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
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLDivElement>>;
}

export namespace SpaceBetweenProps {
  export type Direction = 'vertical' | 'horizontal';

  export type Size = 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

  export type AlignItems = 'center' | 'start' | 'end';
}
