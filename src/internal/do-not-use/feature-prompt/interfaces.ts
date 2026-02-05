// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PopoverProps } from '../../../popover/interfaces';
import { NonCancelableEventHandler } from '../../events';

export interface FeaturePromptProps {
  /**
   * Called when the feature prompt shows.
   */
  onShow?: NonCancelableEventHandler<null>;

  /**
   * Called when a user closes the prompt by using the close icon button,
   * clicking outside the prompt, shifting focus out of the prompt or pressing ESC.
   */
  onDismiss?: NonCancelableEventHandler<null>;

  /**
   * Determines where the feature prompt is displayed when opened, relative to the trigger.
   * If the feature prompt doesn't have enough space to open in this direction, it
   * automatically chooses a better direction based on available space.
   */
  position?: FeaturePromptProps.Position;

  /**
   * Determines the maximum width for the feature prompt.
   */
  size?: FeaturePromptProps.Size;

  /**
   * Specifies header content for the feature prompt.
   */
  header: React.ReactNode;

  /**
   * Content of the feature prompt.
   */
  content: React.ReactNode;

  /**
   * An object containing all the necessary localized strings required by the component.
   * @i18n
   */
  i18nStrings?: FeaturePromptProps.I18nStrings;

  /**
   * Function that returns the element to track for positioning the prompt.
   * Use this when you want to position the prompt relative to an external element.
   * Cannot be used together with the children prop.
   */
  getTrack: () => null | HTMLElement | SVGElement;

  /**
   * Unique identifier for the tracked element. Used for tracking position changes
   * when using getTrack.
   */
  trackKey?: string | number;
}

export namespace FeaturePromptProps {
  export type Position = PopoverProps.Position;
  export type Size = PopoverProps.Size;
  export interface I18nStrings {
    /**
     * Adds an `aria-label` to the dismiss button for accessibility.
     * @i18n
     */
    dismissAriaLabel?: string;
  }
  export interface Ref {
    /**
     * Use only if an element other than the trigger needs to be focused after dismissing the prompt.
     */
    dismiss(): void;

    /**
     * Shows the prompt and focuses its close button.
     */
    show(): void;
  }
}
