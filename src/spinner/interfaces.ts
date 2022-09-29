// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface SpinnerProps extends BaseComponentProps {
  /**
   * Specifies the size of the spinner.
   */
  size?: SpinnerProps.Size;
  /**
   * Specifies the color variant of the spinner. The `normal` variant picks up the current color of its context.
   */
  variant?: SpinnerProps.Variant;

  /**
   * An object containing all the necessary localized strings required by
   * the component.
   */
  i18nStrings?: SpinnerProps.I18nStrings;
}

export namespace SpinnerProps {
  export type Size = 'normal' | 'big' | 'large';
  export type Variant = 'normal' | 'disabled' | 'inverted';

  export interface I18nStrings {
    /**
     * Provides text for an aria-live announcement which provides an accessible alternative to the "spinner" visual
     */
    loadingAriaLiveText?: string;
  }
}
