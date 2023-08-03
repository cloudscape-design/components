// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CancelableEventHandler } from '../internal/events';

export interface AnchorNavigationProps {
  /**
   * List of anchors.
   */
  anchors: AnchorNavigationProps.Anchor[];

  /**
   * Specifies the active anchor.
   * For using the component in a controlled pattern, use together with 'disableTracking'.
   */
  activeAnchor?: AnchorNavigationProps.Anchor;

  /**
   * Option to disable scroll spy.
   */
  disableTracking?: boolean;

  /**
   * Triggered when an anchor link is clicked without any modifier keys.
   */
  onFollow?: CancelableEventHandler<AnchorNavigationProps.Anchor>;

  /**
   * Triggered when an active anchor link changes.
   */
  onActiveAnchorChange?: CancelableEventHandler<AnchorNavigationProps.Anchor>;
}

export namespace AnchorNavigationProps {
  export interface Anchor {
    /**
     * The text for the anchor item.
     */
    text: string;

    /**
     * The `id` attribute used to specify a unique HTML element.
     */
    id: string;

    /**
     * The level of nesting.
     */
    level: number;
  }
}
