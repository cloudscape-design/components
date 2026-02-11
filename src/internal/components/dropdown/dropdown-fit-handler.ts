// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';

import { BoundingBox, getOverflowParentDimensions, getOverflowParents } from '../../utils/scrollable-containers';
import { LogicalDOMRect } from './dropdown-position';
import { DropdownWidthConstraint } from './interfaces';

import styles from './styles.css.js';

const AVAILABLE_SPACE_RESERVE_DEFAULT = 50;
const AVAILABLE_SPACE_RESERVE_MOBILE_VERTICAL = 19; // 50 - 31
const AVAILABLE_SPACE_RESERVE_MOBILE_HORIZONTAL = 20;

interface AvailableSpace {
  blockStart: number;
  blockEnd: number;
  inlineStart: number;
  inlineEnd: number;
}
export interface DropdownPosition {
  blockSize: string;
  inlineSize: string;
  dropBlockStart: boolean;
  dropInlineStart: boolean;
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

const getAvailableSpace = ({
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
    insetBlockEnd: triggerBlockEnd,
    insetInlineStart: triggerInlineStart,
    insetInlineEnd: triggerInlineEnd,
  } = getLogicalBoundingClientRect(trigger);

  return overflowParents.reduce(
    ({ blockStart, blockEnd, inlineStart, inlineEnd }, overflowParent) => {
      const offsetTop = triggerBlockEnd - overflowParent.insetBlockStart;
      const currentBlockStart = offsetTop - trigger.offsetHeight - availableSpaceReserveVertical;
      const currentBlockEnd = overflowParent.blockSize - offsetTop - availableSpaceReserveVertical;
      const currentInlineStart = triggerInlineEnd - overflowParent.insetInlineStart - availableSpaceReserveHorizontal;
      const currentInlineEnd =
        overflowParent.insetInlineStart +
        overflowParent.inlineSize -
        triggerInlineStart -
        availableSpaceReserveHorizontal;

      return {
        blockStart: Math.min(blockStart, currentBlockStart),
        blockEnd: Math.min(blockEnd, currentBlockEnd),
        inlineStart: Math.min(inlineStart, currentInlineStart),
        inlineEnd: Math.min(inlineEnd, currentInlineEnd),
      };
    },
    {
      blockStart: Number.MAX_VALUE,
      blockEnd: Number.MAX_VALUE,
      inlineStart: Number.MAX_VALUE,
      inlineEnd: Number.MAX_VALUE,
    }
  );
};

const getInteriorAvailableSpace = ({
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
    insetBlockEnd: triggerBlockEnd,
    insetBlockStart: triggerBlockStart,
    insetInlineStart: triggerInlineStart,
    insetInlineEnd: triggerInlineEnd,
  } = getLogicalBoundingClientRect(trigger);

  return overflowParents.reduce(
    ({ blockStart, blockEnd, inlineStart, inlineEnd }, overflowParent) => {
      const currentBlockStart = triggerBlockEnd - overflowParent.insetBlockStart - AVAILABLE_SPACE_RESERVE_VERTICAL;
      const currentBlockEnd =
        overflowParent.blockSize -
        triggerBlockStart +
        overflowParent.insetBlockStart -
        AVAILABLE_SPACE_RESERVE_VERTICAL;
      const currentInlineStart =
        triggerInlineStart - overflowParent.insetInlineStart - AVAILABLE_SPACE_RESERVE_HORIZONTAL;
      const currentInlineEnd =
        overflowParent.insetInlineStart +
        overflowParent.inlineSize -
        triggerInlineEnd -
        AVAILABLE_SPACE_RESERVE_HORIZONTAL;

      return {
        blockStart: Math.min(blockStart, currentBlockStart),
        blockEnd: Math.min(blockEnd, currentBlockEnd),
        inlineStart: Math.min(inlineStart, currentInlineStart),
        inlineEnd: Math.min(inlineEnd, currentInlineEnd),
      };
    },
    {
      blockStart: Number.MAX_VALUE,
      blockEnd: Number.MAX_VALUE,
      inlineStart: Number.MAX_VALUE,
      inlineEnd: Number.MAX_VALUE,
    }
  );
};

const resolveWidthConstraint = (
  constraint: DropdownWidthConstraint | undefined,
  triggerWidth: number,
  fallback: number
): number => {
  if (constraint === 'trigger') {
    return triggerWidth;
  }
  if (typeof constraint === 'number') {
    return constraint;
  }
  return fallback;
};

const getWidths = ({
  triggerElement,
  dropdownElement,
  minWidthConstraint,
  maxWidthConstraint,
}: {
  triggerElement: HTMLElement;
  dropdownElement: HTMLElement;
  minWidthConstraint?: DropdownWidthConstraint;
  maxWidthConstraint?: DropdownWidthConstraint;
}) => {
  const { inlineSize: triggerInlineSize } = getLogicalBoundingClientRect(triggerElement);
  const { inlineSize: requiredWidth } = getLogicalBoundingClientRect(dropdownElement);

  const minWidth = resolveWidthConstraint(minWidthConstraint, triggerInlineSize, 0);
  const maxWidth = resolveWidthConstraint(maxWidthConstraint, triggerInlineSize, Number.MAX_VALUE);

  const idealWidth = Math.min(Math.max(requiredWidth, minWidth), maxWidth);
  return { idealWidth, minWidth, triggerInlineSize };
};

export const hasEnoughSpaceForFlexibleWidth = ({
  triggerElement,
  dropdownElement,
  minWidthConstraint,
  maxWidthConstraint,
  expandToViewport,
  stretchHeight,
  isMobile,
}: {
  triggerElement: HTMLElement;
  dropdownElement: HTMLElement;
  minWidthConstraint?: DropdownWidthConstraint;
  maxWidthConstraint?: DropdownWidthConstraint;
  expandToViewport: boolean;
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
    minWidthConstraint,
    maxWidthConstraint,
  });
  const availableSpace = getAvailableSpace({
    trigger: triggerElement,
    overflowParents,
    stretchHeight,
    isMobile,
  });
  return idealWidth <= availableSpace.inlineStart || idealWidth <= availableSpace.inlineEnd;
};

export const getDropdownPosition = ({
  triggerElement,
  dropdownElement,
  overflowParents,
  minWidth: minWidthConstraint,
  maxWidth: maxWidthConstraint,
  preferCenter = false,
  matchTriggerWidth = false,
  stretchHeight = false,
  isMobile = false,
}: {
  triggerElement: HTMLElement;
  dropdownElement: HTMLElement;
  overflowParents: ReadonlyArray<BoundingBox>;
  minWidth?: DropdownWidthConstraint;
  maxWidth?: DropdownWidthConstraint;
  preferCenter?: boolean;
  matchTriggerWidth?: boolean;
  stretchHeight?: boolean;
  isMobile?: boolean;
}): DropdownPosition => {
  // Determine the space available around the dropdown that it can grow in
  const availableSpace = getAvailableSpace({
    trigger: triggerElement,
    overflowParents,
    stretchWidth: matchTriggerWidth,
    stretchHeight,
    isMobile,
  });
  const { idealWidth, minWidth, triggerInlineSize } = getWidths({
    triggerElement,
    dropdownElement,
    minWidthConstraint,
    maxWidthConstraint,
  });

  let dropInlineStart: boolean;
  let insetInlineStart: number | null = null;
  let inlineSize = idealWidth;

  //1. Can it be positioned with ideal width to the right?
  if (idealWidth <= availableSpace.inlineEnd) {
    dropInlineStart = false;
    //2. Can it be positioned with ideal width to the left?
  } else if (idealWidth <= availableSpace.inlineStart) {
    dropInlineStart = true;
    //3. Fit into biggest available space either on left or right
  } else {
    dropInlineStart = availableSpace.inlineStart > availableSpace.inlineEnd;
    inlineSize = Math.max(availableSpace.inlineStart, availableSpace.inlineEnd, minWidth);
  }

  if (preferCenter) {
    const spillOver = (idealWidth - triggerInlineSize) / 2;

    // availableSpace always includes the trigger width, but we want to exclude that
    const availableOutsideLeft = availableSpace.inlineStart - triggerInlineSize;
    const availableOutsideRight = availableSpace.inlineEnd - triggerInlineSize;

    const fitsInCenter = availableOutsideLeft >= spillOver && availableOutsideRight >= spillOver;
    if (fitsInCenter) {
      insetInlineStart = -spillOver;
    }
  }

  const dropBlockStart =
    availableSpace.blockEnd < dropdownElement.offsetHeight && availableSpace.blockStart > availableSpace.blockEnd;
  const availableHeight = dropBlockStart ? availableSpace.blockStart : availableSpace.blockEnd;
  // Try and crop the bottom item when all options can't be displayed, affordance for "there's more"
  const croppedHeight = Math.max(stretchHeight ? availableHeight : Math.floor(availableHeight / 31) * 31 + 16, 15);

  return {
    dropBlockStart,
    dropInlineStart,
    insetInlineStart: insetInlineStart === null ? 'auto' : `${insetInlineStart}px`,
    blockSize: `${croppedHeight}px`,
    inlineSize: `${inlineSize}px`,
  };
};

const getInteriorDropdownPosition = (
  trigger: HTMLElement,
  dropdown: HTMLElement,
  overflowParents: ReadonlyArray<BoundingBox>,
  isMobile?: boolean
): InteriorDropdownPosition => {
  const availableSpace = getInteriorAvailableSpace({ trigger, overflowParents, isMobile });
  const {
    insetBlockEnd: triggerBlockEnd,
    insetBlockStart: triggerBlockStart,
    inlineSize: triggerInlineSize,
  } = getLogicalBoundingClientRect(trigger);
  const { insetBlockStart: parentDropdownBlockStart, blockSize: parentDropdownHeight } =
    getClosestParentDimensions(trigger);

  let dropInlineStart;

  let { inlineSize } = getLogicalBoundingClientRect(dropdown);
  const insetBlockStart = triggerBlockStart - parentDropdownBlockStart;
  if (inlineSize <= availableSpace.inlineEnd) {
    dropInlineStart = false;
  } else if (inlineSize <= availableSpace.inlineStart) {
    dropInlineStart = true;
  } else {
    dropInlineStart = availableSpace.inlineStart > availableSpace.inlineEnd;
    inlineSize = Math.max(availableSpace.inlineStart, availableSpace.inlineEnd);
  }

  const insetInlineStart = dropInlineStart ? 0 - inlineSize : triggerInlineSize;

  const dropBlockStart =
    availableSpace.blockEnd < dropdown.offsetHeight && availableSpace.blockStart > availableSpace.blockEnd;
  const insetBlockEnd = dropBlockStart ? parentDropdownBlockStart + parentDropdownHeight - triggerBlockEnd : 0;
  const availableHeight = dropBlockStart ? availableSpace.blockStart : availableSpace.blockEnd;
  // Try and crop the bottom item when all options can't be displayed, affordance for "there's more"
  const croppedHeight = Math.floor(availableHeight / 31) * 31 + 16;

  return {
    dropBlockStart,
    dropInlineStart,
    blockSize: `${croppedHeight}px`,
    inlineSize: `${inlineSize}px`,
    insetBlockStart: `${insetBlockStart}px`,
    insetBlockEnd: `${insetBlockEnd}px`,
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
  matchTriggerWidth: boolean,
  stretchHeight: boolean,
  isMobile: boolean,
  minWidth?: DropdownWidthConstraint,
  maxWidth?: DropdownWidthConstraint
): [DropdownPosition, LogicalDOMRect] => {
  // cleaning previously assigned values,
  // so that they are not reused in case of screen resize and similar events
  verticalContainerElement.style.maxBlockSize = '';
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
        maxWidth,
        preferCenter,
        matchTriggerWidth,
        stretchHeight,
        isMobile,
      });
  const triggerBox = getLogicalBoundingClientRect(triggerElement);
  return [position, triggerBox];
};
