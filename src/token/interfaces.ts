// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IconProps } from '../icon/interfaces';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface TokenProps extends BaseComponentProps {
  /** Title text of the token. */
  label?: string;

  /** Adds an `aria-label` to the token. */
  ariaLabel?: string;

  /** A label tag that provides additional guidance, shown next to the label. */
  labelTag?: string;

  /** Further information about the token that appears below the label. */
  description?: string;

  /**
   * Determines the general styling of the token as follows:
   * - `normal` for a standard style token with various features to display information.
   * - `inline` for a slimmer version of the token with limited features for text contexts.
   *   - Displays the label, icon and dismiss button as specified.
   *
   * Defaults to `normal` if not specified.
   */
  variant?: TokenProps.Variant;

  /** Determines whether the token is disabled. */
  disabled?: boolean;

  /**
   * Specifies if the control is read-only, which prevents the
   * user from modifying the value. A read-only control is still focusable.
   */
  readOnly?: boolean;

  /** Specifies alternate text for a custom icon, for use with `iconUrl`. */
  iconAlt?: string;

  /** Specifies the name of an [icon](/components/icon/) to display in the token. */
  iconName?: IconProps.Name;

  /** URL of a custom icon. */
  iconUrl?: string;

  /** Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/). */
  iconSvg?: React.ReactNode;

  /** A list of tags giving further guidance about the token. */
  tags?: ReadonlyArray<string>;

  /** Adds an `aria-label` to the dismiss button. */
  dismissLabel?: string;

  /**
   * When defined, adds a popover trigger to the token label.
   * `description`, `labelTags` and `tags` cannot be used in combination with a popover.
   */
  popoverProps?: TokenProps.TokenPopoverProps;

  /**
   * Called when the user clicks on the dismiss button.
   * Make sure that you add a listener to this event to update your application state.
   */
  onDismiss?: NonCancelableEventHandler;

  /**
   * Used to render content inside the token.
   * @awsuiSystem core
   */
  children?: React.ReactNode;

  /**
   * When defined, the token will display a custom action instead of the default dismiss button.
   * - ariaLabel (string) - optional - Adds an `aria-label` to the action button.
   * - disabled (boolean) - optional - Determines whether the action button is disabled.
   * - onClick (NonCancelableEventHandler) - optional - Called when the user clicks on the action button.
   * - iconAlt (string) - optional - Specifies alternate text for a custom icon, for use with `iconUrl`.
   * - iconName (IconProps.Name) - optional - Specifies the name of an [icon](/components/icon/) to display in the action button.
   * - iconUrl (string) - optional - URL of a custom icon.
   * - iconSvg (React.ReactNode) - optional - Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   * - popoverProps (TokenPopoverProps) - optional - When defined, adds a popover trigger to the action button.
   * @awsuiSystem core
   */
  customActionProps?: TokenProps.CustomActionProps;
}

export namespace TokenProps {
  export type Variant = 'normal' | 'inline';
  export type TokenPopoverProps = Omit<PopoverProps, 'triggerType' | 'wrapTriggerText' | 'children'>;

  export interface CustomActionProps {
    ariaLabel?: string;
    disabled?: boolean;
    onClick?: NonCancelableEventHandler;
    iconAlt?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    popoverProps?: TokenPopoverProps;
  }
}
