// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { PopoverProps } from '../popover/interfaces';

export interface TooltipProps {
  /**
   * The content to display in the tooltip.
   */
  value: React.ReactNode;

  /**
   * Reference to the element the tooltip is positioned against.
   */
  trackRef: React.RefObject<HTMLElement | SVGElement>;

  /**
   * A unique key to identify the tooltip. If not provided and value is a string or number,
   * the value will be used as the key.
   */
  trackKey?: string | number;

  /**
   * The position of the tooltip relative to the tracked element.
   * @default 'top'
   */
  position?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Additional CSS class name to apply to the tooltip container.
   */
  className?: string;

  /**
   * Additional HTML attributes to apply to the tooltip content container.
   */
  contentAttributes?: React.HTMLAttributes<HTMLDivElement>;

  /**
   * The size of the tooltip.
   * @default 'small'
   */
  size?: PopoverProps['size'];

  /**
   * If true, the tooltip will be hidden when the page is scrolled.
   */
  hideOnOverscroll?: boolean;

  /**
   * Callback function called when the tooltip should be dismissed.
   */
  onDismiss?: () => void;
}

export namespace TooltipProps {
  export interface Ref {
    focus(): void;
  }
}
