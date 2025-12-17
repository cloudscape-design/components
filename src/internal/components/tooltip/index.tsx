// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import PopoverArrow from '../../../popover/arrow';
import PopoverBody from '../../../popover/body';
import PopoverContainer from '../../../popover/container';
import { PopoverProps } from '../../../popover/interfaces';
import { Transition } from '../transition';

import styles from './styles.css.js';

export interface TooltipProps {
  value: React.ReactNode;
  trackRef: React.RefObject<HTMLElement | SVGElement>;
  trackKey?: string | number;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  size?: PopoverProps['size'];
  hideOnOverscroll?: boolean;
  onDismiss?: () => void;
}

// Generate unique ID for older React versions
let tooltipIdCounter = 0;
const generateTooltipId = () => `internal-tooltip-${++tooltipIdCounter}`;

export default function Tooltip({
  value,
  trackRef,
  trackKey,
  className,
  position = 'top',
  size = 'small',
  hideOnOverscroll,
  onDismiss,
}: TooltipProps) {
  const tooltipId = React.useMemo(() => generateTooltipId(), []);

  // Add aria-describedby to the tracked element for accessibility
  React.useEffect(() => {
    const element = trackRef.current;
    if (element) {
      element.setAttribute('aria-describedby', tooltipId);
    }

    return () => {
      // Clean up aria-describedby when tooltip unmounts
      if (element) {
        element.removeAttribute('aria-describedby');
      }
    };
  }, [tooltipId, trackRef]);

  if (!trackKey && (typeof value === 'string' || typeof value === 'number')) {
    trackKey = value;
  }

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // Prevent any surrounding modals or dialogs from acting on this Esc.
          event.stopPropagation();
          onDismiss?.();
        }
      },
      {
        // The tooltip is often activated on mouseover, which means the focus can
        // be anywhere else on the page. Capture also means that this gets called
        // before any wrapper modals or dialogs can detect it and act on it.
        capture: true,
        signal: controller.signal,
      }
    );
    return () => {
      controller.abort();
    };
  }, [onDismiss]);

  return (
    <Portal>
      <div className={styles.root} data-testid={trackKey} id={tooltipId} role="tooltip">
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={trackRef}
              trackKey={trackKey}
              size={size}
              fixedWidth={false}
              position={position}
              zIndex={7000}
              arrow={position => <PopoverArrow position={position} />}
              hideOnOverscroll={hideOnOverscroll}
              className={className}
            >
              <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={undefined} header={undefined}>
                {value}
              </PopoverBody>
            </PopoverContainer>
          )}
        </Transition>
      </div>
    </Portal>
  );
}
