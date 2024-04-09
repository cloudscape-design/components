// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useRef, useState } from 'react';
import { BoundingBox, InternalPosition, Offset, PopoverProps } from './interfaces';
import { calculatePosition, getDimensions, getOffsetDimensions } from './utils/positions';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import {
  calculateScroll,
  getFirstScrollableParent,
  scrollRectangleIntoView,
} from '../internal/utils/scrollable-containers';
import { getContainingBlock } from '../internal/utils/dom';
import { getLogicalBoundingClientRect } from '../internal/direction';

export default function usePopoverPosition({
  popoverRef,
  bodyRef,
  arrowRef,
  trackRef,
  contentRef,
  allowScrollToFit,
  allowVerticalOverflow,
  preferredPosition,
  renderWithPortal,
  keepPosition,
}: {
  popoverRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  arrowRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLElement | SVGElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  allowScrollToFit?: boolean;
  allowVerticalOverflow?: boolean;
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
      const prevInsetBlockStart = popover.style.insetBlockStart;
      const prevInsetInlineStart = popover.style.insetInlineStart;

      popover.style.insetBlockStart = '0';
      popover.style.insetInlineStart = '0';
      // Imperatively remove body styles that can remain from the previous computation.
      body.style.maxBlockSize = '';
      body.style.overflowX = '';
      body.style.overflowY = '';

      // Get rects representing key elements
      // Use getComputedStyle for arrowRect to avoid modifications made by transform
      const viewportRect = getViewportRect(document.defaultView!);
      const trackRect = getLogicalBoundingClientRect(track);
      const arrowRect = getDimensions(arrow);
      const containingBlock = getContainingBlock(popover);
      const containingBlockRect = containingBlock ? getLogicalBoundingClientRect(containingBlock) : viewportRect;

      const bodyBorderWidth = getBorderWidth(body);
      const contentRect = getLogicalBoundingClientRect(contentRef.current);
      const contentBoundingBox = {
        inlineSize: contentRect.inlineSize + 2 * bodyBorderWidth,
        blockSize: contentRect.blockSize + 2 * bodyBorderWidth,
      };

      // When keepPosition is true and the recalculation was triggered by a resize of the popover content,
      // we maintain the previously defined internal position,
      // but we still call calculatePosition to know if the popover should be scrollable.
      const shouldKeepPosition = keepPosition && onContentResize && !!previousInternalPositionRef.current;
      const fixedInternalPosition = (shouldKeepPosition && previousInternalPositionRef.current) ?? undefined;

      // Calculate the arrow direction and viewport-relative position of the popover.
      const {
        scrollable,
        internalPosition: newInternalPosition,
        rect,
      } = calculatePosition({
        preferredPosition,
        fixedInternalPosition,
        trigger: trackRect,
        arrow: arrowRect,
        body: contentBoundingBox,
        container: containingBlock ? containingBlockRect : getDocumentRect(document),
        viewport: viewportRect,
        renderWithPortal,
        allowVerticalOverflow,
      });

      // Get the position of the popover relative to the offset parent.
      const popoverOffset = toRelativePosition(rect, containingBlockRect);

      // Cache the distance between the trigger and the popover (which stays the same as you scroll),
      // and use that to recalculate the new popover position.
      const trackRelativeOffset = toRelativePosition(popoverOffset, toRelativePosition(trackRect, containingBlockRect));

      // Bring back the container to its original position to prevent any flashing.
      popover.style.insetBlockStart = prevInsetBlockStart;
      popover.style.insetInlineStart = prevInsetInlineStart;

      // Allow popover body to scroll if can't fit the popover into the container/viewport otherwise.
      if (scrollable) {
        body.style.maxHeight = rect.blockSize + 'px';
        body.style.overflowX = 'hidden';
        body.style.overflowY = 'auto';
      }

      // Remember the internal position in case we want to keep it later.
      previousInternalPositionRef.current = newInternalPosition;
      setInternalPosition(newInternalPosition);

      const shouldScroll = allowScrollToFit && !shouldKeepPosition;

      // Position the popover
      const insetBlockStart = shouldScroll
        ? popoverOffset.insetBlockStart + calculateScroll(rect)
        : popoverOffset.insetBlockStart;
      setPopoverStyle({ insetBlockStart, insetInlineStart: popoverOffset.insetInlineStart });

      // Scroll if necessary
      if (shouldScroll) {
        const scrollableParent = getFirstScrollableParent(popover);
        scrollRectangleIntoView(rect, scrollableParent);
      }

      positionHandlerRef.current = () => {
        const newTrackOffset = toRelativePosition(
          getLogicalBoundingClientRect(track),
          containingBlock ? getLogicalBoundingClientRect(containingBlock) : viewportRect
        );
        setPopoverStyle({
          insetBlockStart: newTrackOffset.insetBlockStart + trackRelativeOffset.insetBlockStart,
          insetInlineStart: newTrackOffset.insetInlineStart + trackRelativeOffset.insetInlineStart,
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
      allowScrollToFit,
      preferredPosition,
      renderWithPortal,
      allowVerticalOverflow,
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
    insetBlockStart: element.insetBlockStart - parent.insetBlockStart,
    insetInlineStart: element.insetInlineStart - parent.insetInlineStart,
  };
}

/**
 * Get a BoundingBox that represents the visible viewport.
 */
function getViewportRect(window: Window): BoundingBox {
  return {
    insetBlockStart: 0,
    insetInlineStart: 0,
    inlineSize: window.innerWidth,
    blockSize: window.innerHeight,
  };
}

function getDocumentRect(document: Document): BoundingBox {
  const { insetBlockStart, insetInlineStart } = getLogicalBoundingClientRect(document.documentElement);

  return {
    insetBlockStart,
    insetInlineStart,
    inlineSize: document.documentElement.scrollWidth,
    blockSize: document.documentElement.scrollHeight,
  };
}
