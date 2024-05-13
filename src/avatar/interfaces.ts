// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface AvatarProps extends BaseComponentProps {
  /**
   * Variant of the avatar.
   * It can be "user" or "genai"
   */
  variant: AvatarProps.Variant;

  /**
   * Indicates whether avatar is in loading state.
   * It can only be used with "genai" variant.
   */
  loading?: boolean;

  /**
   * The name of the user agent shown in the tooltip.
   * It can only be used with "user" variant.
   * If passed, the avatar will show the first letter.
   */
  userName?: string;

  /**
   * Specifies the size of the icon.
   *
   * If you set size to `inherit`, an icon size will be assigned based on the icon's inherited line height.
   * For icons used alongside text, ensure the icon is placed inside the acompanying text tag.
   * The icon will be vertically centered based on the height.
   *
   * @visualrefresh `medium` size
   */
  size?: AvatarProps.Size;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: AvatarProps.I18nStrings;
}

export namespace AvatarProps {
  export interface I18nStrings {
    /**
     * Provides a text alternative for the user icon.
     * If userName is passed, it's used here as well.
     */
    userIconAriaLabel?: string;

    /**
     * Provides a text alternative for the Gen-AI icon.
     */
    genAiIconAriaLabel?: string;

    /**
     * Provides a text alternative for the loading icon.
     */
    loading?: string;
  }

  export type Size = 'small' | 'normal' | 'medium';

  export type Variant = 'user' | 'genai';
}
