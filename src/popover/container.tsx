// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { CSSProperties, useCallback, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { getContainingBlock } from '../internal/utils/dom';
import { BoundingOffset, InternalPosition, Offset, PopoverProps } from './interfaces';
import { calculatePosition, getOffsetDimensions } from './utils/positions';
import styles from './styles.css.js';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

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
  keepPositionWhenInteracting?: boolean;
}

const INITIAL_STYLES: CSSProperties = { top: -9999, left: -9999 };

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
  keepPositionWhenInteracting,
}: PopoverContainerProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const internalPositionRef = useRef<InternalPosition | null>(null);

  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>(INITIAL_STYLES);
  const isRefresh = useVisualRefresh();

  // Store the handler in a ref so that it can still be replaced from outside of the listener closure.
  const positionHandlerRef = useRef<() => void>(() => {});

  // Remember when the popover body was clicked in case that this click
  // triggers a resize, which will trigger updatePositionHandler via resize observer,
  // to prevent the popover from moving around while interacting with its content.
  const clickedInsideBody = useRef(false);

  const resizingAfterInternalClick = useRef(false);

  // Updates the position handler.
  const updatePositionHandler = useCallback(
    (onResize = false) => {
      if (!trackRef.current || !popoverRef.current || !bodyRef.current || !contentRef.current || !arrowRef.current) {
        return;
      }

      // Get important elements
      const popover = popoverRef.current;
      const body = bodyRef.current;
      const arrow = arrowRef.current;
      const document = popover.ownerDocument;
      const track = trackRef.current;

      // If the popover body isn't being rendered for whatever reason (e.g. "display: none" or JSDOM),
      // or track does not belong to the document - bail on calculating dimensions.
      const { offsetWidth, offsetHeight } = getOffsetDimensions(popover);
      if (offsetWidth === 0 || offsetHeight === 0 || !nodeContains(document.body, track)) {
        return;
      }

      // Imperatively move body off-screen to give it room to expand.
      // Not doing this in React because this recalculation should happen
      // in the span of a single frame without rerendering anything.
      const prevTop = popover.style.top;
      const prevLeft = popover.style.left;

      popover.style.top = '0';
      popover.style.left = '0';
      // Imperatively remove body styles that can remain from the previous computation.
      body.style.maxHeight = '';
      body.style.overflowX = '';
      body.style.overflowY = '';

      // Get rects representing key elements
      // Use getComputedStyle for arrowRect to avoid modifications made by transform
      const viewportRect = getViewportRect(document.defaultView!);
      const trackRect = track.getBoundingClientRect();
      const arrowRect = {
        width: parseFloat(getComputedStyle(arrow).width),
        height: parseFloat(getComputedStyle(arrow).height),
      };
      const containingBlock = getContainingBlock(popover);
      const containingBlockRect = containingBlock ? containingBlock.getBoundingClientRect() : viewportRect;

      const bodyBorderWidth = getBorderWidth(body);
      const contentRect = contentRef.current.getBoundingClientRect();
      const contentBoundingBox = {
        width: contentRect.width + 2 * bodyBorderWidth,
        height: contentRect.height + 2 * bodyBorderWidth,
      };

      const fixedInternalPosition =
        keepPositionWhenInteracting &&
        onResize &&
        (clickedInsideBody.current || resizingAfterInternalClick.current) &&
        internalPositionRef.current
          ? internalPositionRef.current
          : undefined;

      // Calculate the arrow direction and viewport-relative position of the popover.
      const {
        scrollable,
        internalPosition: newInternalPosition,
        boundingOffset,
      } = calculatePosition({
        preferredPosition: position,
        fixedIternalPosition: fixedInternalPosition,
        trigger: trackRect,
        arrow: arrowRect,
        body: contentBoundingBox,
        container: containingBlock ? containingBlockRect : getDocumentRect(document),
        viewport: viewportRect,
        renderWithPortal,
      });

      // Get the position of the popover relative to the offset parent.
      const popoverOffset = toRelativePosition(boundingOffset, containingBlockRect);

      // Cache the distance between the trigger and the popover (which stays the same as you scroll),
      // and use that to recalculate the new popover position.
      const trackRelativeOffset = toRelativePosition(popoverOffset, toRelativePosition(trackRect, containingBlockRect));

      // Bring back the container to its original position to prevent any flashing.
      popover.style.top = prevTop;
      popover.style.left = prevLeft;

      // Allow popover body to scroll if can't fit the popover into the container/viewport otherwise.
      if (scrollable) {
        body.style.maxHeight = Math.min(boundingOffset.height, window.innerHeight - parseInt(prevTop)) + 'px';
        body.style.overflowX = 'hidden';
        body.style.overflowY = 'auto';
      }

      // Position the popover
      internalPositionRef.current = newInternalPosition;
      setPopoverStyle({ top: popoverOffset.top, left: popoverOffset.left });

      resizingAfterInternalClick.current =
        !!fixedInternalPosition && contentRect.height !== contentRef.current.getBoundingClientRect().height;

      positionHandlerRef.current = () => {
        const newTrackOffset = toRelativePosition(
          track.getBoundingClientRect(),
          containingBlock ? containingBlock.getBoundingClientRect() : viewportRect
        );
        setPopoverStyle({
          top: newTrackOffset.top + trackRelativeOffset.top,
          left: newTrackOffset.left + trackRelativeOffset.left,
        });
      };
    },
    [trackRef, keepPositionWhenInteracting, position, renderWithPortal]
  );

  // Recalculate position when properties change.
  useLayoutEffect(() => {
    updatePositionHandler();
  }, [updatePositionHandler, trackKey]);

  // Recalculate position when content size changes.
  useResizeObserver(contentRef, () => {
    updatePositionHandler(true);
  });

  const onClick = useCallback(
    (event: UIEvent | React.KeyboardEvent) => {
      // Prevent updating the position when clicks come from the trigger or the popover body itself.
      // These clicks will not change the container layout but the popover layout itself, and we want
      // to prevent the popover from moving around while interacting with its content.
      const clickedOnTarget = event.target instanceof Node && nodeContains(event.target, trackRef.current);
      // Remember that the last click came from inside the popover body in case that this click
      // triggers a resize, which will trigger updatePositionHandler via resize observer.
      clickedInsideBody.current = !bodyRef.current || nodeContains(bodyRef.current, event.target);

      requestAnimationFrame(() => {
        if (!clickedOnTarget && !clickedInsideBody.current) {
          updatePositionHandler();
        }
        clickedInsideBody.current = false;
      });
    },
    [trackRef, updatePositionHandler]
  );

  const onKeyUp = (event: React.KeyboardEvent) => {
    if ([' ', 'Enter'].includes(event.key)) {
      onClick(event);
    }
  };

  // Recalculate position on DOM events.
  useLayoutEffect(() => {
    /*
    This is a heuristic. Some layout changes are caused by user clicks (e.g. toggling the tools panel, submitting a form),
    and by tracking the click event we can adapt the popover's position to the new layout.
    
    TODO: extend this to Enter and Spacebar?
    */

    const updatePositionOnResize = () => requestAnimationFrame(() => updatePositionHandler());
    const refreshPosition = () => requestAnimationFrame(() => positionHandlerRef.current());

    window.addEventListener('click', onClick);

    window.addEventListener('resize', updatePositionOnResize);
    window.addEventListener('scroll', refreshPosition, true);

    // Update the position on the first render, right before painting
    updatePositionHandler();

    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', updatePositionOnResize);
      window.removeEventListener('scroll', refreshPosition, true);
    };
  }, [trackRef, updatePositionHandler, onClick]);

  return (
    <div
      ref={popoverRef}
      style={{ ...popoverStyle, zIndex }}
      className={clsx(styles.container, isRefresh && styles.refresh)}
    >
      <div
        ref={arrowRef}
        className={clsx(styles[`container-arrow`], styles[`container-arrow-position-${internalPositionRef.current}`])}
        aria-hidden={true}
      >
        {arrow(internalPositionRef.current)}
      </div>

      <div
        ref={bodyRef}
        onKeyUp={onKeyUp}
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

function getBorderWidth(element: HTMLElement) {
  return parseInt(getComputedStyle(element).borderWidth) || 0;
}

/**
 * Convert a viewport-relative offset to an element-relative offset.
 */
function toRelativePosition(element: Offset, parent: Offset): Offset {
  return {
    top: element.top - parent.top,
    left: element.left - parent.left,
  };
}

/**
 * Get a BoundingOffset that represents the visible viewport.
 */
function getViewportRect(window: Window): BoundingOffset {
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getDocumentRect(document: Document): BoundingOffset {
  const { top, left } = document.documentElement.getBoundingClientRect();
  return {
    top,
    left,
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  };
}
