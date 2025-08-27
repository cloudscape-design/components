// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

export interface NavigableGroupProps extends BaseComponentProps {
  /**
   * The children that will be rendered inside the navigation group.
   *
   * The following Cloudscape components are supported, but do not
   * need to be direct children of the group:
   * - Button
   * - Button dropdown
   * - Link
   */
  children: React.ReactNode;
  /**
   * A method that should return a unique identifier for a given element.
   * The element passed will be the first focusable descendent of a child component.
   */
  getItemKey: (element: HTMLElement) => string;
  /**
   * Determines which arrow keys move focus sequentially within the group:
   * - `horizontal` - left and right arrow keys
   * - `vertical` - up and down arrow keys
   * - `both` - all arrow keys
   */
  navigationDirection?: 'horizontal' | 'vertical' | 'both';
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
