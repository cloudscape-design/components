// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { CancelableEventHandler } from '../internal/events';
import { BaseComponentProps } from '../internal/base-component';
import { ButtonProps } from '../button/interfaces';
import { IconProps } from '../icon/interfaces';

export interface SplitButtonProps extends BaseComponentProps {
  /**
   * A list of split button items.
   * The supported item types are: `button` and `button-dropdown`.
   *
   * The `button-dropdown` item is only allowed as the very last item in the list.
   *
   * The following properties are supported across all item types:
   *
   * * `id` (string) - The unique item identifier.
   * * `type` (string) - The type of the item. Can be `button` or `button-dropdown`.
   * * `ariaLabel` (string) - Adds `aria-label` to the button or dropdown trigger. This is recommended for accessibility if a text is not provided.
   * * `disabled` (boolean) - whether the item is disabled. Disabled items are not clickable.
   * * `loading` (boolean) - Renders the item as being in a loading state. It takes precedence over the `disabled` if both are set to `true`. It prevents users from clicking the item, but it can still be focused.
   * * `loadingText` (string) - Specifies the text that screen reader announces when the item is in a loading state.
   *
   * ### button
   *
   * * `text` (string) - Text displayed in the button element.
   * * `href` (string) - Applies button styling to a link.
   * * `target` (string) - Specifies where to open the linked URL (for example, to open in a new browser window or tab use `_blank`). This property only applies when an `href` is provided.
   * * `rel` (string) - Adds a `rel` attribute to the link. By default, the component sets the `rel` attribute to "noopener noreferrer" when `target` is `"_blank"`. If the `rel` property is provided, it overrides the default behavior.
   * * `download` (string) - Specifies whether the linked URL, when selected, will prompt the user to download instead of navigate. You can specify a string value that will be suggested as the name of the downloaded file. This property only applies when an `href` is provided.
   * * `external` (string) - Marks a button as external by adding an icon after the button text. The link will open in a new tab when clicked. Note that this only works when `href` is also provided.
   * * `onClick` (CancelableEventHandler<ButtonProps.ClickDetail>) - Called when the user clicks on the button and the button is not disabled or in loading state.
   * * `onFollow` (CancelableEventHandler<ButtonProps.FollowDetail>) - Called when the user clicks on the button with the left mouse button without pressing modifier keys (that is, CTRL, ALT, SHIFT, META), and the button has an `href` set.
   * * `iconName` (string) - The name of an existing icon to display next to the utility.
   * * `iconUrl` (string) - Specifies the URL of a custom icon. Use this property if the icon you want isn't available.
   * * `iconAlt` (string) - Specifies alternate text for a custom icon provided using `iconUrl`. We recommend that you provide this for accessibility.
   * * `iconSvg` (string) - Specifies the SVG of a custom icon.
   *
   * ### button-dropdown
   *
   * * `items` (ButtonDropdownProps.Items) - An array of dropdown items. This follows the same structure as the `items` property of the [button dropdown component](/components/button-dropdown).
   * * `onItemClick` (NonCancelableEventHandler<ButtonDropdownProps.ItemClickDetails>) - Specifies the event handler called when a dropdown item is clicked.
   * * `onItemFollow` (NonCancelableEventHandler<ButtonDropdownProps.ItemClickDetails>) - Specifies the event handler called when a dropdown link item is followed.
   */
  items: ReadonlyArray<SplitButtonProps.Item>;

  /**
   * Determines the general styling of the split button.
   * * `primary` for primary buttons
   * * `normal` for secondary buttons
   */
  variant?: SplitButtonProps.Variant;

  /**
   * Controls expandability of the item groups of the button dropdown item.
   */
  expandToViewport?: boolean;

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
  expandableGroups?: boolean;
}

export namespace SplitButtonProps {
  export type Variant = 'normal' | 'primary';

  export type Item = ButtonItem | ButtonDropdownItem;

  export interface BaseItem {
    id: string;
    ariaLabel?: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
  }

  export interface ButtonItem extends BaseItem {
    type: 'button';
    text?: string;
    href?: string;
    target?: string;
    rel?: string;
    download?: boolean | string;
    external?: boolean;
    onClick?: CancelableEventHandler;
    onFollow?: CancelableEventHandler<ButtonProps.FollowDetail>;
    iconName?: IconProps.Name;
    iconAlt?: string;
    iconUrl?: string;
    iconSvg?: string;
  }

  export interface ButtonDropdownItem extends BaseItem {
    type: 'button-dropdown';
    ariaLabel: string;
    items: ButtonDropdownProps.Items;
    onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
    onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  }

  export interface Ref {
    /**
     * Focuses the underlying native button corresponding the given id.
     */
    focus(id: string): void;
  }
}
