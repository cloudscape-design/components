// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../internal/events';
import { RefShim } from '../internal/types';
import { PopoverProps } from '../popover/interfaces';

export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   * Accepts any valid React node including strings, numbers, elements, and fragments.
   */
  content: React.ReactNode;

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
   * For complex content (elements, fragments), you should provide an explicit trackingKey.
   *
   * @remarks
   * - The trackingKey is also applied as the data-testid attribute for testing purposes.
   * - Update trackingKey when tooltip content changes significantly to force position recalculation.
   * - For dynamic content, use a unique value based on your state: `trackingKey={`tooltip-${id}`}`
   *
   * @example
   * // Auto-generated from simple content
   * <Tooltip content="Help text" />
   *
   * // Explicit trackingKey for complex content
   * <Tooltip content={<div>Rich content</div>} trackingKey="help-tooltip" />
   *
   * // Explicit trackingKey for dynamic content
   * <Tooltip content={dynamicText} trackingKey={`user-${userId}`} />
   *
   * // Force recalculation when state changes
   * <Tooltip content={message} trackingKey={`status-${currentStatus}`} />
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
}
