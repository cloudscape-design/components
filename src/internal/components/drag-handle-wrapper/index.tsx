// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';

import { getFirstFocusable } from '../focus-lock/utils';
import Tooltip from '../tooltip';
import DirectionButton from './direction-button';
import { Direction, DragHandleWrapperProps } from './interfaces';
import PortalOverlay from './portal-overlay';

import styles from './styles.css.js';

// The amount of distance after pointer down that the cursor is allowed to
// jitter for a subsequent mouseup to still register as a "press" instead of
// a drag. A little allowance is needed for usability reasons, but this number
// isn't set in stone.
const PRESS_DELTA_MAX = 3;

export default function DragHandleWrapper({
  directions,
  tooltipText,
  children,
  onDirectionClick,
}: DragHandleWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // The tooltip ("Drag or select to move/resize") shouldn't show if clicking
  // on the handle wouldn't do anything. And the directional buttons shouldn't
  // show if all of them are going to be disabled (which implies the drag
  // control should be visually/semantically disabled as well).
  const isDisabled =
    !directions['block-start'] && !directions['block-end'] && !directions['inline-start'] && !directions['inline-end'];

  const onWrapperFocusIn: React.FocusEventHandler = event => {
    // The drag handle is focused when it's either tabbed to, or the pointer
    // is pressed on it. We exclude handling the pointer press in this handler,
    // since it could be the start of a drag event - the pointer stuff is
    // handled in the "pointerup" listener instead.
    if (!isPointerDown.current && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowTooltip(false);
      setShowButtons(true);
    }
  };

  const onWrapperFocusOut: React.FocusEventHandler = event => {
    // Close the directional buttons when the focus leaves the drag handle.
    // "focusout" is also triggered when the user leaves the current tab, but
    // since it'll be returned when they switch back anyway, we exclude that
    // case by checking for `document.hasFocus()`.
    if (document.hasFocus() && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowButtons(false);
    }
  };

  const isPointerDown = useRef(false);
  const initialPointerPosition = useRef<{ x: number; y: number } | undefined>();
  const didPointerDrag = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    // See `PRESS_DELTA_MAX` above. We need to differentiate between a "click"
    // and a "drag" action. We can say a "click" happens when a "pointerdown"
    // is followed by a "pointerup" with no "pointermove" between the two.
    // However, it would be a poor usability experience if a "click" isn't
    // registered because, while pressing my mouse, I moved it by just one
    // pixel, making it a "drag" instead. So we allow the pointer to move by
    // `PRESS_DELTA_MAX` pixels before setting `didPointerDrag` to true.
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

    // Shared behavior when a "pointerdown" state ends. This is shared so it
    // can be called for both "pointercancel" and "pointerup" events.
    const resetPointerDownState = () => {
      isPointerDown.current = false;
      initialPointerPosition.current = undefined;
    };

    document.addEventListener(
      'pointercancel',
      () => {
        resetPointerDownState();
      },
      { signal: controller.signal }
    );

    document.addEventListener(
      'pointerup',
      () => {
        if (isPointerDown.current && !didPointerDrag.current) {
          // The cursor didn't move much between "pointerdown" and "pointerup".
          // Handle this as a "click" instead of a "drag".
          setShowButtons(true);
        }
        resetPointerDownState();
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, []);

  const onHandlePointerDown: React.PointerEventHandler = event => {
    // Tooltip behavior: the tooltip should appear on hover, but disappear when
    // the pointer starts dragging (having the tooltip get in the way while
    // you're trying to drag upwards is annoying). Additionally, the tooltip
    // shouldn't reappear when dragging ends, but only when the pointer leaves
    // the drag handle and comes back.

    isPointerDown.current = true;
    didPointerDrag.current = false;
    initialPointerPosition.current = { x: event.clientX, y: event.clientY };
    setShowTooltip(false);
  };

  // Tooltip behavior: the tooltip should stay open when the cursor moves
  // from the drag handle into the tooltip content itself. This is why the
  // handler is set on the wrapper for both the drag handle and the tooltip.
  const onTooltipGroupPointerEnter: React.PointerEventHandler = () => {
    if (!isPointerDown.current) {
      setShowTooltip(true);
    }
  };
  const onTooltipGroupPointerLeave: React.PointerEventHandler = () => {
    setShowTooltip(false);
  };

  const onDragHandleKeyDown: React.KeyboardEventHandler = event => {
    // For accessibility reasons, pressing escape should should always close
    // the floating controls.
    if (event.key === 'Escape') {
      setShowButtons(false);
    } else {
      // Pressing any other key will display the focus-visible ring around the
      // drag handle if it's in focus, so we should also show the buttons now.
      setShowButtons(true);
    }
  };

  const onInternalDirectionClick = (direction: Direction) => {
    // Move focus back to the wrapper on click. This prevents focus from staying
    // on an aria-hidden control, and allows future keyboard events to be handled
    // cleanly using the drag handle's own handlers.
    if (dragHandleRef.current) {
      getFirstFocusable(dragHandleRef.current)?.focus();
    }
    onDirectionClick?.(direction);
  };

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
          onKeyDown={onDragHandleKeyDown}
        >
          {children}
        </div>

        {!isDisabled && !showButtons && showTooltip && tooltipText && (
          <Tooltip trackRef={dragHandleRef} value={tooltipText} onDismiss={() => setShowTooltip(false)} />
        )}
      </div>

      <PortalOverlay track={dragHandleRef.current}>
        {directions['block-start'] && (
          <DirectionButton
            show={!isDisabled && showButtons}
            direction="block-start"
            state={directions['block-start']}
            onClick={() => onInternalDirectionClick('block-start')}
          />
        )}
        {directions['block-end'] && (
          <DirectionButton
            show={!isDisabled && showButtons}
            direction="block-end"
            state={directions['block-end']}
            onClick={() => onInternalDirectionClick('block-end')}
          />
        )}
        {directions['inline-start'] && (
          <DirectionButton
            show={!isDisabled && showButtons}
            direction="inline-start"
            state={directions['inline-start']}
            onClick={() => onInternalDirectionClick('inline-start')}
          />
        )}
        {directions['inline-end'] && (
          <DirectionButton
            show={!isDisabled && showButtons}
            direction="inline-end"
            state={directions['inline-end']}
            onClick={() => onInternalDirectionClick('inline-end')}
          />
        )}
      </PortalOverlay>
    </div>
  );
}
