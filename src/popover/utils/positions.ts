// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PopoverProps, InternalPosition, BoundingBox, Dimensions } from '../interfaces';

// A structure describing how the popover should be positioned
interface CalculatedPosition {
  scrollable?: boolean;
  internalPosition: InternalPosition;
  boundingBox: BoundingBox;
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
      top: trigger.top - body.height - arrow.height,
      left: trigger.left + trigger.width / 2 - body.width / 2,
      width: body.width,
      height: body.height,
    };
  },
  'top-right': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top - body.height - arrow.height,
      left: trigger.left + trigger.width / 2 - ARROW_OFFSET - arrow.width / 2,
      width: body.width,
      height: body.height,
    };
  },
  'top-left': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top - body.height - arrow.height,
      left: trigger.left + trigger.width / 2 + ARROW_OFFSET + arrow.width / 2 - body.width,
      width: body.width,
      height: body.height,
    };
  },
  'bottom-center': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height + arrow.height,
      left: trigger.left + trigger.width / 2 - body.width / 2,
      width: body.width,
      height: body.height,
    };
  },
  'bottom-right': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height + arrow.height,
      left: trigger.left + trigger.width / 2 - ARROW_OFFSET - arrow.width / 2,
      width: body.width,
      height: body.height,
    };
  },
  'bottom-left': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height + arrow.height,
      left: trigger.left + trigger.width / 2 + ARROW_OFFSET + arrow.width / 2 - body.width,
      width: body.width,
      height: body.height,
    };
  },
  'right-top': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height / 2 - ARROW_OFFSET - arrow.height,
      left: trigger.left + trigger.width + arrow.height,
      width: body.width,
      height: body.height,
    };
  },
  'right-bottom': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height / 2 - body.height + ARROW_OFFSET + arrow.height,
      left: trigger.left + trigger.width + arrow.height,
      width: body.width,
      height: body.height,
    };
  },
  'left-top': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height / 2 - ARROW_OFFSET - arrow.height,
      left: trigger.left - body.width - arrow.height,
      width: body.width,
      height: body.height,
    };
  },
  'left-bottom': ({ body, trigger, arrow }) => {
    return {
      top: trigger.top + trigger.height / 2 - body.height + ARROW_OFFSET + arrow.height,
      left: trigger.left - body.width - arrow.height,
      width: body.width,
      height: body.height,
    };
  },
};

function fitIntoContainer(inner: BoundingBox, outer: BoundingBox): BoundingBox {
  let { left, width, top, height } = inner;

  // Adjust left boundary.
  if (left < outer.left) {
    width = left + width - outer.left;
    left = outer.left;
  }
  // Adjust right boundary.
  else if (left + width > outer.left + outer.width) {
    width = outer.left + outer.width - left;
  }
  // Adjust top boundary.
  if (top < outer.top) {
    height = top + height - outer.top;
    top = outer.top;
  }
  // Adjust bottom boundary.
  else if (top + height > outer.top + outer.height) {
    height = outer.top + outer.height - top;
  }

  return { left, width, top, height };
}

function getTallestRect(rect1: BoundingBox, rect2: BoundingBox): BoundingBox {
  return rect1.height >= rect2.height ? rect1 : rect2;
}

function getIntersection(rectangles: BoundingBox[]): BoundingBox | null {
  let boundingBox: BoundingBox | null = null;
  for (const currentRect of rectangles) {
    if (!boundingBox) {
      boundingBox = currentRect;
      continue;
    }
    const left = Math.max(boundingBox.left, currentRect.left);
    const top = Math.max(boundingBox.top, currentRect.top);
    const right = Math.min(boundingBox.left + boundingBox.width, currentRect.left + currentRect.width);
    const bottom = Math.min(boundingBox.top + boundingBox.height, currentRect.top + currentRect.height);
    if (right < left || bottom < top) {
      return null;
    }
    boundingBox = {
      left,
      top,
      width: right - left,
      height: bottom - top,
    };
  }
  return boundingBox;
}

/**
 * Returns the area of the intersection of passed in rectangles or a null, if there is no intersection
 */
export function intersectRectangles(rectangles: BoundingBox[]): number | null {
  const boundingBox: BoundingBox | null = getIntersection(rectangles);
  return boundingBox && boundingBox.height * boundingBox.width;
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
  scrollIfNeeded,
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
  scrollIfNeeded?: boolean;
}): CalculatedPosition {
  let bestOption: CandidatePosition | null = null;

  // If a fixed internal position is passed, only consider this one.
  const preferredInternalPositions = fixedInternalPosition
    ? [fixedInternalPosition]
    : PRIORITY_MAPPING[preferredPosition];

  // Attempt to position the popover based on the priority list for this position.
  for (const internalPosition of preferredInternalPositions) {
    const boundingBox = RECTANGLE_CALCULATIONS[internalPosition]({ body, trigger, arrow });
    const visibleArea = renderWithPortal
      ? getIntersection([boundingBox, viewport])
      : getIntersection([boundingBox, viewport, container]);

    const fitsWithoutOverflow = visibleArea && visibleArea.width === body.width && visibleArea.height === body.height;

    if (fitsWithoutOverflow) {
      return { internalPosition, boundingBox };
    }

    const newOption = { boundingBox, internalPosition, visibleArea };
    bestOption = getBestOption(newOption, bestOption);
  }

  // Use best possible placement.
  const internalPosition = bestOption?.internalPosition || 'right-top';
  // Get default rect for that placement.
  const defaultBoundingBox = RECTANGLE_CALCULATIONS[internalPosition]({ body, trigger, arrow });
  // Get largest possible rect that fits into the viewport or container.
  const tallestRect = getTallestRect(viewport, container);
  const optimisedBoundingBox = fitIntoContainer(
    defaultBoundingBox,
    scrollIfNeeded ? { ...tallestRect, left: viewport.left, width: viewport.width } : viewport
  );
  // If largest possible rect is shorter than original - set body scroll.
  const scrollable = optimisedBoundingBox.height < defaultBoundingBox.height;

  return { internalPosition, boundingBox: optimisedBoundingBox, scrollable };
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
  if (option1.visibleArea.width === option2.visibleArea.width) {
    return option1.visibleArea.height > option2.visibleArea.height ? option1 : option2;
  }
  // Otherwise, choose the option that is less cut off horizontally.
  return option1.visibleArea.width > option2.visibleArea.width ? option1 : option2;
}

export function getOffsetDimensions(element: HTMLElement) {
  return { offsetHeight: element.offsetHeight, offsetWidth: element.offsetWidth };
}

export function getDimensions(element: HTMLElement) {
  const computedStyle = getComputedStyle(element);
  return {
    width: parseFloat(computedStyle.width),
    height: parseFloat(computedStyle.height),
  };
}
