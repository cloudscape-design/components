// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface FeaturePromptProps {
  visible: boolean;

  onDismiss: NonCancelableEventHandler<null>;

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

export namespace FeaturePromptProps {}
