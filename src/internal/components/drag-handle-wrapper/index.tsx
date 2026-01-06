// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import Tooltip from '../../../tooltip/internal.js';
import DirectionButton from './direction-button';
import { Direction, DragHandleWrapperProps } from './interfaces';
import PortalOverlay from './portal-overlay';

import styles from './styles.css.js';
import testUtilsStyles from './test-classes/styles.css.js';

// The UAP buttons are forced to top/bottom position if the handle is close to the screen edge.
const FORCED_POSITION_PROXIMITY_PX = 50;
// Approximate UAP button size with margins to decide forced direction.
const UAP_BUTTON_SIZE_PX = 40;
const DIRECTIONS_ORDER: Direction[] = ['block-end', 'block-start', 'inline-end', 'inline-start'];

export default function DragHandleWrapper({
  directions,
  tooltipText,
  children,
  onDirectionClick,
  triggerMode = 'focus',
  initialShowButtons = false,
  controlledShowButtons = false,
  wrapperClassName,
  hideButtonsOnDrag,
  clickDragThreshold,
}: DragHandleWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [uncontrolledShowButtons, setUncontrolledShowButtons] = useState(initialShowButtons);

  const isPointerDown = useRef(false);
  const initialPointerPosition = useRef<{ x: number; y: number } | undefined>();
  const didPointerDrag = useRef(false);

  // The tooltip ("Drag or select to move/resize") shouldn't show if clicking
  // on the handle wouldn't do anything.
  const isDisabled =
    !directions['block-start'] && !directions['block-end'] && !directions['inline-start'] && !directions['inline-end'];

  const onWrapperFocusIn: React.FocusEventHandler = event => {
    // The drag handle is focused when it's either tabbed to, or the pointer
    // is pressed on it. We exclude handling the pointer press in this handler,
    // since it could be the start of a drag event - the pointer stuff is
    // handled in the "pointerup" listener instead. In cases where focus is moved
    // to the button (by manually calling `.focus()`), the buttons should only appear
    // if the action that triggered the focus move was the result of a keypress.
    if (document.body.dataset.awsuiFocusVisible && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowTooltip(false);
      if (triggerMode === 'focus') {
        setUncontrolledShowButtons(true);
      }
    }
  };

  const onWrapperFocusOut: React.FocusEventHandler = event => {
    // Close the directional buttons when the focus leaves the drag handle.
    // "focusout" is also triggered when the user switches to another tab, but
    // since it'll be returned when they switch back anyway, we exclude that
    // case by checking for `document.hasFocus()`.
    if (document.hasFocus() && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setUncontrolledShowButtons(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    // We need to differentiate between a "click" and a "drag" action.
    // We can say a "click" happens when a "pointerdown" is followed by
    // a "pointerup" with no "pointermove" between the two.
    // However, it would be a poor usability experience if a "click" isn't
    // registered because, while pressing my mouse, I moved it by just one
    // pixel, making it a "drag" instead. So we allow the pointer to move by
    // `clickDragThreshold` pixels before setting `didPointerDrag` to true.
    document.addEventListener(
      'pointermove',
      event => {
        if (
          isPointerDown.current &&
          initialPointerPosition.current &&
          (event.clientX > initialPointerPosition.current.x + clickDragThreshold ||
            event.clientX < initialPointerPosition.current.x - clickDragThreshold ||
            event.clientY > initialPointerPosition.current.y + clickDragThreshold ||
            event.clientY < initialPointerPosition.current.y - clickDragThreshold)
        ) {
          didPointerDrag.current = true;
          if (hideButtonsOnDrag) {
            setUncontrolledShowButtons(false);
          }
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
          setUncontrolledShowButtons(true);
        }
        resetPointerDownState();
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, [clickDragThreshold, hideButtonsOnDrag]);

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
    // For accessibility reasons, pressing escape should always close the floating controls.
    if (event.key === 'Escape') {
      setUncontrolledShowButtons(false);
    } else if (triggerMode === 'keyboard-activate' && (event.key === 'Enter' || event.key === ' ')) {
      // toggle buttons when Enter or space is pressed in 'keyboard-activate' triggerMode
      setUncontrolledShowButtons(prevShowButtons => !prevShowButtons);
    } else if (
      event.key !== 'Alt' &&
      event.key !== 'Control' &&
      event.key !== 'Meta' &&
      event.key !== 'Shift' &&
      triggerMode === 'focus'
    ) {
      // Pressing any other key will display the focus-visible ring around the
      // drag handle if it's in focus, so we should also show the buttons now.
      setUncontrolledShowButtons(true);
    }
  };

  const showButtons = triggerMode === 'controlled' ? controlledShowButtons : uncontrolledShowButtons;

  const [forcedPosition, setForcedPosition] = useState<null | 'top' | 'bottom'>(null);
  const directionsOrder = forcedPosition === 'bottom' ? [...DIRECTIONS_ORDER].reverse() : DIRECTIONS_ORDER;
  const visibleDirections = directionsOrder.filter(dir => directions[dir]);

  useLayoutEffect(() => {
    if (showButtons && dragHandleRef.current) {
      const rect = getLogicalBoundingClientRect(dragHandleRef.current);
      const conflicts = {
        'block-start': rect.insetBlockStart < FORCED_POSITION_PROXIMITY_PX,
        'block-end': window.innerHeight - rect.insetBlockEnd < FORCED_POSITION_PROXIMITY_PX,
        'inline-start': rect.insetInlineStart < FORCED_POSITION_PROXIMITY_PX,
        'inline-end': window.innerWidth - rect.insetInlineEnd < FORCED_POSITION_PROXIMITY_PX,
      };
      if (visibleDirections.some(direction => conflicts[direction])) {
        const hasEnoughSpaceAbove = rect.insetBlockStart > visibleDirections.length * UAP_BUTTON_SIZE_PX;
        setForcedPosition(hasEnoughSpaceAbove ? 'top' : 'bottom');
      } else {
        setForcedPosition(null);
      }
    }
  }, [showButtons, visibleDirections]);

  return (
    <>
      {/* Wrapper for focus detection. The buttons are shown when any element inside this wrapper is
          focused, either via the keyboard or a pointer press. The UAP buttons will never receive focus. */}
      <div
        className={clsx(testUtilsStyles.root, styles.contents)}
        ref={wrapperRef}
        onFocus={onWrapperFocusIn}
        onBlur={onWrapperFocusOut}
      >
        {/* Wrapper for pointer detection. Determines whether or not the tooltip should be shown. */}
        <div
          className={styles.contents}
          onPointerEnter={onTooltipGroupPointerEnter}
          onPointerLeave={onTooltipGroupPointerLeave}
        >
          {/* Position tracking wrapper used to position the tooltip and drag buttons accurately.
            Its dimensions must match the inner button's dimensions. */}
          <div
            className={clsx(styles['drag-handle'], wrapperClassName)}
            ref={dragHandleRef}
            onPointerDown={onHandlePointerDown}
            onKeyDown={onDragHandleKeyDown}
          >
            {children}
          </div>

          {!isDisabled && !showButtons && showTooltip && tooltipText && (
            // Rendered in a portal but pointerenter/pointerleave events still propagate
            // up the React DOM tree, which is why it's placed in this nested context.
            <Tooltip
              getTrack={() => dragHandleRef.current}
              content={tooltipText}
              onEscape={() => setShowTooltip(false)}
            />
          )}
        </div>
      </div>

      <PortalOverlay track={dragHandleRef} isDisabled={!showButtons}>
        {visibleDirections.map(
          (direction, index) =>
            directions[direction] && (
              <DirectionButton
                key={direction}
                show={!isDisabled && showButtons}
                direction={direction}
                state={directions[direction]}
                onClick={() => onDirectionClick?.(direction)}
                forcedPosition={forcedPosition}
                forcedIndex={index}
              />
            )
        )}
      </PortalOverlay>
    </>
  );
}
