// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';

export interface TooltipProps extends BaseComponentProps {
  /**
   * The content to display inside the tooltip.
   * Supports plain text, formatted content, and interactive elements like links.
   */
  content: React.ReactNode;

  /**
   * The trigger element that shows the tooltip on interaction.
   */
  children: React.ReactNode;

  /**
   * Specifies the preferred position of the tooltip relative to the trigger element.
   * The positioning system will automatically choose the best position based on available space.
   * @defaultValue 'top'
   */
  position?: TooltipProps.Position;

  /**
   * Controls when the tooltip is displayed.
   * @defaultValue 'hover-focus'
   */
  trigger?: TooltipProps.Trigger;

  /**
   * Controlled open state. When provided, the tooltip visibility is controlled by the parent.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /**
   * Callback fired when the tooltip's open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Delay in milliseconds before showing the tooltip.
   * Note: Keyboard interactions bypass this delay.
   * @defaultValue 120
   */
  showDelay?: number;

  /**
   * Delay in milliseconds before hiding the tooltip.
   * Note: Keyboard interactions bypass this delay.
   * @defaultValue 200
   */
  hideDelay?: number;

  /**
   * Whether to hide the tooltip when scrolled out of view.
   * @defaultValue true
   */
  hideOnOverscroll?: boolean;

  /**
   * Controls whether users can hover over tooltip content to keep it open.
   * Set to false when content includes interactive elements like links.
   * @defaultValue false
   */
  disableHoverableContent?: boolean;

  /**
   * Custom styling for the tooltip appearance.
   */
  style?: TooltipProps.Style;

  /**
   * Alignment of the tooltip relative to the trigger element.
   * The positioning system automatically chooses the best position based on available space.
   * @defaultValue 'center'
   */
  align?: TooltipProps.Align;
}

export namespace TooltipProps {
  export type Position = 'top' | 'right' | 'bottom' | 'left';

  export type Trigger = 'hover' | 'focus' | 'hover-focus' | 'manual';

  export type Align = 'start' | 'center' | 'end';

  export interface Style {
    content?: {
      backgroundColor?: string;
      borderColor?: string;
      borderRadius?: string;
      borderWidth?: string;
      boxShadow?: string;
      color?: string;
      fontSize?: string;
      fontWeight?: string;
      maxWidth?: string;
      padding?: string;
    };
  }
}
