// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useEffect } from 'react';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import { Transition } from '../internal/components/transition';
import { fireNonCancelableEvent } from '../internal/events';
import PopoverArrow from '../popover/arrow';
import PopoverBody from '../popover/body';
import PopoverContainer from '../popover/container';
import { TooltipProps } from './interfaces';

import styles from './styles.css.js';

export { TooltipProps };

export default function Tooltip({
  content,
  anchorRef,
  trackingKey,
  position = 'top',
  dismissOnScroll,
  onClose,
}: TooltipProps) {
  if (!trackingKey && (typeof content === 'string' || typeof content === 'number')) {
    trackingKey = content;
  }

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // Prevent any surrounding modals or dialogs from acting on this Esc.
          event.stopPropagation();
          fireNonCancelableEvent(onClose);
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
  }, [onClose]);

  return (
    <Portal>
      <div className={styles.root} data-testid={trackingKey}>
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={anchorRef}
              trackKey={trackingKey}
              size="medium"
              fixedWidth={false}
              position={position}
              zIndex={7000}
              arrow={position => <PopoverArrow position={position} />}
              hideOnOverscroll={dismissOnScroll}
            >
              <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={undefined} header={undefined}>
                {content}
              </PopoverBody>
            </PopoverContainer>
          )}
        </Transition>
      </div>
    </Portal>
  );
}
