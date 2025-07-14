// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef, useState } from 'react';

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { getFirstFocusable } from '@cloudscape-design/component-toolkit/internal';

import { DragHandleWrapperProps } from '../components/wrapper';
import { DragHandleProps } from '../interfaces';

interface UseDefaultDragBehaviorProps {
  directions: Partial<Record<DragHandleProps.Direction, DragHandleProps.DirectionState>>;
  triggerMode: DragHandleProps.TriggerMode;
  hideButtonsOnDrag: boolean;
  clickDragThreshold: number;
  initialShowButtons: boolean;
  onDirectionClick?: (direction: DragHandleProps.Direction) => void;
}

interface UseDefaultDragBehaviorResult {
  wrapperProps: Required<
    Pick<
      DragHandleWrapperProps,
      'directions' | 'showButtons' | 'onDirectionClick' | 'showTooltip' | 'onTooltipDismiss' | 'nativeAttributes'
    > & { ref: React.Ref<HTMLDivElement> }
  >;
}

export function useDefaultDragBehavior({
  directions,
  triggerMode,
  hideButtonsOnDrag,
  clickDragThreshold,
  initialShowButtons,
  onDirectionClick,
}: UseDefaultDragBehaviorProps): UseDefaultDragBehaviorResult {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showButtons, setShowButtons] = useState(initialShowButtons);

  const isPointerDown = useRef(false);
  const initialPointerPosition = useRef<{ x: number; y: number } | undefined>();
  const didPointerDrag = useRef(false);

  // The tooltip ("Drag or select to move/resize") shouldn't show if clicking
  // on the handle wouldn't do anything.
  const isImplicitlyDisabled =
    !directions['block-start'] && !directions['block-end'] && !directions['inline-start'] && !directions['inline-end'];

  const onFocus: React.FocusEventHandler = event => {
    // The drag handle is focused when it's either tabbed to, or the pointer
    // is pressed on it. We exclude handling the pointer press in this handler,
    // since it could be the start of a drag event - the pointer stuff is
    // handled in the "pointerup" listener instead. In cases where focus is moved
    // to the button (by manually calling `.focus()`, the buttons should only appear)
    // if the action that triggered the focus move was the result of a keypress.
    if (document.body.dataset.awsuiFocusVisible && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowTooltip(false);
      if (triggerMode === 'focus') {
        setShowButtons(true);
      }
    }
  };

  const onBlur: React.FocusEventHandler = event => {
    // Close the directional buttons when the focus leaves the drag handle.
    // "focusout" is also triggered when the user leaves the current tab, but
    // since it'll be returned when they switch back anyway, we exclude that
    // case by checking for `document.hasFocus()`.
    if (document.hasFocus() && !nodeContains(wrapperRef.current, event.relatedTarget)) {
      setShowButtons(false);
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
            setShowButtons(false);
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
          setShowButtons(true);
        }
        resetPointerDownState();
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, [clickDragThreshold, hideButtonsOnDrag]);

  const onPointerDown: React.PointerEventHandler = event => {
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
  const onPointerEnter: React.PointerEventHandler = () => {
    if (!isPointerDown.current) {
      setShowTooltip(true);
    }
  };

  const onPointerLeave: React.PointerEventHandler = () => {
    setShowTooltip(false);
  };

  const onKeyDown: React.KeyboardEventHandler = event => {
    // For accessibility reasons, pressing escape should always close the floating controls.
    if (event.key === 'Escape') {
      setShowButtons(false);
    } else if (triggerMode === 'keyboard-activate' && (event.key === 'Enter' || event.key === ' ')) {
      // toggle buttons when Enter or space is pressed in 'keyboard-activate' triggerMode
      setShowButtons(prevshowButtons => !prevshowButtons);
    } else if (
      event.key !== 'Alt' &&
      event.key !== 'Control' &&
      event.key !== 'Meta' &&
      event.key !== 'Shift' &&
      triggerMode !== 'keyboard-activate'
    ) {
      // Pressing any other key will display the focus-visible ring around the
      // drag handle if it's in focus, so we should also show the buttons now.
      setShowButtons(true);
    }
  };

  const onInternalDirectionClick = (direction: DragHandleProps.Direction) => {
    // Move focus back to the wrapper on click. This prevents focus from staying
    // on an aria-hidden control, and allows future keyboard events to be handled
    // cleanly using the drag handle's own handlers.
    if (wrapperRef.current) {
      getFirstFocusable(wrapperRef.current)?.focus();
    }
    onDirectionClick?.(direction);
  };

  return {
    wrapperProps: {
      ref: wrapperRef,
      directions,
      showButtons: !isImplicitlyDisabled && showButtons,
      showTooltip: !isImplicitlyDisabled && !showButtons && showTooltip,
      onDirectionClick: onInternalDirectionClick,
      onTooltipDismiss: () => setShowTooltip(false),
      nativeAttributes: { onFocus, onBlur, onKeyDown, onPointerDown, onPointerEnter, onPointerLeave },
    },
  };
}
