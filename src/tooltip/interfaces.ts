// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { RefShim } from '../internal/types';
import { PopoverProps } from '../popover/interfaces';

export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   */
  content: string;

  /**
   * Reference to the element that the tooltip should track.
   */
  anchorRef: RefShim<HTMLElement | SVGElement>;

  /**
   * Unique identifier for the tooltip instance. Changing this value will cause the tooltip
   * to recalculate its position, similar to how React's key prop works.
   *
   * This is useful when the tooltip needs to track a different element or respond to
   * significant content changes.
   *
   * If not provided and content is a string or number, it will be auto-generated from content.
   *
   * @remarks
   * The trackingKey is also applied as the data-testid attribute for testing purposes.
   */
  trackingKey?: string | number;

  /**
   * Position of the tooltip relative to the tracked element.
   * @defaultValue 'top'
   */
  position?: PopoverProps.Position;

  /**
   * Whether to dismiss the tooltip when the user scrolls.
   */
  dismissOnScroll?: boolean;

  /**
   * Callback fired when the tooltip should be closed (e.g., on Escape key press).
   */
  onClose?: NonCancelableEventHandler;

  /**
   * Additional HTML attributes to apply to the tooltip container element.
   * This can be used for custom event handlers, data attributes, or other DOM properties.
   *
   * @example
   * // Add click-to-dismiss behavior
   * contentAttributes={{ onPointerDown: () => setShowTooltip(false) }}
   *
   * @example
   * // Add analytics tracking
   * contentAttributes={{ 'data-analytics': 'help-tooltip' }}
   */
  contentAttributes?: React.HTMLAttributes<HTMLDivElement>;
}
