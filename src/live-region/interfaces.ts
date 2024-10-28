// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';

export interface LiveRegionProps extends BaseComponentProps {
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
   * Determines whether to visually hide the contents of the `children` slot.
   */
  hidden?: boolean;

  /**
   * Use the rendered content as the source for the announcement text. When the
   * text content inside this slot changes, it will be re-announced to
   * assistive technologies.
   */
  children?: React.ReactNode;
}

export namespace LiveRegionProps {
  export type TagName = 'span' | 'div';
}
