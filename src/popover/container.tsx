// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { getLogicalBoundingClientRect, useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { InternalPosition, PopoverProps } from './interfaces';
import usePopoverPosition from './use-popover-position.js';
import usePositionObserver from './use-position-observer';

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
  minVisibleBlockSize?: number;
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
  hoverArea?: boolean;
  className?: string;
}

export default function PopoverContainer({
  position,
  trackRef,
  getTrack: externalGetTrack,
  trackKey,
  minVisibleBlockSize,
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
  hoverArea,
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
      minVisibleBlockSize,
    });

  // Recalculate position when content size changes.
  useResizeObserver(contentRef, () => {
    updatePositionHandler(true);
  });

  // Recalculate position when the DOM changes.
  // istanbul ignore next - tested via integration tests
  usePositionObserver(trackRef, trackKey, () => {
    // Do not update position if popover moved offscreen
    const popoverOffset = popoverRef.current && getLogicalBoundingClientRect(popoverRef.current);

    if (
      keepPosition ||
      !popoverOffset ||
      popoverOffset.insetBlockStart < 0 ||
      popoverOffset.insetBlockEnd > window.innerHeight
    ) {
      return;
    }

    updatePositionHandler();
  });

  // Recalculate position on resize or scroll events.
  useLayoutEffect(() => {
    const controller = new AbortController();

    const updatePositionOnResize = () => requestAnimationFrame(() => updatePositionHandler(true));
    const refreshPosition = () => requestAnimationFrame(() => positionHandlerRef.current());

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
        {hoverArea ? (
          <div className={styles['hover-area']}>
            <div ref={contentRef}>{children}</div>
          </div>
        ) : (
          <div ref={contentRef}>{children}</div>
        )}
      </div>
    </div>
  );
}
