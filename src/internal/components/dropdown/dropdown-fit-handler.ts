// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getBreakpointValue } from '../../breakpoints';
import { getLogicalBoundingClientRect } from '../../direction';
import { BoundingBox, getOverflowParents, getOverflowParentDimensions } from '../../utils/scrollable-containers';
import styles from './styles.css.js';

const AVAILABLE_SPACE_RESERVE_DEFAULT = 50;
const AVAILABLE_SPACE_RESERVE_MOBILE_VERTICAL = 19; // 50 - 31
const AVAILABLE_SPACE_RESERVE_MOBILE_HORIZONTAL = 20;

interface AvailableSpace {
  above: number;
  below: number;
  left: number;
  right: number;
}
export interface DropdownPosition {
  blockSize: string;
  inlineSize: string;
  dropUp: boolean;
  dropLeft: boolean;
  insetInlineStart: string;
}
export interface InteriorDropdownPosition extends DropdownPosition {
  insetBlockEnd: string;
  insetBlockStart: string;
}

const getClosestParentDimensions = (element: HTMLElement): any => {
  const parents = getOverflowParents(element).map(element => {
    const { blockSize, inlineSize, insetBlockStart, insetInlineStart } = getLogicalBoundingClientRect(element);
    return {
      blockSize,
      inlineSize,
      insetBlockStart,
      insetInlineStart,
    };
  });

  return parents.shift();
};

// By default, most dropdowns should expand their content as necessary, but to a maximum of 465px (the XXS breakpoint).
// This value was determined by UX but may be subject to change in the future, depending on the feedback.
export const defaultMaxDropdownWidth = getBreakpointValue('xxs');

export const getAvailableSpace = ({
  trigger,
  overflowParents,
  stretchWidth = false,
  stretchHeight = false,
  isMobile,
}: {
  trigger: HTMLElement;
  overflowParents: ReadonlyArray<BoundingBox>;
  stretchWidth?: boolean;
  stretchHeight?: boolean;
  isMobile?: boolean;
}): AvailableSpace => {
  const availableSpaceReserveVertical = stretchHeight
    ? 0
    : isMobile
    ? AVAILABLE_SPACE_RESERVE_MOBILE_VERTICAL
    : AVAILABLE_SPACE_RESERVE_DEFAULT;
  const availableSpaceReserveHorizontal = stretchWidth
    ? 0
    : isMobile
    ? AVAILABLE_SPACE_RESERVE_MOBILE_HORIZONTAL
    : AVAILABLE_SPACE_RESERVE_DEFAULT;
  const {
    insetBlockEnd: triggerBottom,
    insetInlineStart: triggerLeft,
    insetInlineEnd: triggerRight,
  } = getLogicalBoundingClientRect(trigger);

  return overflowParents.reduce(
    ({ above, below, left, right }, overflowParent) => {
      const offsetTop = triggerBottom - overflowParent.insetBlockStart;
      const currentAbove = offsetTop - trigger.offsetHeight - availableSpaceReserveVertical;
      const currentBelow = overflowParent.blockSize - offsetTop - availableSpaceReserveVertical;
      const currentLeft = triggerRight - overflowParent.insetInlineStart - availableSpaceReserveHorizontal;
      const currentRight =
        overflowParent.insetInlineStart + overflowParent.inlineSize - triggerLeft - availableSpaceReserveHorizontal;

      return {
        above: Math.min(above, currentAbove),
        below: Math.min(below, currentBelow),
        left: Math.min(left, currentLeft),
        right: Math.min(right, currentRight),
      };
    },
    { above: Number.MAX_VALUE, below: Number.MAX_VALUE, left: Number.MAX_VALUE, right: Number.MAX_VALUE }
  );
};

export const getInteriorAvailableSpace = ({
  trigger,
  overflowParents,
  isMobile,
}: {
  trigger: HTMLElement;
  overflowParents: ReadonlyArray<BoundingBox>;
  isMobile?: boolean;
}): AvailableSpace => {
  const AVAILABLE_SPACE_RESERVE_VERTICAL = isMobile
    ? AVAILABLE_SPACE_RESERVE_MOBILE_VERTICAL
    : AVAILABLE_SPACE_RESERVE_DEFAULT;
  const AVAILABLE_SPACE_RESERVE_HORIZONTAL = isMobile
    ? AVAILABLE_SPACE_RESERVE_MOBILE_HORIZONTAL
    : AVAILABLE_SPACE_RESERVE_DEFAULT;
  const {
    insetBlockEnd: triggerBottom,
    insetBlockStart: triggerTop,
    insetInlineStart: triggerLeft,
    insetInlineEnd: triggerRight,
  } = getLogicalBoundingClientRect(trigger);

  return overflowParents.reduce(
    ({ above, below, left, right }, overflowParent) => {
      const currentAbove = triggerBottom - overflowParent.insetBlockStart - AVAILABLE_SPACE_RESERVE_VERTICAL;
      const currentBelow =
        overflowParent.blockSize - triggerTop + overflowParent.insetBlockStart - AVAILABLE_SPACE_RESERVE_VERTICAL;
      const currentLeft = triggerLeft - overflowParent.insetInlineStart - AVAILABLE_SPACE_RESERVE_HORIZONTAL;
      const currentRight =
        overflowParent.insetInlineStart + overflowParent.inlineSize - triggerRight - AVAILABLE_SPACE_RESERVE_HORIZONTAL;

      return {
        above: Math.min(above, currentAbove),
        below: Math.min(below, currentBelow),
        left: Math.min(left, currentLeft),
        right: Math.min(right, currentRight),
      };
    },
    { above: Number.MAX_VALUE, below: Number.MAX_VALUE, left: Number.MAX_VALUE, right: Number.MAX_VALUE }
  );
};

export const getWidths = ({
  triggerElement,
  dropdownElement,
  desiredMinWidth,
  stretchBeyondTriggerWidth = false,
}: {
  triggerElement: HTMLElement;
  dropdownElement: HTMLElement;
  desiredMinWidth?: number;
  stretchBeyondTriggerWidth?: boolean;
}) => {
  // Determine the width of the trigger
  const { inlineSize: triggerWidth } = getLogicalBoundingClientRect(triggerElement);
  // Minimum width is determined by either an explicit number (desiredMinWidth) or the trigger width
  const minWidth = desiredMinWidth ? Math.min(triggerWidth, desiredMinWidth) : triggerWidth;
  // If stretchBeyondTriggerWidth is true, the maximum width is the XS breakpoint (465px) or the trigger width (if bigger).
  const maxWidth = stretchBeyondTriggerWidth ? Math.max(defaultMaxDropdownWidth, triggerWidth) : Number.MAX_VALUE;
  // Determine the actual dropdown width, the size that it "wants" to be
  const { inlineSize: requiredWidth } = getLogicalBoundingClientRect(dropdownElement);
  // Try to achieve the required/desired width within the given parameters
  const idealWidth = Math.min(Math.max(requiredWidth, minWidth), maxWidth);
  return { idealWidth, minWidth, triggerWidth };
};

export const hasEnoughSpaceToStretchBeyondTriggerWidth = ({
  triggerElement,
  dropdownElement,
  desiredMinWidth,
  expandToViewport,
  stretchWidth,
  stretchHeight,
  isMobile,
}: {
  triggerElement: HTMLElement;
  dropdownElement: HTMLElement;
  desiredMinWidth?: number;
  expandToViewport: boolean;
  stretchWidth: boolean;
  stretchHeight: boolean;
  isMobile: boolean;
}) => {
  const overflowParents = getOverflowParentDimensions({
    element: dropdownElement,
    excludeClosestParent: false,
    expandToViewport,
    canExpandOutsideViewport: stretchHeight,
  });
  const { idealWidth } = getWidths({
    triggerElement: triggerElement,
    dropdownElement,
    desiredMinWidth,
    stretchBeyondTriggerWidth: true,
  });
  const availableSpace = getAvailableSpace({
    trigger: triggerElement,
    overflowParents,
    stretchWidth,
    stretchHeight,
    isMobile,
  });
  return idealWidth <= availableSpace.left || idealWidth <= availableSpace.right;
};

export const getDropdownPosition = ({
  triggerElement,
  dropdownElement,
  overflowParents,
  minWidth: desiredMinWidth,
  preferCenter = false,
  stretchWidth = false,
  stretchHeight = false,
  isMobile = false,
  stretchBeyondTriggerWidth = false,
}: {
  triggerElement: HTMLElement;
  dropdownElement: HTMLElement;
  overflowParents: ReadonlyArray<BoundingBox>;
  minWidth?: number;
  preferCenter?: boolean;
  stretchWidth?: boolean;
  stretchHeight?: boolean;
  isMobile?: boolean;
  stretchBeyondTriggerWidth?: boolean;
}): DropdownPosition => {
  // Determine the space available around the dropdown that it can grow in
  const availableSpace = getAvailableSpace({
    trigger: triggerElement,
    overflowParents,
    stretchWidth,
    stretchHeight,
    isMobile,
  });
  const { idealWidth, minWidth, triggerWidth } = getWidths({
    triggerElement,
    dropdownElement,
    desiredMinWidth,
    stretchBeyondTriggerWidth,
  });

  let dropLeft: boolean;
  let insetInlineStart: number | null = null;
  let inlineSize = idealWidth;

  //1. Can it be positioned with ideal width to the right?
  if (idealWidth <= availableSpace.right) {
    dropLeft = false;
    //2. Can it be positioned with ideal width to the left?
  } else if (idealWidth <= availableSpace.left) {
    dropLeft = true;
    //3. Fit into biggest available space either on left or right
  } else {
    dropLeft = availableSpace.left > availableSpace.right;
    inlineSize = Math.max(availableSpace.left, availableSpace.right, minWidth);
  }

  if (preferCenter) {
    const spillOver = (idealWidth - triggerWidth) / 2;

    // availableSpace always includes the trigger width, but we want to exclude that
    const availableOutsideLeft = availableSpace.left - triggerWidth;
    const availableOutsideRight = availableSpace.right - triggerWidth;

    const fitsInCenter = availableOutsideLeft >= spillOver && availableOutsideRight >= spillOver;
    if (fitsInCenter) {
      insetInlineStart = -spillOver;
    }
  }

  const dropUp = availableSpace.below < dropdownElement.offsetHeight && availableSpace.above > availableSpace.below;
  const availableHeight = dropUp ? availableSpace.above : availableSpace.below;
  // Try and crop the bottom item when all options can't be displayed, affordance for "there's more"
  const croppedHeight = stretchHeight ? availableHeight : Math.floor(availableHeight / 31) * 31 + 16;

  return {
    dropUp,
    dropLeft,
    insetInlineStart: insetInlineStart === null ? 'auto' : `${insetInlineStart}px`,
    blockSize: `${croppedHeight}px`,
    inlineSize: `${inlineSize}px`,
  };
};

export const getInteriorDropdownPosition = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  overflowParents: ReadonlyArray<BoundingBox>,
  isMobile?: boolean
): InteriorDropdownPosition => {
  const availableSpace = getInteriorAvailableSpace({ trigger, overflowParents, isMobile });
  const {
    insetBlockEnd: triggerBottom,
    insetBlockStart: triggerTop,
    inlineSize: triggerWidth,
  } = getLogicalBoundingClientRect(trigger);
  const { insetBlockStart: parentDropdownTop, blockSize: parentDropdownHeight } = getClosestParentDimensions(trigger);

  let dropLeft;

  let { inlineSize } = getLogicalBoundingClientRect(dropdown);
  const insetBlockStart = triggerTop - parentDropdownTop;
  if (inlineSize <= availableSpace.right) {
    dropLeft = false;
  } else if (inlineSize <= availableSpace.left) {
    dropLeft = true;
  } else {
    dropLeft = availableSpace.left > availableSpace.right;
    inlineSize = Math.max(availableSpace.left, availableSpace.right);
  }

  const insetInlineStart = dropLeft ? 0 - inlineSize : triggerWidth;

  const dropUp = availableSpace.below < dropdown.offsetHeight && availableSpace.above > availableSpace.below;
  const bottom = dropUp ? parentDropdownTop + parentDropdownHeight - triggerBottom : 0;
  const availableHeight = dropUp ? availableSpace.above : availableSpace.below;
  // Try and crop the bottom item when all options can't be displayed, affordance for "there's more"
  const croppedHeight = Math.floor(availableHeight / 31) * 31 + 16;

  return {
    dropUp,
    dropLeft,
    blockSize: `${croppedHeight}px`,
    inlineSize: `${inlineSize}px`,
    insetBlockStart: `${insetBlockStart}px`,
    insetBlockEnd: `${bottom}px`,
    insetInlineStart: `${insetInlineStart}px`,
  };
};

export const calculatePosition = (
  dropdownElement: HTMLDivElement,
  triggerElement: HTMLDivElement,
  verticalContainerElement: HTMLDivElement,
  interior: boolean,
  expandToViewport: boolean,
  preferCenter: boolean,
  stretchWidth: boolean,
  stretchHeight: boolean,
  isMobile: boolean,
  minWidth?: number,
  stretchBeyondTriggerWidth?: boolean
): [DropdownPosition, DOMRect] => {
  // cleaning previously assigned values,
  // so that they are not reused in case of screen resize and similar events
  verticalContainerElement.style.maxHeight = '';
  dropdownElement.style.inlineSize = '';
  dropdownElement.style.insetBlockStart = '';
  dropdownElement.style.insetBlockEnd = '';
  dropdownElement.style.insetInlineStart = '';

  dropdownElement.classList.remove(styles['dropdown-drop-left']);
  dropdownElement.classList.remove(styles['dropdown-drop-right']);
  dropdownElement.classList.remove(styles['dropdown-drop-up']);

  const overflowParents = getOverflowParentDimensions({
    element: dropdownElement,
    excludeClosestParent: interior,
    expandToViewport,
    canExpandOutsideViewport: stretchHeight,
  });
  const position = interior
    ? getInteriorDropdownPosition(triggerElement, dropdownElement, overflowParents, isMobile)
    : getDropdownPosition({
        triggerElement,
        dropdownElement,
        overflowParents,
        minWidth,
        preferCenter,
        stretchWidth,
        stretchHeight,
        isMobile,
        stretchBeyondTriggerWidth,
      });
  const triggerBox = triggerElement.getBoundingClientRect();
  return [position, triggerBox];
};
