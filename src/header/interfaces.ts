// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface HeaderProps extends BaseComponentProps {
  /**
   * The heading text. Plain text is recommended. The component renders the
   * HTML heading tag based on the specified `variant` or `headingTagOverride`.
   * @displayname title
   */
  children?: React.ReactNode;
  /**
   * Specifies the variant of the header:
   * * `h1` - Use this for page level headers.
   * * `h2` - Use this for container level headers.
   * * `h3` - Use this for section level headers.
   * * `awsui-h1-sticky` - Use this for sticky headers in cards and tables.
   * * `awsui-h1-page` - Use this for a page header
   * @visualrefresh `awsui-h1-sticky` variant
   */
  variant?: HeaderProps.Variant;
  /**
   * Overrides the default [HTML heading tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements)
   * provided by the variant.
   */
  headingTagOverride?: HeaderProps.HeadingTag;
  /**
   * Supplementary text below the heading.
   */
  description?: React.ReactNode;
  /**
   * Actions for the container.
   */
  actions?: React.ReactNode;
  /**
   * Specifies secondary text that's displayed to the right of the heading title. This is commonly used
   * to display resource counters in table and cards components.
   */
  counter?: string;
  /**
   * Area next to the heading to display an Info link.
   */
  info?: React.ReactNode;

  tags?: React.ReactNode;
  subHeading?: React.ReactNode;
  metadata?: React.ReactNode;
  actionsPosition?: 'top' | 'bottom';
  secondaryContent?: React.ReactNode;

  colorMode?: 'default' | 'dark';
}

export namespace HeaderProps {
  export type Variant = 'h1' | 'h2' | 'h3' | 'awsui-h1-sticky' | 'awsui-h1-page';
  export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}
