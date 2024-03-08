// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { InternalPosition, PopoverProps } from './interfaces';
import styles from './styles.css.js';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import usePopoverPosition from './use-popover-position.js';

export interface PopoverContainerProps {
  /** References the element the container is positioned against. */
  trackRef: React.RefObject<Element>;
  /**
    Used to update the container position in case track or track position changes:
    
    const trackRef = useRef<Element>(null)
    return (<>
      <Track style={getPosition(selectedItemId)} ref={trackRef} />
      <PopoverContainer trackRef={trackRef} trackKey={selectedItemId} .../>
    </>)
  */
  trackKey?: string | number;
  position: PopoverProps.Position;
  zIndex?: React.CSSProperties['zIndex'];
  arrow: (position: InternalPosition | null) => React.ReactNode;
  children: React.ReactNode;
  renderWithPortal?: boolean;
  size: PopoverProps.Size;
  fixedWidth: boolean;
  variant?: 'annotation';
  // When keepPosition is true, the popover will not recalculate its position when it resizes nor when it receives clicks.
  keepPosition?: boolean;
  // When allowScrollToFit is true, we will scroll to the the popover if it overflows the viewport even when choosing the best possible position for it.
  // Do not use this if the popover is open on hover, in order to avoid unexpected movement.
  allowScrollToFit?: boolean;
  allowVerticalOverflow?: boolean;
}

export default function PopoverContainer({
  position,
  trackRef,
  trackKey,
  arrow,
  children,
  zIndex,
  renderWithPortal,
  size,
  fixedWidth,
  variant,
  keepPosition,
  allowScrollToFit,
  allowVerticalOverflow,
}: PopoverContainerProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  const isRefresh = useVisualRefresh();

  // Updates the position handler.
  const { updatePositionHandler, popoverStyle, internalPosition, positionHandlerRef } = usePopoverPosition({
    popoverRef,
    bodyRef,
    arrowRef,
    trackRef,
    contentRef,
    allowScrollToFit,
    allowVerticalOverflow,
    preferredPosition: position,
    renderWithPortal,
    keepPosition,
  });

  // Recalculate position when properties change.
  useLayoutEffect(() => {
    updatePositionHandler();
  }, [updatePositionHandler, trackKey]);

  // Recalculate position when content size changes.
  useResizeObserver(contentRef, () => {
    updatePositionHandler(true);
  });

  // Recalculate position on DOM events.
  useLayoutEffect(() => {
    /*
    This is a heuristic. Some layout changes are caused by user clicks (e.g. toggling the tools panel, submitting a form),
    and by tracking the click event we can adapt the popover's position to the new layout.

    TODO: extend this to Enter and Spacebar?
    */

    const onClick = (event: UIEvent | KeyboardEvent) => {
      if (
        // Do not update position if keepPosition is true.
        keepPosition ||
        // If the click was on the trigger, this will make the popover appear or disappear,
        // so no need to update its position either in this case.
        nodeContains(trackRef.current, event.target)
      ) {
        return;
      }

      requestAnimationFrame(() => {
        updatePositionHandler();
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (keepPosition) {
        return;
      }

      if (
        event.key === 'ArrowRight' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown'
      ) {
        requestAnimationFrame(() => {
          updatePositionHandler();
        });
      }
    };

    const updatePositionOnResizeOrDrag = () => requestAnimationFrame(() => updatePositionHandler());
    const refreshPosition = () => requestAnimationFrame(() => positionHandlerRef.current());

    window.addEventListener('click', onClick);
    window.addEventListener('resize', updatePositionOnResizeOrDrag);
    window.addEventListener('scroll', refreshPosition, true);
    window.addEventListener('pointermove', updatePositionOnResizeOrDrag);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', updatePositionOnResizeOrDrag);
      window.removeEventListener('scroll', refreshPosition, true);
      window.removeEventListener('pointermove', updatePositionOnResizeOrDrag);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [keepPosition, positionHandlerRef, trackRef, updatePositionHandler]);

  return (
    <div
      ref={popoverRef}
      style={{ ...popoverStyle, zIndex }}
      className={clsx(styles.container, isRefresh && styles.refresh)}
    >
      <div
        ref={arrowRef}
        className={clsx(styles[`container-arrow`], styles[`container-arrow-position-${internalPosition}`])}
        aria-hidden={true}
      >
        {arrow(internalPosition)}
      </div>

      <div
        ref={bodyRef}
        className={clsx(styles['container-body'], styles[`container-body-size-${size}`], {
          [styles['fixed-width']]: fixedWidth,
          [styles[`container-body-variant-${variant}`]]: variant,
        })}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
