// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

export interface ButtonGroupProps extends BaseComponentProps {
  /**
   * Adds `aria-label` to the button group toolbar element.
   * Use this to provide a unique accessible name for each button group on the page.
   */
  ariaLabel?: string;
  /**
   * Determines the general styling of the button dropdown.
   * * `icon` for icon buttons.
   */
  variant: ButtonGroupProps.Variant;
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
   * We recommend you use discretion, and don't enable this property unless necessary
   * because fixed positioning results in a slight, visible lag when scrolling complex pages.
   */
  dropdownExpandToViewport?: boolean;
  /**
   * Array of objects with a number of supported types.
   *
   * ### icon-button
   *
   * * `id` (string) - The unique identifier of the button, used as detail in `onItemClick` handler and to focus the button using `ref.focus(id)`.
   * * `text` (string) - The name shown as a tooltip for this button.
   * * `disabled` (optional, boolean) - The disabled state indication for this button.
   * * `loading` (optional, boolean) - The loading state indication for this button.
   * * `loadingText` (optional, string) - The loading text announced to screen readers.
   * * `iconName` (optional, string) - Specifies the name of the icon, used with the [icon component](/components/icon/).
   * * `iconAlt` (optional, string) - Specifies alternate text for the icon when using `iconUrl`.
   * * `iconUrl` (optional, string) - Specifies the URL of a custom icon.
   * * `iconSvg` (optional, ReactNode) - Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * * `popoverFeedback` (optional, ReactNode) - Text that appears when the user clicks the button. Use to provide feedback to the user.
   *
   * ### icon-toggle-button
   *
   * * `id` (string) - The unique identifier of the button, used as detail in `onItemClick` handler and to focus the button using `ref.focus(id)`.
   * * `pressed` (boolean) - The toggle button pressed state.
   * * `text` (string) - The name shown as a tooltip for this button.
   * * `disabled` (optional, boolean) - The disabled state indication for this button.
   * * `loading` (optional, boolean) - The loading state indication for this button.
   * * `loadingText` (optional, string) - The loading text announced to screen readers.
   * * `iconName` (optional, string) - Specifies the name of the icon, used with the [icon component](/components/icon/).
   * * `iconUrl` (optional, string) - Specifies the URL of a custom icon.
   * * `iconSvg` (optional, ReactNode) - Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * * `pressedIconName` (optional, string) - Specifies the name of the icon in pressed state, used with the [icon component](/components/icon/).
   * * `pressedIconUrl` (optional, string) - Specifies the URL of a custom icon in pressed state.
   * * `pressedIconSvg` (optional, ReactNode) - Custom SVG icon in pressed state. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * * `popoverFeedback` (optional, ReactNode) - Text that appears when the user clicks the button. Use to provide feedback to the user.
   * * `pressedPopoverFeedback` (optional, ReactNode) - Text that appears when the user clicks the button in pressed state. Defaults to `popoverFeedback`.
   *
   * * ### file-input
   *
   * * `id` (string) - The unique identifier of the button, used as detail in `onItemClick`.
   * * `text` (string) - The name of the menu button shown as a tooltip.
   * * `value` (File[]) - The file value of the input.
   * * `accept` (optional, string) - Specifies the native file input `accept` attribute to describe the allow-list of file types.
   * * `multiple` (optional, string) - Specifies the native file input `multiple` attribute to allow users entering more than one file.
   *
   * ### menu-dropdown
   *
   * * `id` (string) - The unique identifier of the button, used as detail in `onItemClick`.
   * * `text` (string) - The name of the menu button shown as a tooltip.
   * * `disabled` (optional, boolean) - The disabled state indication for the menu button.
   * * `loading` (optional, boolean) - The loading state indication for the menu button.
   * * `loadingText` (optional, string) - The loading text announced to screen readers.
   * * `items` (ButtonDropdownProps.ItemOrGroup[]) - The array of dropdown items that belong to this menu.
   *
   * ### group
   *
   * * `text` (string) - The name of the group rendered as ARIA label for this group.
   * * `items` ((ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown)[]) - The array of items that belong to this group.
   */
  items: ReadonlyArray<ButtonGroupProps.ItemOrGroup>;
  /**
   * Called when the user clicks on an item, and the item is not disabled. The event detail object contains the id of the clicked item.
   */
  onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
}

export interface InternalButtonGroupProps extends ButtonGroupProps, InternalBaseComponentProps {}

export namespace ButtonGroupProps {
  export type Variant = 'icon';

  export type ItemOrGroup = Item | Group;
  export type Item = IconButton | IconToggleButton | FileInput | MenuDropdown;

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
    popoverFeedback?: React.ReactNode;
  }

  export interface IconToggleButton {
    type: 'icon-toggle-button';
    id: string;
    text: string;
    pressed: boolean;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    pressedIconName?: IconProps.Name;
    pressedIconUrl?: string;
    pressedIconSvg?: React.ReactNode;
    popoverFeedback?: React.ReactNode;
    pressedPopoverFeedback?: React.ReactNode;
  }

  export interface FileInput {
    type: 'file-input';
    id: string;
    text: string;
    value: File[];
    accept?: string;
    multiple?: boolean;
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
    items: ReadonlyArray<ButtonGroupProps.Item>;
  }

  export interface ItemClickDetails {
    id: string;
    pressed?: boolean;
    checked?: boolean;
    files?: File[];
  }

  export interface Ref {
    /**
     * Focuses button group item by id.
     */
    focus(itemId: string): void;
  }
}
