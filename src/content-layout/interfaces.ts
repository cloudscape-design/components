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
   * Determines the visual treatment for the header. Specifically:
   * * `default` - Creates continuity between the header and the content.
   * * `high-contrast` - Applies high-contrast to the background of the header and the elements contained within it.
   *     If you are using the AppLayout component, set `headerVariant="high-contrast"` to apply the same treatment to the breadcrumbs and notifications slots.
   * * `divider` - Add a horizontal separator between the header and the content.
   * @visualrefresh
   */
  headerVariant?: 'default' | 'high-contrast' | 'divider';
}
