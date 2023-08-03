// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CancelableEventHandler } from '../internal/events';

export interface AnchorNavigationProps {
  /**
   * The title of the table of contents, displayed above the anchor items.
   */
  title?: string;

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
   * The variant of the component:
   * 'default' - Use in any context.
   * 'expandable' - Allows users to expand or collapse the component to save vertical space.
   */
  variant?: 'default' | 'expandable';

  /**
   * Determines whether the component initially displays in expanded state.
   * The component operates in an uncontrolled manner even if you provide a value for this property.
   * Only applies when the `variant` is set to `expandable`.
   */
  defaultExpanded?: boolean;

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
