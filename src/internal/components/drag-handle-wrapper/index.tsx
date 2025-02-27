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

// The amount of distance after pointer down that the cursor is allowed to
// jitter for a subsequent mouseup to still register as a "press" instead of
// a drag. A little allowance is needed, but the number isn't set in stone.
const PRESS_DELTA_MAX = 3;

// Mapping from CSS logical property direction to icon name. The icon component
// already flips the left/right icons automatically based on RTL, so we don't
// need to do anything special.
const ICON_LOGICAL_PROPERTY_MAP: Record<Direction, IconProps.Name> = {
  'block-start': 'arrow-up',
  'block-end': 'arrow-down',
  'inline-start': 'arrow-left',
  'inline-end': 'arrow-right',
};

type Direction = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
type DirectionState = 'active' | 'disabled';

interface DragHandleWrapperProps {
  directions: Partial<Record<Direction, DirectionState>>;
  buttonLabels: Partial<Record<Direction, string>>;
  resizeTooltipText?: string;
  onPress: (direction: Direction) => void;
  children: React.ReactNode;
}

export default function DragHandleWrapper({
  directions,
  buttonLabels,
  resizeTooltipText,
  children,
  onPress,
}: DragHandleWrapperProps) {
  // FIXME: Buttons close when disabled button is clicked because of focusout handler
  //   Move focus from buttons back to main handle? This would mess with SR navigation if those buttons aren't inert

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rtl = getIsRtl(wrapperRef.current);

  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const onWrapperFocusIn = (event: React.FocusEvent) => {
    if (!isPointerDown.current && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowTooltip(false);
      setShowButtons(true);
    }
  };

  const onWrapperFocusOut = (event: React.FocusEvent) => {
    if (document.hasFocus() && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowButtons(false);
    }
  };

  const isPointerDown = useRef(false);
  const initialPointerPosition = useRef<{ x: number; y: number } | undefined>();
  const didPointerDrag = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      'pointermove',
      event => {
        if (
          isPointerDown.current &&
          initialPointerPosition.current &&
          (event.clientX > initialPointerPosition.current.x + PRESS_DELTA_MAX ||
            event.clientX < initialPointerPosition.current.x - PRESS_DELTA_MAX ||
            event.clientY > initialPointerPosition.current.y + PRESS_DELTA_MAX ||
            event.clientY < initialPointerPosition.current.y - PRESS_DELTA_MAX)
        ) {
          didPointerDrag.current = true;
        }
      },
      { signal: controller.signal }
    );

    document.addEventListener(
      'pointercancel',
      () => {
        isPointerDown.current = false;
        initialPointerPosition.current = undefined;
      },
      { signal: controller.signal }
    );

    document.addEventListener(
      'pointerup',
      () => {
        if (isPointerDown.current && !didPointerDrag.current) {
          setShowButtons(true);
        }
        isPointerDown.current = false;
        initialPointerPosition.current = undefined;
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, []);

  const onHandlePointerDown = (event: React.MouseEvent) => {
    isPointerDown.current = true;
    didPointerDrag.current = false;
    initialPointerPosition.current = { x: event.clientX, y: event.clientY };
    setShowTooltip(false);
  };

  const onTooltipGroupPointerEnter = () => {
    if (!isPointerDown.current) {
      setShowTooltip(true);
    }
  };

  const onTooltipGroupPointerLeave = () => {
    setShowTooltip(false);
  };

  const onHandleKeyDown = (event: React.KeyboardEvent) => {
    // Handles case when arrow keys are pressed after mouse resizing, and the
    // "usage mode" switches from mouse to keyboard while the handle is in focus.
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      setShowButtons(true);
    }

    // For accessibility reasons, pressing escape should should close the controls
    // even when the buttons are in focus.
    if (event.key === 'Escape') {
      setShowButtons(false);
    }
  };

  const dragButtonProps = { rtl, directions, buttonLabels, onPress, show: showButtons };

  return (
    <div
      className={clsx(styles['drag-handle-wrapper'], showButtons && styles['drag-handle-wrapper-open'])}
      ref={wrapperRef}
      onFocus={onWrapperFocusIn}
      onBlur={onWrapperFocusOut}
    >
      <div onPointerEnter={onTooltipGroupPointerEnter} onPointerLeave={onTooltipGroupPointerLeave}>
        <div
          className={styles['drag-handle']}
          ref={dragHandleRef}
          onPointerDown={onHandlePointerDown}
          onKeyDown={onHandleKeyDown}
        >
          {children}
        </div>

        {!showButtons && showTooltip && resizeTooltipText && (
          <Tooltip trackRef={dragHandleRef} value={resizeTooltipText} onDismiss={() => setShowTooltip(false)} />
        )}
      </div>

      <DragButton {...dragButtonProps} direction="block-start" />
      <DragButton {...dragButtonProps} direction="block-end" />
      <DragButton {...dragButtonProps} direction="inline-start" />
      <DragButton {...dragButtonProps} direction="inline-end" />
    </div>
  );
}

interface DragButtonProps {
  directions: DragHandleWrapperProps['directions'];
  buttonLabels: DragHandleWrapperProps['buttonLabels'];
  onPress: DragHandleWrapperProps['onPress'];
  direction: Direction;
  show: boolean;
  rtl: boolean;
}

function DragButton({ directions, buttonLabels, direction, show, rtl, onPress }: DragButtonProps) {
  // TODO: focus state? even if not keyboard accessible through tab, it's still keyboard activateable after mouse click

  const state = directions[direction];
  if (!state) {
    return null;
  }

  return (
    <Transition in={show}>
      {(transitionState, ref) => (
        <button
          type="button"
          ref={ref}
          tabIndex={-1}
          className={clsx(
            styles['drag-button'],
            styles[`drag-button-${direction}`],
            rtl && styles[`drag-button-rtl`],
            state === 'disabled' && styles['drag-button-disabled'],
            transitionState === 'exited' && styles['drag-button-hidden'],
            styles[`drag-button-motion-${transitionState}`]
          )}
          aria-disabled={state === 'disabled'}
          aria-label={buttonLabels[direction]}
          onClick={() => onPress(direction)}
        >
          <InternalIcon name={ICON_LOGICAL_PROPERTY_MAP[direction]} size="small" />
        </button>
      )}
    </Transition>
  );
}
