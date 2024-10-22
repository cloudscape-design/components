// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../../base-component';

export interface LiveRegionProps extends BaseComponentProps {
  /**
   * The string for the aria-live announcement text. When this content
   * changes, the text will be re-announced to assistive technologies. If this
   * property is provided, it will be used for the live announcement instead of
   * the `children` slot.
   */
  message?: string;

  /**
   * Whether the announcements should be made using assertive aria-live.
   * Assertive announcements interrupt the user's action, so they should only
   * be used when absolutely necessary.
   */
  assertive?: boolean;

  /**
   * The tag name to use for the wrapper around the `children` slot.
   */
  tagName?: LiveRegionProps.TagName;

  /**
   * Defines whether to visually hide the contents of the `children` slot.
   */
  hidden?: boolean;

  /**
   * Use the rendered content as the source for the announcement text.
   * Prefer `message` if announcement text can be provided as a string.
   */
  children?: React.ReactNode;
}

export namespace LiveRegionProps {
  export type TagName = 'span' | 'div';
}
