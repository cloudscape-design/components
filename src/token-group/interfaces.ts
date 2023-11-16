// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';
import { IconProps } from '../icon/interfaces';

export interface TokenGroupProps extends BaseComponentProps {
  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: TokenGroupProps.I18nStrings;

  /**
   * Specifies the maximum number of displayed tokens. If the property isn't set, all of the tokens are displayed.
   */
  limit?: number;

  /**
   * Specifies the direction in which tokens are aligned (`horizontal | vertical`).
   */
  alignment?: TokenGroupProps.Alignment;

  /**
   * Removes any outer padding from the component.
   * We recommend to always enable this property.
   */
  disableOuterPadding?: boolean;

  /**
   *
   * An array of objects representing token items. Each token has the following properties:
   *
   * - `label` (string) - Title text of the token.
   * - `description` (string) - (Optional) Further information about the token that appears below the label.
   * - `disabled` [boolean] - (Optional) Determines whether the token is disabled.
   * - `labelTag` (string) - (Optional) A label tag that provides additional guidance, shown next to the label.
   * - `tags` [string[]] - (Optional) A list of tags giving further guidance about the token.
   * - `dismissLabel` (string) - (Optional) Adds an `aria-label` to the dismiss button.
   * - `iconName` (string) - (Optional) Specifies the name of an [icon](/components/icon/) to display in the token.
   * - `iconAlt` (string) - (Optional) Specifies alternate text for a custom icon, for use with `iconUrl`.
   * - `iconUrl` (string) - (Optional) URL of a custom icon.
   * - `iconSvg` (ReactNode) - (Optional) Custom SVG icon. Equivalent to the `svg` slot of the [icon component](/components/icon/).
   */
  items?: ReadonlyArray<TokenGroupProps.Item>;
  /**
   *  Called when the user clicks on the dismiss button. The token won't be automatically removed.
   *  Make sure that you add a listener to this event to update your application state.
   */
  onDismiss?: NonCancelableEventHandler<TokenGroupProps.DismissDetail>;
}

export namespace TokenGroupProps {
  export type Alignment = 'horizontal' | 'vertical';
  export interface Item {
    label?: string;
    disabled?: boolean;
    labelTag?: string;
    description?: string;
    iconAlt?: string;
    iconName?: IconProps.Name;
    iconUrl?: string;
    iconSvg?: React.ReactNode;
    tags?: ReadonlyArray<string>;
    dismissLabel?: string;
  }

  export interface DismissDetail {
    itemIndex: number;
  }

  export interface I18nStrings {
    limitShowFewer?: string;
    limitShowMore?: string;
  }
}
