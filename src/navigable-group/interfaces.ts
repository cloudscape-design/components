// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface NavigableGroupProps extends BaseComponentProps {
  /**
   * The children that will be rendered inside the navigation group.
   *
   * The following child components are supported:
   * - Button
   * - Button dropdown
   * - Link
   * - Checkbox
   */
  children: React.ReactNode;
  /**
   * A method that should return a unique identifier for a given element.
   * The element passed will be the first focusable descendent of a child component.
   */
  getItemId: (element: HTMLElement) => string;
  /**
   * If true, the focus will loop back to the first item when navigating past the last one, and vice versa.
   */
  loopFocus?: boolean;
  /**
   * Determines which arrow keys move focus within the group:
   * - `horizontal` - left and right arrow keys
   * - `vertical` - up and down arrow keys
   * - `both` - all arrow keys
   */
  direction?: 'horizontal' | 'vertical' | 'both';
  /**
   * Attributes to add to the native `div` element.
   */
  nativeAttributes?: NativeAttributes<React.HTMLAttributes<HTMLDivElement>>;
}

export interface InternalNavigableGroupProps extends NavigableGroupProps, InternalBaseComponentProps {}

export namespace NavigableGroupProps {
  export interface Ref {
    /**
     * Focuses the first focusable element (or previously focused element) in the navigation group.
     */
    focus(): void;
  }
}
