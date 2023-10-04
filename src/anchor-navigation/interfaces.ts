// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface AnchorNavigationProps extends BaseComponentProps {
  /**
   * Adds `aria-labelledby` to the component.
   *
   * Use this property for identifying the header or title that labels the anchor navigation.
   * To use it correctly, define an ID for the element either as label, and set the property to that ID.
   */
  ariaLabelledby?: string;

  /**
   * List of anchors. Each anchor object has the following properties:
   *
   * * `text` (string) - The text for the anchor item.
   * * `href` (string) - The `id` attribute of the target HTML element that the anchor refers to.
   * For example: `"#section1.1"`
   * * `level` (number) - Level of nesting of the anchor.
   * * `info` (string | undefined) - Additional information to display next to the link, for example: "New" or "Updated".
   *
   * Note: The list of anchors should be sorted in the order they appear on the page.
   */
  anchors: AnchorNavigationProps.Anchor[];

  /**
   * Specifies the active anchor href. When set, the component will operate in a
   * controlled manner, and internal scroll-spy will be disabled.
   */
  activeHref?: string;

  /**
   * Specifies the height (in pixels) to be considered as an offset when activating anchors.
   * This is useful when you have a fixed or sticky header that might overlap with the content as you scroll.
   *
   * Defaults to 0.
   */
  scrollSpyOffset?: number;

  /**
   * Fired when an anchor link is clicked without any modifier keys.
   */
  onFollow?: CancelableEventHandler<AnchorNavigationProps.Anchor>;

  /**
   * Fired when an active anchor link changes.
   *
   * Note: This event is triggered both by the component's internal scroll-spy logic,
   * or when the `activeHref` prop is manually updated.
   */
  onActiveHrefChange?: NonCancelableEventHandler<AnchorNavigationProps.Anchor>;
}

export namespace AnchorNavigationProps {
  export interface Anchor {
    /**
     * The text for the anchor item.
     */
    text: string;

    /**
     * The `href` of the anchor. For example: `"#section1.1"`".
     */
    href: string;

    /**
     * Level of nesting of the anchor.
     */
    level: number;

    /**
     * Additional information to display next to the link, for example: "New" or "Updated".
     */
    info?: string;
  }
}
