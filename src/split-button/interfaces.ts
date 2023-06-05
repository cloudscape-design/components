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
   * The following properties are supported across by utility types:
   *
   * * `id` (string) - The type of the item. Can be `button` or `button-dropdown`.
   * * `type` (string) - ...
   * * `ariaLabel` (string) - ...
   * * `disabled` (string) - ...
   * * `loading` (string) - ...
   * * `loadingText` (string) - ...
   *
   * ### button
   *
   * * `text` (string) - ...
   * * `href` (string) - ...
   * * `target` (string) - ...
   * * `rel` (string) - ...
   * * `download` (string) - ...
   * * `external` (string) - ...
   * * `onClick` (() => void) - Specifies the event handler called when the utility is clicked.
   * * `onFollow` (...) - ...
   * * `iconName` (string) - ...
   * * `iconAlt` (string) - ...
   * * `iconUrl` (string) - ...
   * * `iconSvg` (string) - ...
   *
   * ### button-dropdown
   *
   * * `items` (ButtonDropdownProps.Items) - An array of dropdown items. This follows the same structure as the `items` property of the [button dropdown component](/components/button-dropdown).
   * * `onItemClick` (NonCancelableEventHandler<ButtonDropdownProps.ItemClickDetails>) - Specifies the event handler called when a dropdown item is selected.
   * * `onItemFollow` (NonCancelableEventHandler<ButtonDropdownProps.ItemClickDetails>) - Specifies the event handler called when a dropdown item is selected.
   */
  items: ReadonlyArray<SplitButtonProps.Item>;

  /**
   * ...
   */
  variant?: SplitButtonProps.Variant;

  /**
   * ...
   */
  expandToViewport?: boolean;

  /**
   * ...
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
