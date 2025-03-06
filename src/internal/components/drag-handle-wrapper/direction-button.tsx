// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import { IconProps } from '../../../icon/interfaces';
import InternalIcon from '../../../icon/internal';
import { Transition } from '../transition';
import { Direction, DirectionState } from './interfaces';

import styles from './styles.css.js';

// Mapping from CSS logical property direction to icon name. The icon component
// already flips the left/right icons automatically based on RTL, so we don't
// need to do anything special.
const ICON_LOGICAL_PROPERTY_MAP: Record<Direction, IconProps.Name> = {
  'block-start': 'arrow-up',
  'block-end': 'arrow-down',
  'inline-start': 'arrow-left',
  'inline-end': 'arrow-right',
};

interface DirectionButtonProps {
  direction: Direction;
  state: DirectionState | undefined;
  onClick: React.MouseEventHandler;
  show: boolean;
  rtl: boolean;
}

export default function DirectionButton({ direction, state, show, rtl, onClick }: DirectionButtonProps) {
  return (
    <Transition in={show}>
      {(transitionState, ref) => (
        <span
          ref={ref}
          className={clsx(
            styles['direction-button'],
            styles[`direction-button-${direction}`],
            rtl && styles[`direction-button-rtl`],
            state === 'disabled' && styles['direction-button-disabled'],
            transitionState === 'exited' && styles['direction-button-hidden'],
            styles[`direction-button-motion-${transitionState}`]
          )}
          onClick={onClick}
          // This prevents focus from being lost to `document.body` on
          // mouse/pointer press. This allows us to listen to onClick while
          // keeping this button pointer-accessible only.
          onPointerDown={event => event.preventDefault()}
        >
          <InternalIcon name={ICON_LOGICAL_PROPERTY_MAP[direction]} size="small" />
        </span>
      )}
    </Transition>
  );
}
