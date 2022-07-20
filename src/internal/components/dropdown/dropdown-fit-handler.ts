// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Dimensions, getOverflowParents, getOverflowParentDimensions } from '../../utils/scrollable-containers';
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
  height: string;
  width: string;
  dropUp: boolean;
  dropLeft: boolean;
  left: string;
}
export interface InteriorDropdownPosition extends DropdownPosition {
  bottom: string;
  top: string;
}

const getClosestParentDimensions = (element: HTMLElement): any => {
  const parents = getOverflowParents(element).map(el => {
    const { height, width, top, left } = el.getBoundingClientRect();
    return {
      height,
      width,
      top,
      left,
    };
  });

  return parents.shift();
};

export const getAvailableSpace = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  overflowParents: ReadonlyArray<Dimensions>,
  stretchWidth = false,
  stretchHeight = false,
  isMobile?: boolean
): AvailableSpace => {
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
  const { bottom: triggerBottom, left: triggerLeft, right: triggerRight } = trigger.getBoundingClientRect();

  return overflowParents.reduce(
    ({ above, below, left, right }, overflowParent) => {
      const offsetTop = triggerBottom - overflowParent.top;
      const currentAbove = offsetTop - trigger.offsetHeight - availableSpaceReserveVertical;
      const currentBelow = overflowParent.height - offsetTop - availableSpaceReserveVertical;
      const currentLeft = triggerRight - overflowParent.left - availableSpaceReserveHorizontal;
      const currentRight = overflowParent.left + overflowParent.width - triggerLeft - availableSpaceReserveHorizontal;

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

export const getInteriorAvailableSpace = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  overflowParents: ReadonlyArray<Dimensions>,
  isMobile?: boolean
): AvailableSpace => {
  const AVAILABLE_SPACE_RESERVE_VERTICAL = isMobile
    ? AVAILABLE_SPACE_RESERVE_MOBILE_VERTICAL
    : AVAILABLE_SPACE_RESERVE_DEFAULT;
  const AVAILABLE_SPACE_RESERVE_HORIZONTAL = isMobile
    ? AVAILABLE_SPACE_RESERVE_MOBILE_HORIZONTAL
    : AVAILABLE_SPACE_RESERVE_DEFAULT;
  const {
    bottom: triggerBottom,
    top: triggerTop,
    left: triggerLeft,
    right: triggerRight,
  } = trigger.getBoundingClientRect();

  return overflowParents.reduce(
    ({ above, below, left, right }, overflowParent) => {
      const currentAbove = triggerBottom - overflowParent.top - AVAILABLE_SPACE_RESERVE_VERTICAL;
      const currentBelow = overflowParent.height - triggerTop + overflowParent.top - AVAILABLE_SPACE_RESERVE_VERTICAL;
      const currentLeft = triggerLeft - overflowParent.left - AVAILABLE_SPACE_RESERVE_HORIZONTAL;
      const currentRight =
        overflowParent.left + overflowParent.width - triggerRight - AVAILABLE_SPACE_RESERVE_HORIZONTAL;

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

export const getDropdownPosition = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  overflowParents: ReadonlyArray<Dimensions>,
  minWidth?: number,
  preferCenter = false,
  stretchWidth = false,
  stretchHeight = false,
  isMobile?: boolean
): DropdownPosition => {
  const availableSpace = getAvailableSpace(trigger, dropdown, overflowParents, stretchWidth, stretchHeight, isMobile);
  const triggerWidth = trigger.getBoundingClientRect().width;
  minWidth = minWidth ? Math.min(triggerWidth, minWidth) : triggerWidth;
  const requiredWidth = dropdown.getBoundingClientRect().width;
  // dropdown should not be smaller than the trigger
  const idealWidth = Math.max(requiredWidth, minWidth);

  let dropLeft: boolean;
  let left: number | null = null;
  let width = idealWidth;

  //1. Can it be positioned with ideal width to the right?
  if (idealWidth <= availableSpace.right) {
    dropLeft = false;
    //2. Can it be positioned with ideal width to the left?
  } else if (idealWidth <= availableSpace.left) {
    dropLeft = true;
    //3. Fit into biggest available space either on left or right
  } else {
    dropLeft = availableSpace.left > availableSpace.right;
    width = Math.max(availableSpace.left, availableSpace.right, minWidth);
  }

  if (preferCenter) {
    const spillOver = (idealWidth - triggerWidth) / 2;

    // availableSpace always includes the trigger width, but we want to exclude that
    const availableOutsideLeft = availableSpace.left - triggerWidth;
    const availableOutsideRight = availableSpace.right - triggerWidth;

    const fitsInCenter = availableOutsideLeft >= spillOver && availableOutsideRight >= spillOver;
    if (fitsInCenter) {
      left = -spillOver;
    }
  }

  const dropUp = availableSpace.below < dropdown.offsetHeight && availableSpace.above > availableSpace.below;
  const availableHeight = dropUp ? availableSpace.above : availableSpace.below;
  // Try and crop the bottom item when all options can't be displayed, affordance for "there's more"
  const croppedHeight = stretchHeight ? availableHeight : Math.floor(availableHeight / 31) * 31 + 16;

  return {
    dropUp,
    dropLeft,
    left: left === null ? 'auto' : `${left}px`,
    height: `${croppedHeight}px`,
    width: `${width}px`,
  };
};

export const getInteriorDropdownPosition = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  overflowParents: ReadonlyArray<Dimensions>,
  isMobile?: boolean
): InteriorDropdownPosition => {
  const availableSpace = getInteriorAvailableSpace(trigger, dropdown, overflowParents, isMobile);
  const { bottom: triggerBottom, top: triggerTop, width: triggerWidth } = trigger.getBoundingClientRect();
  const { top: parentDropdownTop, height: parentDropdownHeight } = getClosestParentDimensions(trigger);

  let dropLeft;

  let width = dropdown.getBoundingClientRect().width;
  const top = triggerTop - parentDropdownTop;
  if (width <= availableSpace.right) {
    dropLeft = false;
  } else if (width <= availableSpace.left) {
    dropLeft = true;
  } else {
    dropLeft = availableSpace.left > availableSpace.right;
    width = Math.max(availableSpace.left, availableSpace.right);
  }

  const left = dropLeft ? 0 - width : triggerWidth;

  const dropUp = availableSpace.below < dropdown.offsetHeight && availableSpace.above > availableSpace.below;
  const bottom = dropUp ? parentDropdownTop + parentDropdownHeight - triggerBottom : 0;
  const availableHeight = dropUp ? availableSpace.above : availableSpace.below;
  // Try and crop the bottom item when all options can't be displayed, affordance for "there's more"
  const croppedHeight = Math.floor(availableHeight / 31) * 31 + 16;

  return {
    dropUp,
    dropLeft,
    height: `${croppedHeight}px`,
    width: `${width}px`,
    top: `${top}px`,
    bottom: `${bottom}px`,
    left: `${left}px`,
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
  minWidth?: number
): [DropdownPosition, DOMRect] => {
  // cleaning previously assigned values,
  // so that they are not reused in case of screen resize and similar events
  verticalContainerElement.style.maxHeight = '';
  dropdownElement.style.width = '';
  dropdownElement.style.top = '';
  dropdownElement.style.bottom = '';
  dropdownElement.style.left = '';

  dropdownElement.classList.remove(styles['dropdown-drop-left']);
  dropdownElement.classList.remove(styles['dropdown-drop-right']);
  dropdownElement.classList.remove(styles['dropdown-drop-up']);

  const overflowParents = getOverflowParentDimensions(dropdownElement, interior, expandToViewport, stretchHeight);
  const position = interior
    ? getInteriorDropdownPosition(triggerElement, dropdownElement, overflowParents, isMobile)
    : getDropdownPosition(
        triggerElement,
        dropdownElement,
        overflowParents,
        minWidth,
        preferCenter,
        stretchWidth,
        stretchHeight,
        isMobile
      );
  const triggerBox = triggerElement.getBoundingClientRect();
  return [position, triggerBox];
};
