// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface FeaturePromptProps {
  /**
   * Determines whether the prompt is displayed.
   *
   * When you use ref.show() to display the prompt it will be shown regardless of the value in this field.
   */
  visible: boolean;

  /**
   * Called when a user closes the modal by using the close icon button,
   * clicking outside of the modal, or pressing ESC.
   */
  onDismiss?: NonCancelableEventHandler<null>;

  /**
   * Called when prompt focus is removed from the UI control.
   */
  onBlur?: NonCancelableEventHandler<null>;

  /**
   * Determines where the popover is displayed when opened, relative to the trigger.
   * If the popover doesn't have enough space to open in this direction, it
   * automatically chooses a better direction based on available space.
   */
  position?: PopoverProps.Position;

  /**
   * Determines the maximum width for the popover.
   */
  size?: PopoverProps.Size;

  /**
   * Expands the popover body to its maximum width regardless of content.
   * For example, use it when you need to place a column layout in the popover content.
   */
  fixedWidth?: boolean;

  /**
   * Element that triggers the popover when selected by the user.
   * @displayname trigger
   */
  children?: React.ReactNode;

  /**
   * Specifies optional header text for the popover.
   */
  header?: React.ReactNode;

  /**
   * Content of the popover.
   */
  content: React.ReactNode;

  /**
   * Adds an `aria-label` to the dismiss button for accessibility.
   * @i18n
   */
  dismissAriaLabel?: string;
}

export namespace FeaturePromptProps {
  export interface Ref {
    /**
     * Sets focus on the prompt's close button.
     */
    focus(): void;

    /**
     * Dismisses the prompt without focusing the trigger. Use only if an element other than the trigger needs to be focused after dismissing the prompt.
     */
    dismiss(): void;

    /**
     * Shows the prompt and focuses its close button.
     */
    show(): void;
  }
}
