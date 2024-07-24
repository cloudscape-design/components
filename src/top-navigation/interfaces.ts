// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonProps } from '../button/interfaces';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';

export interface TopNavigationProps extends BaseComponentProps {
  /**
   * Properties describing the product identity. They are as follows:
   *
   * * `title` (string) - Specifies the title text.
   * * `logo` ({ src: string, alt: string }) - Specifies the logo for the product. Use fixed width and height for SVG images to ensure proper rendering.
   * * `href` (string) - Specifies the `href` that the header links to.
   * * `onFollow` (() => void) - Specifies the event handler called when the identity is clicked without any modifier keys.
   */
  identity: TopNavigationProps.Identity;

  /**
   * Use with an input or autosuggest control for a global search query.
   */
  search?: React.ReactNode;

  /**
   * A list of utility navigation elements.
   * The supported utility types are: `button` and `menu-dropdown`.
   *
   * The following properties are supported across all utility types:
   *
   * * `type` (string) - The type of the utility. Can be `button` or `menu-dropdown`.
   * * `text` (string) - Specifies the text shown in the top navigation or the title inside the dropdown if no explicit `title` property is set.
   * * `title` (string) - The title displayed inside the dropdown.
   * * `iconName` (string) - The name of an existing icon to display next to the utility.
   * * `iconUrl` (string) - Specifies the URL of a custom icon. Use this property if the icon you want isn't available.
   * * `iconAlt` (string) - Specifies alternate text for a custom icon provided using `iconUrl`. We recommend that you provide this for accessibility.
   * * `iconSvg` (string) - Specifies the SVG of a custom icon.
   * * `ariaLabel` (string) - Adds `aria-label` to the button or dropdown trigger. This is recommended for accessibility if a text is not provided.
   * * `badge` (boolean) - Adds a badge to the corner of the icon to indicate a state change. For example: Unread notifications.
   * * `disableTextCollapse` (boolean) - Prevents the utility text from being hidden on smaller screens.
   * * `disableUtilityCollapse` (boolean) - Prevents the utility from being moved to an overflow menu on smaller screens.
   *
   * ### button
   *
   * * `variant` ('primary-button' | 'link') - The visual appearance of the button. The default value is 'link'.
   * * `href` (string) - Specifies the `href` for a link styled as a button.
   * * `target` (string) - Specifies where to open the linked URL (for example, to open in a new browser window or tab use `_blank`). This property only applies when an `href` is provided.
   * * `rel` (string) - Adds a `rel` attribute to the link. By default, the component sets the `rel` attribute to "noopener noreferrer" when `target` is `"_blank"`. If the `rel` property is provided, it overrides the default behavior.
   * * `external` (boolean) - Marks the link as external by adding an icon after the text. When clicked, the link opens in a new tab.
   * * `externalIconAriaLabel` (string) - Adds an `aria-label` for the external icon.
   * * `onClick` (() => void) - Specifies the event handler called when the utility is clicked.
   * * `onFollow` (() => void) - Specifies the event handler called when the utility is clicked without pressing modifier keys, and the utility has an `href` set.
   *
   * ### menu-dropdown
   *
   * * `description` (string) - The description displayed inside the dropdown.
   * * `items` (ButtonDropdownProps.Items) - An array of dropdown items. This follows the same structure as the `items` property of the [button dropdown component](/components/button-dropdown), with the exception of the checkbox item type.
   * * `onItemClick` (NonCancelableEventHandler<ButtonDropdownProps.ItemClickDetails>) - Specifies the event handler called when a dropdown item is selected.
   * * `onItemFollow` (NonCancelableEventHandler<ButtonDropdownProps.ItemClickDetails>) - Specifies the event handler called when a dropdown item is selected without pressing modifier keys, and the item has an `href` set.
   * * `expandableGroups` (boolean) - Controls expandability of the item groups.
   */
  utilities?: ReadonlyArray<TopNavigationProps.Utility>;

  /**
   * An object containing all the localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TopNavigationProps.I18nStrings;
}

export namespace TopNavigationProps {
  export interface Identity {
    title?: string;
    logo?: Logo;
    href: string;
    onFollow?: CancelableEventHandler;
  }

  export interface Logo {
    src: string;
    alt?: string;
  }

  interface BaseUtility {
    text?: string;
    title?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconAlt?: string;
    iconSvg?: React.ReactNode;
    ariaLabel?: string;

    badge?: boolean;
    disableUtilityCollapse?: boolean;
    disableTextCollapse?: boolean;
  }

  export interface MenuDropdownUtility extends BaseUtility {
    type: 'menu-dropdown';
    description?: string;
    items: ButtonDropdownProps.Items;
    expandableGroups?: boolean;
    onItemClick?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
    onItemFollow?: CancelableEventHandler<ButtonDropdownProps.ItemClickDetails>;
  }

  export interface ButtonUtility extends BaseUtility {
    type: 'button';
    variant?: 'primary-button' | 'link';
    onClick?: CancelableEventHandler;
    onFollow?: CancelableEventHandler<ButtonProps.FollowDetail>;
    href?: string;
    target?: string;
    rel?: string;
    external?: boolean;
    externalIconAriaLabel?: string;
  }

  export type Utility = MenuDropdownUtility | ButtonUtility;

  export interface I18nStrings {
    searchIconAriaLabel?: string;
    searchDismissIconAriaLabel?: string;
    overflowMenuDismissIconAriaLabel?: string;
    overflowMenuBackIconAriaLabel?: string;
    overflowMenuTriggerText?: string;
    overflowMenuTitleText?: string;
  }
}
