// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { CSSProperties, useCallback, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { getContainingBlock, nodeContains } from '../internal/utils/dom';
import { ContainerQueryEntry, useContainerQuery } from '../internal/hooks/container-queries';
import { BoundingOffset, InternalPosition, Offset, PopoverProps } from './interfaces';
import { calculatePosition } from './utils/positions';
import styles from './styles.css.js';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

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
}

const INITIAL_STYLES: CSSProperties = { position: 'absolute', top: -9999, left: -9999 };

export default function PopoverContainer({
  position,
  trackRef,
  trackKey,
  arrow,
  children,
  zIndex,
  renderWithPortal,
}: PopoverContainerProps) {
  const [popoverRect, ref] = useContainerQuery((rect, prev) => {
    const roundedRect = { width: Math.round(rect.width), height: Math.round(rect.height) };
    return prev?.width === roundedRect.width && prev?.height === roundedRect.height ? prev : rect;
  }) as [ContainerQueryEntry | null, React.MutableRefObject<HTMLDivElement | null>];

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  const [inlineStyle, setInlineStyle] = useState<CSSProperties>(INITIAL_STYLES);
  const [internalPosition, setInternalPosition] = useState<InternalPosition | null>(null);
  const isRefresh = useVisualRefresh(ref);

  // Store the handler in a ref so that it can still be replaced from outside of the listener closure.
  const positionHandlerRef = useRef<() => void>(() => {});

  // Updates the position handler.
  const updatePositionHandler = useCallback(() => {
    if (!trackRef.current || !ref.current || !bodyRef.current || !arrowRef.current) {
      return;
    }

    // Get important elements
    const body = bodyRef.current;
    const arrow = arrowRef.current;
    const document = ref.current.ownerDocument;
    const track = trackRef.current;

    // If the popover body isn't being rendered for whatever reason (e.g. "display: none" or JSDOM),
    // or track does not belong to the document - bail on calculating dimensions.
    if (body.offsetWidth === 0 || body.offsetHeight === 0 || !nodeContains(document.body, track)) {
      return;
    }

    // Imperatively move body off-screen to give it room to expand.
    // Not doing this in React because this recalculation should happen
    // in the span of a single frame without rerendering anything.
    const prevTop = body.style.top;
    const prevLeft = body.style.left;
    body.style.top = '0';
    body.style.left = '0';

    // Get rects representing key elements
    // Use getComputedStyle for arrowRect to avoid modifications made by transform
    const viewportRect = getViewportRect(document.defaultView!);
    const trackRect = track.getBoundingClientRect();
    const arrowRect = {
      width: parseFloat(getComputedStyle(arrow).width),
      height: parseFloat(getComputedStyle(arrow).height),
    };
    const containingBlock = getContainingBlock(body);
    const containingBlockRect = containingBlock ? containingBlock.getBoundingClientRect() : viewportRect;

    // Round up dimensions (IE11 doesn't handle subpixels too accurately)
    const bodyRect = body.getBoundingClientRect();
    const bodyRectCeil = {
      top: bodyRect.top,
      left: bodyRect.left,
      width: Math.ceil(bodyRect.width),
      height: Math.ceil(bodyRect.height),
    };

    // Calculate the arrow direction and viewport-relative position of the popover.
    const { internalPosition: newInternalPosition, boundingOffset } = calculatePosition(
      position,
      trackRect,
      arrowRect,
      bodyRectCeil,
      containingBlock ? containingBlockRect : getDocumentRect(document),
      viewportRect,
      renderWithPortal
    );

    // Get the position of the popover relative to the offset parent.
    const popoverOffset = toRelativePosition(boundingOffset, containingBlockRect);

    // Cache the distance between the trigger and the popover (which stays the same as you scroll),
    // and use that to recalculate the new popover position.
    const trackRelativeOffset = toRelativePosition(popoverOffset, toRelativePosition(trackRect, containingBlockRect));

    // Bring back the container to its original position to prevent any
    // flashing.
    body.style.top = prevTop;
    body.style.left = prevLeft;

    // Position the popover
    setInternalPosition(newInternalPosition);
    setInlineStyle({ top: popoverOffset.top, left: popoverOffset.left });

    positionHandlerRef.current = () => {
      const newTrackOffset = toRelativePosition(
        track.getBoundingClientRect(),
        containingBlock ? containingBlock.getBoundingClientRect() : viewportRect
      );
      setInlineStyle({
        top: newTrackOffset.top + trackRelativeOffset.top,
        left: newTrackOffset.left + trackRelativeOffset.left,
      });
    };
  }, [position, trackRef, ref, renderWithPortal]);

  // Update the handler when properties change.
  useLayoutEffect(() => {
    updatePositionHandler();
  }, [updatePositionHandler, trackKey, popoverRect]);

  // Attach document listeners.
  useLayoutEffect(() => {
    /*
      This is a heuristic. Some layout changes are caused by user clicks (e.g. toggling the tools panel, submitting a form),
      and by tracking the click event we can adapt the popover's position to the new layout.

      TODO: extend this to Enter and Spacebar?
    */
    const updatePosition = () => requestAnimationFrame(() => updatePositionHandler());
    const refreshPosition = () => requestAnimationFrame(() => positionHandlerRef.current());

    window.addEventListener('click', updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', refreshPosition, true);
    return () => {
      window.removeEventListener('click', updatePosition);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', refreshPosition, true);
    };
  }, [updatePositionHandler]);

  const mergedRef = useMergeRefs(bodyRef, ref);

  return (
    <div
      ref={mergedRef}
      style={{ ...inlineStyle, zIndex }}
      className={clsx(styles.container, isRefresh && styles.refresh)}
    >
      <div
        ref={arrowRef}
        className={clsx(styles[`container-arrow`], styles[`container-arrow-position-${internalPosition}`])}
        aria-hidden={true}
      >
        {arrow(internalPosition)}
      </div>
      {children}
    </div>
  );
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
