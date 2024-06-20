// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { IconProps } from '../icon/interfaces';
import { NonCancelableEventHandler } from '../internal/events';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';

export interface ButtonGroupProps extends BaseComponentProps {
  /**
   * Determines the general styling of the button dropdown.
   * * `icon` for icon buttons.
   */
  variant: ButtonGroupProps.Variant;
  /**
   * Array of objects of type "icon-button", "group", or "menu-dropdown".
   *
   * ### type="icon-button"
   * * `id` (string) - The unique identifier of the button, used as detail in `onItemClick` handler and to focus the button using `ref.focus(id)`.
   * * `text` (string) - The name shown as a tooltip or menu text for this button.
   * * `loading` (optional, boolean) - The loading state indication for the button.
   * * `loadingText` (optional, string) - The loading text announced to screen-readers.
   * * `disabled` (optional, boolean) - The disabled state indication for the button.
   * * `iconName` (optional, string) - Specifies the name of the icon, used with the [icon component](/components/icon/).
   * * `iconAlt` (optional, string) - Specifies alternate text for the icon when using `iconUrl`.
   * * `iconUrl` (optional, string) - Specifies the URL of a custom icon.
   * * `iconSvg` (optional, ReactNode) - Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * * `actionPopoverText` (optional, string) - Text that appears when the user clicks the button. Use to provide feedback to the user.
   *
   * ### type="group"
   * * `text` (string) - The name of the group rendered as ARIA label for this group.
   * * `items` ((ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown)[]) - The array of items that belong to this group.
   *
   * ### type="button-dropdown"
   * * `id` (string) - The unique identifier of the button, used to focus the button using `ref.focus(id)`.
   * * `text` (string) - The name of the menu button shown as a tooltip.
   * * `loading` (optional, boolean) - The loading state indication for the menu button.
   * * `loadingText` (optional, string) - The loading text announced to screen-readers.
   * * `disabled` (optional, boolean) - The disabled state indication for the menu button.
   * * `items` (ButtonDropdownProps.ItemOrGroup[]) - The array of dropdown items that belong to this menu.
   */
  items: ReadonlyArray<ButtonGroupProps.Item>;
  /**
   * Called when the user clicks on an item, and the item is not disabled. The event detail object contains the id of the clicked item.
   */
  onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  // TODO: add API docs
  ariaLabel?: string;
  ariaLabelledby?: string;
  /**
   * Use this property to determine dropdown placement strategy for all menu dropdown items.
   *
   * By default, the dropdown height is constrained to fit inside the height of its next scrollable container element.
   * Enabling this property will allow the dropdown to extend beyond that container by using fixed positioning and
   * [React Portals](https://reactjs.org/docs/portals.html).
   *
   * Set this property if the dropdown would otherwise be constrained by a scrollable container,
   * for example inside table and split view layouts.
   *
   * However, use discretion. We recommend you don't enable this property unless necessary
   * because fixed positioning results in a slight, visible lag when scrolling complex pages.
   */
  dropdownExpandToViewport?: boolean;
}

export interface InternalButtonGroupProps extends ButtonGroupProps, InternalBaseComponentProps {}

export namespace ButtonGroupProps {
  // Fixes documenter output.
  // When a union only has one element the resulting type for it is not string but object.
  export type Variant = 'icon' | 'icon';

  export type Item = IconButton | Feedback | MenuDropdown | Group;

  export interface IconButton {
    type: 'icon-button';
    id: string;
    text: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    popoverFeedbackText?: string;
    popoverFeedbackType?: 'success' | 'error';
  }

  export interface Feedback {
    type: 'feedback';
    id: string;
    text: string;
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
  }

  export interface MenuDropdown {
    type: 'menu-dropdown';
    id: string;
    text: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    items: ReadonlyArray<ButtonDropdownProps.ItemOrGroup>;
  }

  export interface Group {
    type: 'group';
    text: string;
    items: ReadonlyArray<IconButton | Feedback | MenuDropdown>;
  }

  export interface ItemClickDetails {
    id: string;
  }

  export interface Ref {
    focus(itemId: string): void;
  }
}
