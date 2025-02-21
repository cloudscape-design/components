// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

import { IconProps } from '../../../icon/interfaces';
import InternalIcon from '../../../icon/internal';
import Tooltip from '../tooltip';
import { Transition } from '../transition';

import styles from './styles.css.js';

type Direction = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
type DirectionState = 'visible' | 'hidden' | 'disabled';

interface DragHandleWrapperProps {
  open: boolean;
  directions: Record<Direction, DirectionState>;
  children: React.ReactNode;

  onPress: (direction: Direction) => void;
  onClose: () => void;
}

export default function DragHandleWrapper({ open, directions, children, onPress, onClose }: DragHandleWrapperProps) {
  // TODO: fix up tooltip logic
  // TODO: is onClick good enough? or should the buttons also appear when the mouse is dragged _juust_ a little bit?
  // TODO: provide some functionality for drag implementations to distinguish between button onClick (which includes keyboard activation) on(Mouse)Click?
  // TODO: i18nStrings-ify the labels (tooltip and cardinal buttons)

  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const dragHandleRef = useRef<HTMLSpanElement | null>(null);
  const rtl = getIsRtl(dragHandleRef.current);

  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      'click',
      event => {
        if (!nodeContains(wrapperRef.current, event.target)) {
          onClose();
        }
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, [onClose]);

  const dragButtonProps = { open, rtl, onPress };
  return (
    <span className={clsx(styles['drag-handle-wrapper'], open && styles['drag-handle-wrapper-open'])} ref={wrapperRef}>
      <DragButton direction="block-start" state={directions['block-start']} {...dragButtonProps} />
      <DragButton direction="block-end" state={directions['block-end']} {...dragButtonProps} />
      <DragButton direction="inline-start" state={directions['inline-start']} {...dragButtonProps} />
      <DragButton direction="inline-end" state={directions['inline-end']} {...dragButtonProps} />

      {!open && showTooltip && (
        <Tooltip trackRef={dragHandleRef} value="Drag or select to move" onDismiss={() => setShowTooltip(false)} />
      )}

      <span
        className={styles['drag-handle']}
        ref={dragHandleRef}
        onMouseEnter={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onMouseDown={() => setShowTooltip(false)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </span>
    </span>
  );
}

interface DragButtonProps {
  direction: Direction;
  state: DirectionState;
  open: boolean;
  rtl: boolean;
  onPress: DragHandleWrapperProps['onPress'];
}

const IconNameMap: Record<Direction, IconProps.Name> = {
  'block-start': 'arrow-up',
  'block-end': 'arrow-down',
  'inline-start': 'arrow-left',
  'inline-end': 'arrow-right',
};

function DragButton({ direction, state, open, rtl, onPress }: DragButtonProps) {
  return (
    <Transition in={open}>
      {(transitionState, ref) => (
        <button
          ref={ref}
          tabIndex={-1}
          className={clsx(
            styles['drag-button'],
            styles[`drag-button-${direction}`],
            rtl && styles[`drag-button-rtl`],
            state === 'disabled' && styles['drag-button-disabled'],
            (state === 'hidden' || transitionState === 'exited') && styles['drag-button-hidden'],
            styles[`drag-button-motion-${transitionState}`]
          )}
          disabled={state === 'disabled'}
          aria-label={'Resize (direction) (icon: ' + IconNameMap[direction] + ')'}
          onClick={() => onPress(direction)}
        >
          <InternalIcon name={IconNameMap[direction]} size="small" />
        </button>
      )}
    </Transition>
  );
}
