// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export namespace ExpandableSectionProps {
  export type Variant = 'default' | 'footer' | 'container' | 'navigation' | 'stacked' | 'compact';
  export interface ChangeDetail {
    expanded: boolean;
  }
  export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
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
   * * `stacked` - Use this variant directly adjacent to other stacked containers (such as a container, table).
   * @visualrefresh `stacked` variant
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
   * @deprecated Use `headerText` instead.
   */
  header?: React.ReactNode;

  /**
   * The heading text. Use plain text. When using the container variant, you can use additional header props like `headerDescription` and `headerCounter` to display other elements in the header.
   */
  headerText?: React.ReactNode;

  /**
   * Supplementary text below the heading. Use with the container, default or footer variants.
   */
  headerDescription?: string;

  /**
   * Specifies secondary text that's displayed to the right of the heading title. Use with the container variant.
   * Behaves similar to the Header component counter.
   */
  headerCounter?: string;

  /**
   * Overrides the default [HTML heading tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements).
   * Use with the container variant (which defaults to H2) or default/footer variants (which default to DIV). Note that this only
   * works with the `headerText` slot (not with the deprecated `header`), and not with the navigation variant.
   */
  headingTagOverride?: ExpandableSectionProps.HeadingTag;

  /**
   * Adds `aria-label` to the header element.
   * Use to assign unique labels when there are multiple expandable sections with the same header text on one page.
   */
  headerAriaLabel?: string;

  /**
   * Called when the state changes (that is, when the user expands or collapses the component).
   * The event `detail` contains the current value of the `expanded` property.
   */
  onChange?: NonCancelableEventHandler<ExpandableSectionProps.ChangeDetail>;

  /**
   * The area next to the heading, used to display an Info link. Use with the container variant.
   */
  headerInfo?: React.ReactNode;

  /**
   * Actions for the header. Use with the container variant.
   */
  headerActions?: React.ReactNode;
}
