// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TocProps {
  /**
   * Specify the table of contents title, displayed above the items.
   */
  title?: string;

  /**
   * List of anchors
   *
   * */
  anchors: TocProps.Anchor[];

  /**
   * The components has two variants:
   * `default` -  Use this variant in any context.
   * `expandable` - Use this variant if you'd like to save vertical space
   * by allowing customers to expand or collapse the component
   * */
  variant?: 'default' | 'expandable';

  /**
   * Determines whether the component initially displays in expanded state
   * (that is, with the items of the table of contents visible).
   * The component operates in an uncontrolled manner even if you provide a value for this property.
   * Note: this property only works if the `variant` is set to `expandable`.
   * */
  defaultExpanded?: boolean;

  /**
   * Disable scroll spy
   * */
  disableTracking?: boolean;
}

export namespace TocProps {
  export interface Anchor {
    /**
     * Text for the anchor item
     * */
    text: string;

    /**
     * The `id` attribute used to specify a unique HTML element
     * */
    id: string;

    /**
     * Level of nesting
     * */
    level: number;
  }
}
