// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { InternalPosition, PopoverProps } from './interfaces';
import usePopoverPosition from './use-popover-position.js';

import styles from './styles.css.js';

interface PopoverContainerProps {
  /** References the element the container is positioned against. */
  trackRef?: React.RefObject<HTMLElement | SVGElement>;
  getTrack?: () => null | HTMLElement | SVGElement;
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
  size: PopoverProps.Size | 'content';
  fixedWidth: boolean;
  variant?: 'annotation';
  // When keepPosition is true, the popover will not recalculate its position when it resizes nor when it receives clicks.
  keepPosition?: boolean;
  // When allowScrollToFit is true, we will scroll to the the popover if it overflows the viewport even when choosing the best possible position for it.
  // Do not use this if the popover is open on hover, in order to avoid unexpected movement.
  allowScrollToFit?: boolean;
  allowVerticalOverflow?: boolean;
  // Whether the popover should be hidden when the trigger is scrolled away.
  hideOnOverscroll?: boolean;
  className?: string;
}

export default function PopoverContainer({
  position,
  trackRef,
  getTrack: externalGetTrack,
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
  hideOnOverscroll,
  className,
}: PopoverContainerProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  const isRefresh = useVisualRefresh();

  const getTrack = useRef(() => {
    if (trackRef) {
      return trackRef.current;
    }
    if (externalGetTrack) {
      return externalGetTrack();
    }
    throw new Error('Invariant violation: must provide either trackRef or getTrack.');
  });

  // Updates the position handler.
  const { updatePositionHandler, popoverStyle, internalPosition, positionHandlerRef, isOverscrolling } =
    usePopoverPosition({
      popoverRef,
      bodyRef,
      arrowRef,
      getTrack: getTrack.current,
      contentRef,
      allowScrollToFit,
      allowVerticalOverflow,
      preferredPosition: position,
      renderWithPortal,
      keepPosition,
      hideOnOverscroll,
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
        nodeContains(getTrack.current(), event.target)
      ) {
        return;
      }

      requestAnimationFrame(() => {
        updatePositionHandler();
      });
    };

    const updatePositionOnResize = () => requestAnimationFrame(() => updatePositionHandler());
    const refreshPosition = () => requestAnimationFrame(() => positionHandlerRef.current());
    const controller = new AbortController();

    window.addEventListener('click', onClick, { signal: controller.signal });
    window.addEventListener('resize', updatePositionOnResize, { signal: controller.signal });
    window.addEventListener('scroll', refreshPosition, { capture: true, signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [hideOnOverscroll, keepPosition, positionHandlerRef, trackRef, updatePositionHandler]);

  return isOverscrolling ? null : (
    <div
      ref={popoverRef}
      style={{ ...popoverStyle, zIndex }}
      className={clsx(styles.container, isRefresh && styles.refresh, className)}
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
