// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';

import { Portal } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { Transition } from '../internal/components/transition';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import PopoverArrow from '../popover/arrow';
import PopoverBody from '../popover/body';
import PopoverContainer from '../popover/container';
import { InternalTooltipProps } from './interfaces';

import styles from './styles.css.js';

type InternalTooltipComponentProps = InternalTooltipProps & InternalBaseComponentProps;

export default function InternalTooltip({
  content,
  getTrack,
  trackKey,
  className,
  position = 'top',
  onEscape,
  __internalRootRef,
  ...restProps
}: InternalTooltipComponentProps) {
  const baseProps = getBaseProps(restProps);
  const trackRef = React.useRef<HTMLElement | SVGElement | null>(null);

  // Update the ref with the current tracked element
  React.useEffect(() => {
    const element = getTrack();
    trackRef.current = element;
  }, [getTrack]);
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
      <div
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        data-testid={trackKey}
        ref={__internalRootRef}
        role="tooltip"
      >
        <Transition in={true}>
          {() => (
            <PopoverContainer
              getTrack={getTrack}
              trackKey={trackKey}
              size="medium"
              fixedWidth={false}
              position={position}
              zIndex={7000}
              arrow={position => <PopoverArrow position={position} />}
              hideOnOverscroll={true}
              className={className}
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
