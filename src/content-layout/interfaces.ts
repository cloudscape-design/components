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
   * * `default` - Does not apply any visual treatment.
   * * `high-contrast` - Applies high-contrast to the background of the header and the elements contained within it.
   *     If you are using the AppLayout component, set `headerVariant="high-contrast"` to apply the same treatment to the breadcrumbs and notifications slots.
   * * `divider` - Adds a horizontal separator between the header and the content.
   * @visualrefresh `high-contrast` headerVariant
   */
  headerVariant?: 'default' | 'high-contrast' | 'divider';

  /**
   * Maximum width for the content.
   * If set, all elements of the content layout (header, content, notifications, breadcrumbs) will be center-aligned and have the desired maximum width.
   * If not set, all elements will occupy the full available width.
   */
  maxContentWidth?: number;

  /**
   * Set it to `true` if your page uses the [app layout component](/components/app-layout/) with `disableContentPaddings=true`.
   * In that case, the content layout will become sensitive to the state of drawers in app layout and leave the necessary padding to avoid visual overlap with those elements.
   */
  defaultPadding?: boolean;

  /**
   * Use this slot to display [notifications](/components/flashbar/) to the content layout:
   * * If your page does not use the [app layout component](/components/app-layout/), which already offers a `notifications` slot.
   * * If your page uses the [app layout component](/components/app-layout/) with `disableContentPaddings=true`.
   *
   * Do not use in conjunction with the `notifications` slot in the [app layout component](/components/app-layout/).
   */
  notifications?: React.ReactNode;

  /**
   * Use this slot to add the [breadcrumb group component](/components/breadcrumb-group/) to the content layout:
   * * if your application does not use the [app layout component](/components/app-layout/), which already offers a `breadcrumbs` slot.
   * * If your page uses the [app layout component](/components/app-layout/) with `disableContentPaddings=true`.
   *
   * Do not use in conjunction with the `breadcrumbs` slot in the [app layout component](/components/app-layout/).
   */
  breadcrumbs?: React.ReactNode;

  /**
   * Use this property to style the background of the header.
   *
   * It can be:
   * * a string representing the CSS `background` value for the header element.
   * * a function that receives the mode ("light" or "dark") as a parameter and returns a string.
   *
   *  The header background spans across the full available width, independent of the specified `maxContentWidth`.
   *  If set, the component will not add the default background color to the header.
   */
  headerBackgroundStyle?: string | ((mode: 'light' | 'dark') => string);

  /**
   * Use this slot to add a secondary element inside the header. The secondary element will be displayed next to main header and occupy 25% of the available space.
   * Note that the secondary header will not have a high-contrast treatement, even if you set `headerVariant` to `high-contrast`.
   */
  secondaryHeader?: React.ReactNode;
}
