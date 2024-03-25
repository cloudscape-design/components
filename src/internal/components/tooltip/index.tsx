// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { Transition } from '../transition';
import PopoverContainer from '../../../popover/container';
import PopoverBody from '../../../popover/body';
import Portal from '../portal';
import popoverStyles from '../../../popover/styles.css.js';
import styles from './styles.css.js';

export interface TooltipProps {
  value: number | string;
  trackRef: React.RefObject<Element>;
}

export default function Tooltip({ value, trackRef }: TooltipProps) {
  return (
    <Portal>
      <div className={styles.root}>
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={trackRef}
              trackKey={value}
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
              <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={() => {}} header={undefined}>
                {value}
              </PopoverBody>
            </PopoverContainer>
          )}
        </Transition>
      </div>
    </Portal>
  );
}
