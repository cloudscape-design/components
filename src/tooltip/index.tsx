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
  getTrack,
  trackKey,
  position = 'top',
  __dismissOnScroll,
  onEscape,
}: TooltipProps) {
  const trackRef = React.useRef<HTMLElement | SVGElement | null>(null);

  // Update the ref with the current tracked element
  React.useEffect(() => {
    trackRef.current = getTrack();
  });

  if (!trackKey && (typeof content === 'string' || typeof content === 'number')) {
    trackKey = content;
  }

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // Prevent any surrounding modals or dialogs from acting on this Esc.
          event.stopPropagation();
          fireNonCancelableEvent(onEscape);
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
  }, [onEscape]);

  return (
    <Portal>
      <div className={styles.root} data-testid={trackKey}>
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={trackRef}
              trackKey={trackKey}
              size="medium"
              fixedWidth={false}
              position={position}
              zIndex={7000}
              arrow={position => <PopoverArrow position={position} />}
              hideOnOverscroll={__dismissOnScroll}
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
