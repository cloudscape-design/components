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
   * Array of objects of type Item or or ItemGroup.
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
  /**
   * - `id` (string) - allows to identify groups of items

   * - `text` (string) - description shown as a text in the menu for this item.

   * - `items` (Item[]) - an array of items that belong to this group.
  */
  export interface ItemGroup {
    id: string;
    text: string;
    items: ReadonlyArray<Item>;
  }
  /**
   * - `id` (string) - allows to identify the item that the user clicked on. Mandatory for individual items, optional for categories.

   * - `text` (string) - description shown as a tooltip or in the menu for this item.

   * - `loading` (boolean) - whether the item is in a loading state.

   * - `disabled` (boolean) - whether the item is disabled. Disabled items are not clickable, but they can be highlighted with the keyboard to make them accessible.

   * - `iconName` (string) - (Optional) Specifies the name of the icon, used with the [icon component](/components/icon/).

   * - `iconAlt` (string) - (Optional) Specifies alternate text for the icon when using `iconUrl`.

   * - `iconUrl` (string) - (Optional) Specifies the URL of a custom icon.

   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).

   * - `tooltipDisabled` (boolean) - (Optional) Disables the tooltip for the item.

   * - `actionPopoverText` (string) - (Optional) Text that appears when the user clicks the item. Use to provide feedback to the user.
  */
  export interface Item {
    id: string;
    text: string;
    loading?: boolean;
    disabled?: boolean;
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    tooltipDisabled?: boolean;
    actionPopoverText?: string;
  }

  export interface ItemClickDetails {
    id: string;
  }

  export interface Ref {
    /**
     * Focuses the underlying native button for item.
     */
    focus(id: string): void;
  }

  export interface I18nStrings {
    showMoreButtonAriaLabel?: string;
  }
}
