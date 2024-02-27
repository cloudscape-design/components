// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface ContentLayoutProps extends BaseComponentProps {
  /**
   * Use this slot to render the main content of the layout below the header.
   * @displayname content
   */
  children?: React.ReactNode;

  /**
   * Determines whether the layout has an overlap between the header and content.
   * If true, the overlap will be removed.
   * @visualrefresh
   */
  disableOverlap?: boolean;

  /**
   * Use this slot to render the header content for the layout.
   */
  header?: React.ReactNode;

  /**
   * New!
   */
  heroHeader?: boolean;

  headerType?: ContentLayoutProps.HeaderType;

  darkHeaderContext?: boolean;

  headerBackground?: string;
}

export namespace ContentLayoutProps {
  export type HeaderType = 'default' | 'hero';
}
