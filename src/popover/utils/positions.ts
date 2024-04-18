// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PopoverProps, InternalPosition, BoundingBox, Dimensions } from '../interfaces';

// A structure describing how the popover should be positioned
interface CalculatedPosition {
  scrollable?: boolean;
  internalPosition: InternalPosition;
  rect: BoundingBox;
}

interface ElementGroup {
  body: Dimensions;
  trigger: BoundingBox;
  arrow: Dimensions;
}

const ARROW_OFFSET = 12;

export const PRIORITY_MAPPING: Record<PopoverProps.Position, InternalPosition[]> = {
  top: [
    'top-center',
    'top-right',
    'top-left',
    'bottom-center',
    'bottom-right',
    'bottom-left',
    'right-top',
    'right-bottom',
    'left-top',
    'left-bottom',
  ],
  bottom: [
    'bottom-center',
    'bottom-right',
    'bottom-left',
    'top-center',
    'top-right',
    'top-left',
    'right-top',
    'right-bottom',
    'left-top',
    'left-bottom',
  ],
  left: [
    'left-top',
    'left-bottom',
    'right-top',
    'right-bottom',
    'bottom-center',
    'top-center',
    'bottom-left',
    'top-left',
    'bottom-right',
    'top-right',
  ],
  right: [
    'right-top',
    'right-bottom',
    'left-top',
    'left-bottom',
    'bottom-center',
    'top-center',
    'bottom-right',
    'top-right',
    'bottom-left',
    'top-left',
  ],
};

const RECTANGLE_CALCULATIONS: Record<InternalPosition, (r: ElementGroup) => BoundingBox> = {
  'top-center': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart - body.blockSize - arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart + trigger.inlineSize / 2 - body.inlineSize / 2,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'top-right': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart - body.blockSize - arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart + trigger.inlineSize / 2 - ARROW_OFFSET - arrow.inlineSize / 2,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'top-left': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart - body.blockSize - arrow.blockSize,
      insetInlineStart:
        trigger.insetInlineStart + trigger.inlineSize / 2 + ARROW_OFFSET + arrow.inlineSize / 2 - body.inlineSize,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'bottom-center': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart + trigger.blockSize + arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart + trigger.inlineSize / 2 - body.inlineSize / 2,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'bottom-right': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart + trigger.blockSize + arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart + trigger.inlineSize / 2 - ARROW_OFFSET - arrow.inlineSize / 2,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'bottom-left': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart + trigger.blockSize + arrow.blockSize,
      insetInlineStart:
        trigger.insetInlineStart + trigger.inlineSize / 2 + ARROW_OFFSET + arrow.inlineSize / 2 - body.inlineSize,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'right-top': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart + trigger.blockSize / 2 - ARROW_OFFSET - arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart + trigger.inlineSize + arrow.blockSize,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'right-bottom': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart:
        trigger.insetBlockStart + trigger.blockSize / 2 - body.blockSize + ARROW_OFFSET + arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart + trigger.inlineSize + arrow.blockSize,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'left-top': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart: trigger.insetBlockStart + trigger.blockSize / 2 - ARROW_OFFSET - arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart - body.inlineSize - arrow.blockSize,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
  'left-bottom': ({ body, trigger, arrow }) => {
    return {
      insetBlockStart:
        trigger.insetBlockStart + trigger.blockSize / 2 - body.blockSize + ARROW_OFFSET + arrow.blockSize,
      insetInlineStart: trigger.insetInlineStart - body.inlineSize - arrow.blockSize,
      inlineSize: body.inlineSize,
      blockSize: body.blockSize,
    };
  },
};

function fitIntoContainer(inner: BoundingBox, outer: BoundingBox): BoundingBox {
  let { insetInlineStart, inlineSize, insetBlockStart, blockSize } = inner;

  // Adjust left boundary.
  if (insetInlineStart < outer.insetInlineStart) {
    inlineSize = insetInlineStart + inlineSize - outer.insetInlineStart;
    insetInlineStart = outer.insetInlineStart;
  }
  // Adjust right boundary.
  else if (insetInlineStart + inlineSize > outer.insetInlineStart + outer.inlineSize) {
    inlineSize = outer.insetInlineStart + outer.inlineSize - insetInlineStart;
  }
  // Adjust top boundary.
  if (insetBlockStart < outer.insetBlockStart) {
    blockSize = insetBlockStart + blockSize - outer.insetBlockStart;
    insetBlockStart = outer.insetBlockStart;
  }
  // Adjust bottom boundary.
  else if (insetBlockStart + blockSize > outer.insetBlockStart + outer.blockSize) {
    blockSize = outer.insetBlockStart + outer.blockSize - insetBlockStart;
  }

  return { insetInlineStart, inlineSize, insetBlockStart, blockSize };
}

function getTallestRect(rect1: BoundingBox, rect2: BoundingBox): BoundingBox {
  return rect1.blockSize >= rect2.blockSize ? rect1 : rect2;
}

function getIntersection(rectangles: BoundingBox[]): BoundingBox | null {
  let boundingBox: BoundingBox | null = null;
  for (const currentRect of rectangles) {
    if (!boundingBox) {
      boundingBox = currentRect;
      continue;
    }
    const insetInlineStart = Math.max(boundingBox.insetInlineStart, currentRect.insetInlineStart);
    const insetBlockStart = Math.max(boundingBox.insetBlockStart, currentRect.insetBlockStart);
    const insetInlineEnd = Math.min(
      boundingBox.insetInlineStart + boundingBox.inlineSize,
      currentRect.insetInlineStart + currentRect.inlineSize
    );
    const insetBlockEnd = Math.min(
      boundingBox.insetBlockStart + boundingBox.blockSize,
      currentRect.insetBlockStart + currentRect.blockSize
    );

    if (insetInlineEnd < insetInlineStart || insetBlockEnd < insetBlockStart) {
      return null;
    }
    boundingBox = {
      insetInlineStart,
      insetBlockStart,
      inlineSize: insetInlineEnd - insetInlineStart,
      blockSize: insetBlockEnd - insetBlockStart,
    };
  }
  return boundingBox;
}

/**
 * Returns the area of the intersection of passed in rectangles or a null, if there is no intersection
 */
export function intersectRectangles(rectangles: BoundingBox[]): number | null {
  const boundingBox: BoundingBox | null = getIntersection(rectangles);
  return boundingBox && boundingBox.blockSize * boundingBox.inlineSize;
}

type CandidatePosition = CalculatedPosition & { visibleArea: BoundingBox | null };

/**
 * A functions that returns the correct popover position based on screen dimensions.
 */
export function calculatePosition({
  preferredPosition,
  fixedInternalPosition,
  trigger,
  arrow,
  body,
  container,
  viewport,
  // the popover is only bound by the viewport if it is rendered in a portal
  renderWithPortal,
  allowVerticalOverflow,
}: {
  preferredPosition: PopoverProps.Position;
  fixedInternalPosition?: InternalPosition;
  trigger: BoundingBox;
  arrow: Dimensions;
  body: Dimensions;
  container: BoundingBox;
  viewport: BoundingBox;
  // the popover is only bound by the viewport if it is rendered in a portal
  renderWithPortal?: boolean;
  allowVerticalOverflow?: boolean;
}): CalculatedPosition {
  let bestOption: CandidatePosition | null = null;

  // If a fixed internal position is passed, only consider this one.
  const preferredInternalPositions = fixedInternalPosition
    ? [fixedInternalPosition]
    : PRIORITY_MAPPING[preferredPosition];

  // Attempt to position the popover based on the priority list for this position.
  for (const internalPosition of preferredInternalPositions) {
    const rect = RECTANGLE_CALCULATIONS[internalPosition]({ body, trigger, arrow });
    const visibleArea = renderWithPortal
      ? getIntersection([rect, viewport])
      : getIntersection([rect, viewport, container]);

    const fitsWithoutOverflow =
      visibleArea && visibleArea.inlineSize === body.inlineSize && visibleArea.blockSize === body.blockSize;

    if (fitsWithoutOverflow) {
      return { internalPosition, rect };
    }

    const newOption = { rect, internalPosition, visibleArea };
    bestOption = getBestOption(newOption, bestOption);
  }

  // Use best possible placement.
  const internalPosition = bestOption?.internalPosition || 'right-top';
  // Get default rect for that placement.
  const rect = RECTANGLE_CALCULATIONS[internalPosition]({ body, trigger, arrow });

  // Get largest possible rect that fits into the viewport or container.

  // We allow the popover to overflow the viewport if allowVerticalOverflow is true _and_ the popover will be anchored to the top or the bottom.
  // If it is anchored to the right or left, we consider that it should have enough vertical space so that applying scroll to it is a better option.
  const tallestBoundingContainer = getTallestRect(viewport, container);
  const boundingContainer =
    allowVerticalOverflow && isTopOrBottom(internalPosition)
      ? {
          insetBlockStart: tallestBoundingContainer.insetBlockStart,
          blockSize: tallestBoundingContainer.blockSize,
          insetInlineStart: viewport.insetInlineStart,
          inlineSize: viewport.inlineSize,
        }
      : viewport;

  const optimizedRect = fitIntoContainer(rect, boundingContainer);

  // If largest possible rect is shorter than original - set body scroll.
  const scrollable = optimizedRect.blockSize < rect.blockSize;

  return { internalPosition, rect: optimizedRect, scrollable };
}

function getBestOption(option1: CandidatePosition, option2: CandidatePosition | null) {
  // Within calculatePosition, the only case where option2 will not be defined will be in the first call.
  // The only case where the visibleArea of an option will be null is when the popover is totally outside of the viewport.
  if (!option2?.visibleArea) {
    return option1;
  }
  if (!option1.visibleArea) {
    return option2;
  }
  // Only if none of the two options overflows horizontally, choose the best based on the visible height.
  if (option1.visibleArea.inlineSize === option2.visibleArea.inlineSize) {
    return option1.visibleArea.blockSize > option2.visibleArea.blockSize ? option1 : option2;
  }
  // Otherwise, choose the option that is less cut off horizontally.
  return option1.visibleArea.inlineSize > option2.visibleArea.inlineSize ? option1 : option2;
}

export function getOffsetDimensions(element: HTMLElement) {
  return { offsetHeight: element.offsetHeight, offsetWidth: element.offsetWidth };
}

export function getDimensions(element: HTMLElement) {
  const computedStyle = getComputedStyle(element);
  return {
    inlineSize: parseFloat(computedStyle.inlineSize),
    blockSize: parseFloat(computedStyle.blockSize),
  };
}

function isTopOrBottom(internalPosition: InternalPosition) {
  return ['top', 'bottom'].includes(internalPosition.split('-')[0]);
}
