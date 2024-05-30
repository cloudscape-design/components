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
   * Max number of visible items in the button group, the rest will be hidden in a dropdown.
   */
  limit?: number;
  /**
   * Array of objects of type 'icon-button' or 'divider'.
   */
  items: ReadonlyArray<ButtonGroupProps.Item>;
  /**
   * Called when the user clicks on an item, and the item is not disabled. The event detail object contains the id of the clicked item.
   */
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
}

export interface InternalButtonGroupProps extends ButtonGroupProps, InternalBaseComponentProps {}

export namespace ButtonGroupProps {
  export type Variant = 'icon';
  export type Item = Button | Divider;

  export interface Divider {
    type: 'divider';
  }

  /**
   * - `id` (string) - allows to identify the item that the user clicked on. Mandatory for individual items, optional for categories.

   * - `text` (string) - description shown as a tooltip or in the menu for this item.

   * - `lang` (string) - (Optional) The language of the item, provided as a BCP 47 language tag.

   * - `disabled` (boolean) - whether the item is disabled. Disabled items are not clickable, but they can be highlighted with the keyboard to make them accessible.

   * - `description` (string) - additional data that will be passed to a `data-description` attribute.

   * - `iconName` (string) - (Optional) Specifies the name of the icon, used with the [icon component](/components/icon/).

   * - `iconAlt` (string) - (Optional) Specifies alternate text for the icon when using `iconUrl`.

   * - `iconUrl` (string) - (Optional) Specifies the URL of a custom icon.

   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).

   * - `tooltipDisabled` (boolean) - (Optional) Disables the tooltip for the item.

   * - `actionPopoverText` (string) - (Optional) Text that appears when the user clicks the item. Use to provide feedback to the user.
   */
  export interface Button {
    type: 'button';
    variant: Variant;
    id: string;
    text: string;
    lang?: string;
    disabled?: boolean;
    description?: string;
    iconAlt?: string;
    iconName?: IconProps.Name;
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
}

export interface ItemProps {
  item: ButtonGroupProps.Item;
  onItemClick?: CancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
}
