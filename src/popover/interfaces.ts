// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface PopoverProps extends BaseComponentProps {
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
   * Specifies the type of content inside the trigger region. The following types are available:
   * - `text` - Use for inline text triggers.
   * - `custom` - Use for the [button](/components/button/) component.
   */
  triggerType?: PopoverProps.TriggerType;

  /**
   * Adds `aria-label` to the text trigger button. Use this to provide an accessible name for triggers
   * that don't have visible text, and to distinguish between multiple triggers with identical visible text.
   */
  triggerAriaLabel?: string;

  /**
   * Element that triggers the popover when selected by the user.
   * @displayname trigger
   */
  children?: React.ReactNode;

  /**
   * Specifies optional header text for the popover.
   */
  header?: string;

  /**
   * Content of the popover.
   */
  content?: React.ReactNode;

  /**
   * Determines whether the dismiss button is shown in the popover body.
   */
  dismissButton?: boolean;

  /**
   * Adds an `aria-label` to the dismiss button for accessibility.
   * @i18n
   */
  dismissAriaLabel?: string;

  /**
   * By default, the popover is constrained to fit inside its parent
   * [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).
   * Enabling this property will allow the popover to be rendered in the root stack context using
   * [React Portals](https://reactjs.org/docs/portals.html).
   * Enable this setting if you need the popover to ignore its parent stacking context, such as in side navigation.
   *
   * Note: Using popover rendered with portal within a Modal is not supported.
   */
  renderWithPortal?: boolean;
}

/**
 * The position the popover is actually in, given space constraints.
 */
export type InternalPosition =
  | 'right-top'
  | 'right-bottom'
  | 'left-top'
  | 'left-bottom'
  | 'top-center'
  | 'top-right'
  | 'top-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

export interface Offset {
  insetInlineStart: number;
  insetBlockStart: number;
}

export interface Dimensions {
  inlineSize: number;
  blockSize: number;
}

export type BoundingBox = Dimensions & Offset;

export namespace PopoverProps {
  export type Position = 'top' | 'right' | 'bottom' | 'left';
  export type Size = 'small' | 'medium' | 'large';
  export type TriggerType = 'text' | 'custom';

  export interface Ref {
    /**
     * Closes Popover.
     */
    dismissPopover(): void;
  }
}
