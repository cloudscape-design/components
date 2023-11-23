// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { GridProps } from '../grid/interfaces';

export interface PageHeaderProps extends BaseComponentProps {
  /**
   * The heading text. Plain text is recommended.
   * @displayname title
   */
  children?: React.ReactNode;

  /**
   * Specifies the variant of the header:
   * * `h1` - Use this for detail page headers.
   * * `display-l` - Use this for landing page headers.
   */
  variant?: PageHeaderProps.Variant;

  /**
   * Subheading text that is displayed underneath the title.
   */
  subHeading?: string;

  /**
   * Supplementary description text below the heading, or the below the subheading if defined.
   */
  description?: React.ReactNode;

  /**
   * Additional metadata that is displayed underneath the description.
   */
  metadata?: React.ReactNode;

  /**
   * Tags or badges that are displayed underneath the metadata text.
   */
  tags?: React.ReactNode;

  /**
   * Actions for the container.
   */
  actions?: React.ReactNode;

  /**
   * Secondary content that is displayed on the right side of the page header.
   * Content inside this slot uses the color mode of the page and ignores the `colorMode` value.
   * Use the `gridDefinition` property to control the size of this slot.
   */
  secondaryContent?: React.ReactNode;

  /**
   * Specifies the responsiveness behavior of the main header area and the `secondaryContent` area.
   * See the [grid API documentation](/components/grid?tabId=api) for more details about accepted values.
   *
   * If `secondaryContent` is defined, the grid contains two columns: the main header area and the `secondaryContent` slot.
   * Otherwise, the grid only contains one column.
   */
  gridDefinition?: ReadonlyArray<GridProps.ElementDefinition>;

  /**
   * Specifies the color mode (light or dark mode) for the main header area.
   * By default, it follows the color mode of the page.
   * Set this to "dark" to achieve a dark header.
   */
  colorMode?: PageHeaderProps.ColorMode;

  /**
   * Background slot that is rendered behind the entire component area.
   * Use this to define a custom background.
   */
  background?: React.ReactNode;

  /**
   * Activate this property to render the main header area inside a container.
   * Use this when you otherwise cannot guarantee sufficient color contrast with the background image.
   */
  withContainer?: boolean;

  /**
   * Specifies the `max-width` CSS value for the main header content that is displayed in the center.
   */
  maxWidth?: string;
}

export namespace PageHeaderProps {
  export type Variant = 'h1' | 'display-l';
  export type ColorMode = 'default' | 'dark';
}
