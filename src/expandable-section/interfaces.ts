// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export namespace ExpandableSectionProps {
  export type Variant = 'default' | 'footer' | 'container' | 'navigation';
  export interface ChangeDetail {
    expanded: boolean;
  }
}

export interface ExpandableSectionProps extends BaseComponentProps {
  /**
   * Determines whether the component initially displays in expanded state (that is, with content visible). The component operates in an uncontrolled
   * manner even if you provide a value for this property.
   */
  defaultExpanded?: boolean;

  /**
   * Determines whether the component is in the expanded state (that is, with content visible). The component operates in a controlled
   * manner if you provide a value for this property.
   */
  expanded?: boolean;

  /**
   * The possible variants of an expandable section are as follows:
   *  * `default` - Use this variant in any context.
   *  * `footer` - Use this variant in container footers.
   *  * `container` - Use this variant in a detail page alongside other containers.
   *  * `navigation` - Use this variant in the navigation panel with anchors and custom styled content.
   *    It doesn't have any default styles.
   * */
  variant?: ExpandableSectionProps.Variant;

  /**
   * Determines whether the content section's default padding is removed. This default padding is only present for the `container` variant.
   */
  disableContentPaddings?: boolean;

  /**
   * Primary content displayed in the expandable section element.
   */
  children?: React.ReactNode;

  /**
   * Heading displayed above the content text.
   *
   * When using the container variant, use the Header component. Otherwise, use plain text.
   */
  header?: React.ReactNode;

  /**
   * Called when the state changes (that is, when the user expands or collapses the component).
   * The event `detail` contains the current value of the `expanded` property.
   */
  onChange?: NonCancelableEventHandler<ExpandableSectionProps.ChangeDetail>;
}
