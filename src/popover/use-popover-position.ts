// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef, useState } from 'react';
import { BoundingBox, InternalPosition, Offset, PopoverProps } from './interfaces';
import { calculatePosition, getDimensions, getOffsetDimensions } from './utils/positions';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import { calculateScroll, scrollRectangleIntoView } from '../internal/utils/scrollable-containers';
import { getContainingBlock } from '../internal/utils/dom';

export default function usePopoverPosition({
  popoverRef,
  bodyRef,
  arrowRef,
  trackRef,
  contentRef,
  allowVerticalScroll,
  preferredPosition,
  renderWithPortal,
  keepPosition,
}: {
  popoverRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  arrowRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<Element | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  allowVerticalScroll?: boolean;
  preferredPosition: PopoverProps.Position;
  renderWithPortal?: boolean;
  keepPosition?: boolean;
}) {
  const previousInternalPositionRef = useRef<InternalPosition | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<Partial<Offset>>({});
  const [internalPosition, setInternalPosition] = useState<InternalPosition | null>(null);

  // Store the handler in a ref so that it can still be replaced from outside of the listener closure.
  const positionHandlerRef = useRef<() => void>(() => {});

  const updatePositionHandler = useCallback(
    (onContentResize = false) => {
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
      const arrowRect = getDimensions(arrow);
      const containingBlock = getContainingBlock(popover);
      const containingBlockRect = containingBlock ? containingBlock.getBoundingClientRect() : viewportRect;

      const bodyBorderWidth = getBorderWidth(body);
      const contentRect = contentRef.current.getBoundingClientRect();
      const contentBoundingBox = {
        width: contentRect.width + 2 * bodyBorderWidth,
        height: contentRect.height + 2 * bodyBorderWidth,
      };

      // When keepPosition is true and the recalculation was triggered by a resize of the popover content,
      // we maintain the previously defined internal position,
      // but we still call calculatePosition to know if the popover should be scrollable.
      const shouldKeepPosition = keepPosition && onContentResize && !!previousInternalPositionRef.current;
      const fixedInternalPosition = (shouldKeepPosition && previousInternalPositionRef.current) ?? undefined;

      // On mobile screens, allow the popover to open outside of the viewoprt and scroll to it,
      // if there is no position where it can fit without being cropped.
      const scrollIfNeeded = allowVerticalScroll && !shouldKeepPosition;

      // Calculate the arrow direction and viewport-relative position of the popover.
      const {
        scrollable,
        internalPosition: newInternalPosition,
        boundingBox,
      } = calculatePosition({
        preferredPosition,
        fixedInternalPosition,
        trigger: trackRect,
        arrow: arrowRect,
        body: contentBoundingBox,
        container: containingBlock ? containingBlockRect : getDocumentRect(document),
        viewport: viewportRect,
        renderWithPortal,
        scrollIfNeeded,
      });

      // Get the position of the popover relative to the offset parent.
      const popoverOffset = toRelativePosition(boundingBox, containingBlockRect);

      // Cache the distance between the trigger and the popover (which stays the same as you scroll),
      // and use that to recalculate the new popover position.
      const trackRelativeOffset = toRelativePosition(popoverOffset, toRelativePosition(trackRect, containingBlockRect));

      // Bring back the container to its original position to prevent any flashing.
      popover.style.top = prevTop;
      popover.style.left = prevLeft;

      // Allow popover body to scroll if can't fit the popover into the container/viewport otherwise.
      if (scrollable) {
        body.style.maxHeight = boundingBox.height + 'px';
        body.style.overflowX = 'hidden';
        body.style.overflowY = 'auto';
      }

      // Remember the internal position in case we want to keep it later.
      previousInternalPositionRef.current = newInternalPosition;
      setInternalPosition(newInternalPosition);

      // Position the popover
      const top = scrollIfNeeded ? popoverOffset.top + calculateScroll(boundingBox) : popoverOffset.top;
      setPopoverStyle({ top, left: popoverOffset.left });
      if (scrollIfNeeded) {
        scrollRectangleIntoView(boundingBox);
      }

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
    [
      trackRef,
      popoverRef,
      bodyRef,
      contentRef,
      arrowRef,
      keepPosition,
      allowVerticalScroll,
      preferredPosition,
      renderWithPortal,
    ]
  );
  return { updatePositionHandler, popoverStyle, internalPosition, positionHandlerRef };
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
 * Get a BoundingBox that represents the visible viewport.
 */
function getViewportRect(window: Window): BoundingBox {
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getDocumentRect(document: Document): BoundingBox {
  const { top, left } = document.documentElement.getBoundingClientRect();
  return {
    top,
    left,
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  };
}
