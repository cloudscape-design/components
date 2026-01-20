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
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  size?: PopoverProps['size'];
  hideOnOverscroll?: boolean;
  onDismiss?: () => void;
}

export default function Tooltip({
  value,
  trackRef,
  className,
  position = 'top',
  size = 'small',
  hideOnOverscroll,
  onDismiss,
}: TooltipProps) {
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
      <div className={styles.root} role="tooltip">
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={trackRef}
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
