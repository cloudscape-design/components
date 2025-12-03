// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef, useState } from 'react';

import type { TooltipProps } from './interfaces';
import { useTooltipCoordinator } from './tooltip-coordinator';

export interface UseTooltipAdvancedOptions {
  position?: TooltipProps['position'];
  size?: TooltipProps['size'];
  content: React.ReactNode;
  onDismiss?: () => void;
  id?: string;
  disableCoordination?: boolean;
}

export interface TooltipApi {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  isVisible: boolean;
}

/**
 * Advanced tooltip hook that properly handles both hover and focus states.
 * The tooltip remains visible as long as the element is either hovered OR focused.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [targetProps, tooltipProps, tooltipApi] = useTooltipAdvanced({
 *     content: "Tooltip text",
 *     position: "top"
 *   });
 *
 *   return (
 *     <div>
 *       <button {...targetProps}>Hover or focus me</button>
 *       {tooltipProps && <Tooltip {...tooltipProps} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTooltipAdvanced(options: UseTooltipAdvancedOptions): [
  targetProps: {
    ref: React.RefObject<HTMLElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  },
  tooltipProps: TooltipProps | null,
  api: TooltipApi,
] {
  const ref = useRef<HTMLElement>(null);

  // Generate stable ID for this tooltip instance
  const tooltipId = useRef(options.id || `tooltip-${Math.random().toString(36).substr(2, 9)}`).current;

  // Get coordinator context (null if not wrapped in TooltipCoordinator)
  const coordinator = useTooltipCoordinator();

  // Destructure to get stable references
  const activeTooltipId = coordinator?.activeTooltipId ?? null;
  const registerTooltip = coordinator?.registerTooltip;
  const unregisterTooltip = coordinator?.unregisterTooltip;

  // Track hover and focus states separately
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Determine if THIS tooltip should be visible
  const wantsToShow = isHovered || isFocused;
  const isCoordinated = coordinator && !options.disableCoordination;
  const isActiveTooltip = !isCoordinated || activeTooltipId === tooltipId;
  const isVisible = wantsToShow && isActiveTooltip;

  // Register/unregister with coordinator when wantsToShow changes
  useEffect(() => {
    if (!registerTooltip || !unregisterTooltip || options.disableCoordination) {
      return;
    }

    if (wantsToShow) {
      registerTooltip(tooltipId);
    } else {
      unregisterTooltip(tooltipId);
    }
  }, [wantsToShow, registerTooltip, unregisterTooltip, options.disableCoordination, tooltipId]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const show = useCallback(() => {
    setIsHovered(true);
    setIsFocused(true);
  }, []);

  const hide = useCallback(() => {
    setIsHovered(false);
    setIsFocused(false);
    options.onDismiss?.();
  }, [options]);

  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  const targetProps = {
    ref,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const tooltipProps: TooltipProps | null = isVisible
    ? {
        trackRef: ref,
        value: options.content,
        position: options.position,
        size: options.size,
        onDismiss: options.onDismiss ? hide : undefined,
      }
    : null;

  const api: TooltipApi = {
    show,
    hide,
    toggle,
    isVisible,
  };

  return [targetProps, tooltipProps, api];
}
