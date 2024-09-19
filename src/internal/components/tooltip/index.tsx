// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import PopoverArrow from '../../../popover/arrow';
import PopoverBody from '../../../popover/body';
import PopoverContainer from '../../../popover/container';
import { PopoverProps } from '../../../popover/interfaces';
import Portal from '../portal';
import { Transition } from '../transition';

import styles from './styles.css.js';

export interface TooltipProps {
  value: React.ReactNode;
  trackRef: React.RefObject<HTMLElement | SVGElement>;
  trackKey?: string | number;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  contentAttributes?: React.HTMLAttributes<HTMLDivElement>;
  size?: PopoverProps['size'];
}

export default function Tooltip({
  value,
  trackRef,
  trackKey,
  className,
  contentAttributes = {},
  position = 'top',
  size = 'small',
}: TooltipProps) {
  if (!trackKey && (typeof value === 'string' || typeof value === 'number')) {
    trackKey = value;
  }

  return (
    <Portal>
      <div className={clsx(styles.root, className)} {...contentAttributes} data-testid={trackKey}>
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
