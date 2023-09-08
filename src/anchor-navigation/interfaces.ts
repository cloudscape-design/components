// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler, NonCancelableEventHandler } from '../internal/events';

export interface AnchorNavigationProps extends BaseComponentProps {
  /**
   * Adds `aria-labelledby` to the component.
   *
   * Use this property for identifying the header or title that labels the anchor navigation.
   *
   * To use it correctly, define an ID for the element you want to use as label and set the property to that ID.
   */
  ariaLabelledby?: string;

  /**
   * List of anchors.
   */
  anchors: AnchorNavigationProps.Anchor[];

  /**
   * Specifies the active anchor href.
   * For using the component in a controlled manner, use together with 'disableTracking'.
   */
  activeHref?: string;

  /**
   * Disable scroll spy if set to true.
   */
  disableScrollSpy?: boolean;

  /**
   * Specifies the height (in pixels) to be considered as an offset when activating anchors.
   * This is useful when you have a fixed or sticky header that might overlap with the content when you scroll.
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
     * The `id` attribute of the target HTML element to which this anchor refers.
     * For example: `"#section1.1"`
     */
    href: string;

    /**
     * Level of nesting of the anchor.
     */
    level: number;

    /**
     * Additional information to display next to the link, for example: "New" or "Updated"
     */
    info?: string;
  }
}
