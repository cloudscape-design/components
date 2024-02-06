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
   * Determines whether it's heroHeader.
   * If true the background color will be removed.
   */
  heroHeader?: boolean;
}
