// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

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
}

export namespace SpaceBetweenProps {
  export type Direction = 'vertical' | 'horizontal';

  export type Size = 'xxxs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

  export type AlignItems = 'center' | 'start' | 'end';
}
