// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { CancelableEventHandler } from '../internal/events';
import { NativeAttributes } from '../internal/utils/with-native-attributes';

export interface ActionCardProps extends BaseComponentProps {
  /**
   * The header content displayed at the top of the action card.
   */
  header?: ReactNode;

  /**
   * The description content displayed below the header.
   */
  description?: ReactNode;

  /**
   * The main content of the action card.
   */
  children?: ReactNode;

  /**
   * Called when the user clicks on the action card.
   */
  onClick?: CancelableEventHandler<ActionCardProps.ClickDetail>;

  /**
   * Adds an aria-label to the action card.
   */
  ariaLabel?: string;

  /**
   * Adds an aria-describedby reference for the action card.
   */
  ariaDescribedby?: string;

  /**
   * Determines whether the action card is disabled.
   */
  disabled?: boolean;

  /**
   * Removes the default padding from the header area.
   */
  disableHeaderPaddings?: boolean;

  /**
   * Removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * Displays an icon next to the content. You can use the `iconVerticalAlignment` property to control vertical alignment.
   */
  icon?: React.ReactNode;

  /**
   * Specifies the vertical alignment of the icon.
   */
  iconVerticalAlignment?: ActionCardProps.IconVerticalAlignment;

  /**
   * Specifies the visual variant of the card, which controls the border radius and padding.
   *
   * - `default` - Uses container-level border radius and padding (larger).
   * - `embedded` - Uses compact border radius and padding (smaller).
   */
  variant?: ActionCardProps.Variant;

  /**
   * Attributes to add to the native button element.
   * Some attributes will be automatically combined with internal attribute values:
   * - `className` will be appended.
   * - Event handlers will be chained, unless the default is prevented.
   *
   * We do not support using this attribute to apply custom styling.
   *
   * @awsuiSystem core
   */
  nativeButtonAttributes?: NativeAttributes<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}

export namespace ActionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface ClickDetail {}

  export type IconVerticalAlignment = 'top' | 'center';
  export type Variant = 'default' | 'embedded';

  export interface Ref {
    /**
     * Sets focus on the action card.
     */
    focus(): void;
  }
}
