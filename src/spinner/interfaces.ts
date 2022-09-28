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
   * A string used to label the spinner icon, if ariaLiveAnnounce is true then this is the text that is announced.
   */
  loadingAltText?: string;
  /**
   * Determines if the spinner announces with aria-live. If true the text of loadingAltText will be announced.
   */
  ariaLiveAnnounce?: boolean;

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
    loadingAltText?: string;
  }
}
