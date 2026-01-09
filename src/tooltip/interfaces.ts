// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { PopoverProps } from '../popover/interfaces';

export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   * Accepts any valid React node including strings, numbers, elements, and fragments.
   */
  content: React.ReactNode;

  /**
   * Function that returns the element to track for positioning the tooltip.
   * Can return null if the element is not yet mounted or available.
   */
  getTrack: () => null | HTMLElement | SVGElement;

  /**
   * Unique identifier for the tooltip instance. Changing this value will cause the tooltip
   * to recalculate its position, similar to how React's key prop works.
   * If not provided and content is a string or number, it will be used as key.
   * For complex content (elements, fragments), you should provide an explicit trackKey.
   */
  trackKey?: string | number;

  /**
   * Position of the tooltip relative to the tracked element.
   * @defaultValue 'top'
   */
  position?: TooltipProps.Position;
  /**
   * Callback fired when the user presses the Escape key while the tooltip is visible.
   */
  onEscape?: NonCancelableEventHandler;
}
export namespace TooltipProps {
  /**
   * Position of the tooltip relative to the tracked element.
   */
  export type Position = PopoverProps.Position;
}

/**
 * Internal tooltip props - includes props not exposed in public API.
 * @internal
 */
export interface InternalTooltipProps extends TooltipProps {
  /**
   * Additional CSS class for the tooltip container.
   * @internal
   */
  className?: string;
}
