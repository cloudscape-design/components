// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import InternalTooltip from '../internal/components/tooltip';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TooltipProps } from './interfaces';
import { getTooltipStyles } from './styles';

import styles from './styles.css.js';

export interface InternalTooltipProps extends TooltipProps, InternalBaseComponentProps {}

export default function InternalTooltipComponent({
  content,
  children,
  position = 'top',
  align = 'center',
  trigger = 'hover-focus',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  showDelay: propShowDelay = 120,
  hideDelay = 200,
  hideOnOverscroll = true,
  disableHoverableContent: propDisableHoverableContent = false,
  style,
  __internalRootRef,
  ...rest
}: InternalTooltipProps) {
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Use context defaults if prop not provided
  const showDelay = propShowDelay;
  const disableHoverableContent = propDisableHoverableContent;

  // Controlled/uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isVisible = isControlled ? controlledOpen : uncontrolledOpen;

  const showTimeoutRef = useRef<number>();
  const hideTimeoutRef = useRef<number>();

  const setIsOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const show = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    if (showDelay > 0) {
      showTimeoutRef.current = window.setTimeout(() => setIsOpen(true), showDelay);
    } else {
      setIsOpen(true);
    }
  }, [showDelay, setIsOpen]);

  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    if (hideDelay > 0) {
      hideTimeoutRef.current = window.setTimeout(() => setIsOpen(false), hideDelay);
    } else {
      setIsOpen(false);
    }
  }, [hideDelay, setIsOpen]);

  // Immediate show/hide without delay for keyboard interactions
  const showImmediate = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    setIsOpen(true);
  }, [setIsOpen]);

  const hideImmediate = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = trigger === 'hover' || trigger === 'hover-focus' ? show : undefined;
  const handleMouseLeave = trigger === 'hover' || trigger === 'hover-focus' ? hide : undefined;
  const handleFocus = trigger === 'focus' || trigger === 'hover-focus' ? show : undefined;
  const handleBlur = trigger === 'focus' || trigger === 'hover-focus' ? hide : undefined;

  // Keyboard accessibility handlers
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only handle keyboard events for focus-enabled triggers
      if (trigger !== 'focus' && trigger !== 'hover-focus') {
        return;
      }

      switch (event.key) {
        case 'Tab':
          // Tab toggles tooltip immediately
          if (isVisible) {
            hideImmediate();
          } else {
            showImmediate();
          }
          break;
        case ' ':
        case 'Spacebar': // For older browsers
          // Space closes tooltip if open
          if (isVisible) {
            event.preventDefault(); // Prevent page scroll
            hideImmediate();
          }
          break;
        case 'Enter':
          // Enter closes tooltip if open
          if (isVisible) {
            event.preventDefault();
            hideImmediate();
          }
          break;
        case 'Escape':
        case 'Esc': // For older browsers
          // Escape closes tooltip if open
          if (isVisible) {
            event.preventDefault();
            hideImmediate();
          }
          break;
      }
    },
    [trigger, isVisible, showImmediate, hideImmediate]
  );

  // Get trigger dimensions for CSS custom properties
  const triggerRect = triggerRef.current?.getBoundingClientRect();

  const tooltipStyles = {
    ...getTooltipStyles(style),
    // CSS custom properties for advanced styling
    '--tooltip-trigger-width': triggerRect ? `${triggerRect.width}px` : undefined,
    '--tooltip-trigger-height': triggerRect ? `${triggerRect.height}px` : undefined,
  } as React.CSSProperties;

  // Note: align, sideOffset, and alignOffset are accepted for API compatibility
  // but not currently implemented in the positioning system.
  // The smart positioning system will automatically choose the best position
  // based on available space.

  return (
    <span
      ref={__internalRootRef}
      className={clsx(styles.root)}
      data-state={isVisible ? 'open' : 'closed'}
      data-position={position}
      data-align={align}
      {...rest}
    >
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {children}
      </span>
      {isVisible &&
        (disableHoverableContent ? (
          <InternalTooltip
            value={content}
            trackRef={triggerRef}
            position={position}
            hideOnOverscroll={hideOnOverscroll}
            onDismiss={() => setIsOpen(false)}
            className={styles.tooltip}
            contentAttributes={{ style: tooltipStyles }}
          />
        ) : (
          <div ref={tooltipRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <InternalTooltip
              value={content}
              trackRef={triggerRef}
              position={position}
              hideOnOverscroll={hideOnOverscroll}
              onDismiss={() => setIsOpen(false)}
              className={styles.tooltip}
              contentAttributes={{ style: tooltipStyles }}
            />
          </div>
        ))}
    </span>
  );
}
