// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Transition } from '../../internal/components/transition/index.js';
import popoverStyles from '../../popover/styles.css.js';
import PopoverContainer from '../../popover/container.js';
import Portal from '../../internal/components/portal/index.js';
import PopoverBody from '../../popover/body.js';
import styles from './styles.css.js';

export interface TooltipProps {
  trackKey: string;
  trackRef: React.RefObject<HTMLElement | SVGElement>;
  content: React.ReactNode;
  open: boolean;
  close?: () => void;
}

export default function Tooltip({ trackKey, trackRef, content, open, close }: TooltipProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const currentRef = trackRef.current;
    const handlePointerDownEvent = (event: PointerEvent) => {
      if (event.target && currentRef && currentRef.contains(event.target as HTMLElement)) {
        return;
      }

      if (close) {
        close();
      }
    };

    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && close) {
        close();
      }
    };

    const handleTooltipToogleEvent = (event: CustomEvent) => {
      if (event.detail.trackKey !== trackKey && event.detail.open && close) {
        close();
      }
    };

    window.addEventListener('pointerdown', handlePointerDownEvent);
    window.addEventListener('keydown', handleKeyDownEvent);
    window.addEventListener('tooltip:toggle', handleTooltipToogleEvent as any);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDownEvent);
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('tooltip:toggle', handleTooltipToogleEvent as any);
    };
  }, [open, close, trackRef, trackKey]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('tooltip:toggle', { detail: { open, trackKey } }));
  }, [open, trackKey]);

  if (!open || !content) {
    return null;
  }

  return (
    <Portal>
      <div className={styles.root}>
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={trackRef}
              trackKey={trackKey}
              size="small"
              fixedWidth={false}
              position="top"
              arrow={position => (
                <div className={clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`])}>
                  <div className={popoverStyles['arrow-outer']} />
                  <div className={popoverStyles['arrow-inner']} />
                </div>
              )}
            >
              <PopoverBody
                dismissButton={false}
                dismissAriaLabel={undefined}
                onDismiss={undefined}
                header={undefined}
                className={styles.body}
              >
                {content}
              </PopoverBody>
            </PopoverContainer>
          )}
        </Transition>
      </div>
    </Portal>
  );
}
