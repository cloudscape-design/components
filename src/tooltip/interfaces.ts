// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   */
  content: React.ReactNode;

  /**
   * Optional trigger element that the tooltip is anchored to, if getTrack isn't provided.
   */
  trigger?: React.ReactNode;

  /**
   * The behavior of the tooltip trigger.
   *
   * * `manual` (default) - The tooltip is always shown.
   * * `truncation` - The tooltip is only shown when the trigger element is truncated.
   * * `group` - The tooltip is shown on hover or focus and is associated to the content using aria-describedby.
   * * `announcement` - The tooltip is shown on hover or focus and announced using LiveRegion.
   */
  triggerVariant?: TooltipProps.TriggerVariant;

  /**
   * Function that returns the element the tooltip points to.
   * Can return null if the element is not yet mounted or available.
   *
   * @awsuiSystem core
   */
  getTrack?: () => null | HTMLElement | SVGElement;

  /**
   * Determines where the tooltip is displayed when opened, relative to the trigger. If the tooltip doesn't have enough space to open in this direction, it automatically chooses a better direction based on available space.
   */
  position?: TooltipProps.Position;

  /**
   * Callback fired when the user presses the Escape key while the tooltip is visible.
   *
   * @awsuiSystem core
   */
  onEscape?: NonCancelableEventHandler;
}
export namespace TooltipProps {
  /**
   * Position of the tooltip relative to the tracked element.
   */
  export type Position = PopoverProps.Position;

  /**
   * The behavior of the tooltip trigger.
   */
  export type TriggerVariant = 'manual' | 'truncation' | 'group' | 'announcement';
}

/**
 * Internal tooltip props - includes props not exposed in public API.
 * Note: position defaults to 'top' in both index.tsx and internal.tsx
 */
export interface InternalTooltipProps extends TooltipProps {
  /**
   * Additional CSS class for the tooltip container.
   */
  className?: string;
}
