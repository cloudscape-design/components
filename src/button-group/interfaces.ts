// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { IconProps } from '../icon/interfaces';
import { CancelableEventHandler } from '../internal/events';

export interface ButtonGroupProps extends BaseComponentProps {
  /** Determines the general styling of the button dropdown.
   * * `icon` for icon buttons
   */
  variant?: ButtonGroupProps.Variant;
  /**
   * Array of objects of type Item or ItemGroup. The following properties are supported:
   *
   * ### ItemGroup
   *
   * * `id` (string) - The unique identifier of the group.
   * * `text` (string) - The name of the group shown as a text in the menu for this item.
   * * `items` (Item[]) - The array of items that belong to this group.
   *
   * ### Item
   *
   * * `id` (string) - The unique identifier of the item, used as detail in `onItemClick` handler.
   * * `text` (string) - The name shown as a tooltip or menu text for this item.
   * * `loading` (optional, boolean) - The loading state indication for the item.
   * * `disabled` (optional, boolean) - The disabled state indication for the item.
   * * `iconName` (optional, string) - Specifies the name of the icon, used with the [icon component](/components/icon/).
   * * `iconAlt` (optional, string) - Specifies alternate text for the icon when using `iconUrl`.
   * * `iconUrl` (optional, string) - Specifies the URL of a custom icon.
   * * `iconSvg` (optional, ReactNode) - Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * * `actionPopoverText` (optional, string) - Text that appears when the user clicks the item. Use to provide feedback to the user.
   */
  items: ReadonlyArray<ButtonGroupProps.ItemOrGroup>;
  /**
   * Max number of visible items in the button group, the rest will be hidden in a dropdown.
   */
  limit?: number;
  /**
   * Called when the user clicks on an item, and the item is not disabled. The event detail object contains the id of the clicked item.
   */
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  /**
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
  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: ButtonGroupProps.I18nStrings;
}

export interface InternalButtonGroupProps extends ButtonGroupProps, InternalBaseComponentProps {}

export namespace ButtonGroupProps {
  export type Variant = 'icon';
  export type ItemOrGroup = Item | ItemGroup;

  export interface ItemGroup {
    id: string;
    text: string;
    items: ReadonlyArray<Item>;
  }

  export interface Item {
    id: string;
    text: string;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    actionPopoverText?: string;
  }

  export interface ItemClickDetails {
    id: string;
  }

  export interface Ref {
    focus(itemId: string): void;
  }

  export interface I18nStrings {
    showMoreButtonAriaLabel?: string;
  }
}
