// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface TooltipProps {
  /**
   * Content to display in the tooltip.
   */
  content: React.ReactNode;

  /**
   * Reference to the element that the tooltip should track.
   */
  anchorRef: React.RefObject<HTMLElement | SVGElement>;

  /**
   * Optional test identifier for the tooltip.
   * If not provided and content is a string or number, it will be auto-generated from content.
   */
  testId?: string | number;

  /**
   * Position of the tooltip relative to the tracked element.
   * @defaultValue 'top'
   */
  position?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Additional CSS class name to apply to the tooltip.
   */
  className?: string;

  /**
   * Whether to dismiss the tooltip when the user scrolls.
   */
  dismissOnScroll?: boolean;

  /**
   * Callback fired when the tooltip should be closed (e.g., on Escape key press).
   */
  onClose?: () => void;
}
