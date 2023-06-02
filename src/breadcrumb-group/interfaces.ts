// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseNavigationDetail, CancelableEventHandler } from '../internal/events';
import { LinkItem } from '../button-dropdown/interfaces';
import { BaseComponentProps } from '../internal/base-component';

export interface BreadcrumbGroupProps<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>
  extends BaseComponentProps {
  /**
   * An array of breadcrumb items that describes the link hierarchy for this navigation.
   * Each option has the following properties:

   * * `text` (string) - Specifies the title text of the breadcrumb item.
   * * `href` (string) - Specifies the URL for the link in the breadcrumb item.
   * You should specify the link even if you have a click handler for a breadcrumb item
   * to ensure that valid markup is generated.

   * Note: The last breadcrumb item is automatically considered the current item, and it's
   * attributed with the proper `aria-current` value and rendered as inactive.
   */
  items: ReadonlyArray<T>;
  /**
   * Provides an `aria-label` to the breadcrumb group that screen readers can read (for accessibility).
   */
  ariaLabel?: string;

  /**
   * Provides an `aria-label` to the ellipsis button that screen readers can read (for accessibility).
   * @i18n
   */
  expandAriaLabel?: string;
  /**
   * Called when the user clicks on a breadcrumb item.
   */
  onClick?: CancelableEventHandler<BreadcrumbGroupProps.ClickDetail<T>>;
  /**
   * Called when the user clicks on a breadcrumb item with the left mouse button
   * without pressing modifier keys (that is, CTRL, ALT, SHIFT, META).
   */
  onFollow?: CancelableEventHandler<BreadcrumbGroupProps.ClickDetail<T>>;
}

export namespace BreadcrumbGroupProps {
  export interface Item {
    text: string;
    href: string;
  }

  export interface ClickDetail<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>
    extends BaseNavigationDetail {
    item: T;
    text: string;
    href: string;
  }
}

export interface BreadcrumbItemProps<T extends BreadcrumbGroupProps.Item> {
  item: T;
  isDisplayed: boolean;
  isLast?: boolean;
  isCompressed?: boolean;
  onClick?: CancelableEventHandler<BreadcrumbGroupProps.ClickDetail<T>>;
  onFollow?: CancelableEventHandler<BreadcrumbGroupProps.ClickDetail<T>>;
}

export interface EllipsisDropdownProps {
  ariaLabel?: BreadcrumbGroupProps['expandAriaLabel'];
  dropdownItems: ReadonlyArray<LinkItem>;
  onDropdownItemClick: CancelableEventHandler<{ id: string; event?: any }>;
  onDropdownItemFollow: CancelableEventHandler<{ id: string; event?: any }>;
}
