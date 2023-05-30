// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { BaseNavigationDetail, CancelableEventHandler } from '../internal/events';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';

// TODO: partially "extend" button dropdown props
// TODO: update API docs
export interface SplitButtonProps extends BaseComponentProps {
  segments: ReadonlyArray<SplitButtonProps.Segment>;

  /**
   * Array of objects, each having the following properties:

   * - `id` (string) - allows to identify the item that the user clicked on. Mandatory for individual items, optional for categories.

   * - `text` (string) - description shown in the menu for this item. Mandatory for individual items, optional for categories.

   * - `lang` (string) - (Optional) The language of the item, provided as a BCP 47 language tag.

   * - `disabled` (boolean) - whether the item is disabled. Disabled items are not clickable, but they can be highlighted with the keyboard to make them accessible.

   * - `disabledReason` (string) - (Optional) Displays text near the `text` property when item is disabled. Use to provide additional context.

   * - `items` (ReadonlyArray<Item>): an array of item objects. Items will be rendered as nested menu items but only for the first nesting level, multi-nesting is not supported.
   * An item which belongs to nested group has the following properties: `id`, `text`, `disabled` and `description`.

   * - `description` (string) - additional data that will be passed to a `data-description` attribute.

   * - `href` (string) - (Optional) Defines the target URL of the menu item, turning it into a link.

   * - `external` (boolean) - Marks a menu item as external by adding an icon after the menu item text. The link will open in a new tab when clicked. Note that this only works when `href` is also provided.

   * - `externalIconAriaLabel` (string) - Adds an `aria-label` to the external icon.

   * - `iconName` (string) - (Optional) Specifies the name of the icon, used with the [icon component](/components/icon/).

   * - `iconAlt` (string) - (Optional) Specifies alternate text for the icon when using `iconUrl`.

   * - `iconUrl` (string) - (Optional) Specifies the URL of a custom icon.

   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).

   */
  items: ReadonlyArray<SplitButtonProps.ItemOrGroup>;
  /**
   * Renders the button as being in a loading state. It takes precedence over the `disabled` if both are set to `true`.
   * It prevents clicks.
   */
  loading?: boolean;
  /**
   * Specifies the text that screen reader announces when the button dropdown is in a loading state.
   */
  loadingText?: string;
  /** Determines the general styling of the button dropdown.
   * * `primary` for primary buttons
   * * `normal` for secondary buttons
   * * `icon` for icon buttons
   */
  variant?: SplitButtonProps.Variant;
  /**
   * Controls expandability of the item groups.
   */
  expandableGroups?: boolean;
  /**
   * By default, the dropdown height is constrained to fit inside the height of its parent element.
   * Enabling this property will allow the dropdown to extend beyond its parent by using fixed positioning and
   * [React Portals](https://reactjs.org/docs/portals.html).
   * If you want the dropdown to ignore the `overflow` CSS property of its parents,
   * such as in a split view layout, enable this property.
   * However, use discretion.
   * If you don't need to, we recommend you don't enable this property because there is a known issue with
   * the '[aria-owns](https://a11ysupport.io/tech/aria/aria-owns_attribute)' attribute in Safari with VoiceOver that
   * prevents VO specific controls (CTRL+OPT+Left/Right) from entering a dropdown on Safari due to its position in the DOM.
   * If you don't need to, we also recommend you don't enable this property because fixed positioning results
   * in a slight, visible lag when scrolling complex pages.
   */
  expandToViewport?: boolean;
  /**
   * Adds `aria-label` to the button dropdown trigger.
   * It should be used in buttons that don't have text in order to make them accessible.
   */
  ariaLabel?: string;
  /**
   * Called when the user clicks on an item, and the item is not disabled.  The event detail object contains the id of the clicked item.
   */
  onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  /**
   * Called when the user clicks on an item with the left mouse button without pressing
   * modifier keys (that is, CTRL, ALT, SHIFT, META), and the item has an `href` set.
   */
  onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
}

export namespace SplitButtonProps {
  export type Variant = 'normal' | 'primary';

  export interface Segment {
    id: string;
    disabled?: boolean;
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    text?: string;
  }

  export type Item = ButtonDropdownProps.Item;

  export type ItemGroup = ButtonDropdownProps.ItemGroup;

  export type ItemOrGroup = Item | ItemGroup;

  export interface ItemClickDetails extends BaseNavigationDetail {
    id: string;
  }

  export interface Ref {
    /**
     * Focuses the underlying native button corresponding the given id.
     */
    focus(id: string): void;
  }
}
