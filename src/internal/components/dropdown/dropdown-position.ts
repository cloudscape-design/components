// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DropdownPosition } from './dropdown-fit-handler';

export interface LogicalDOMRect {
  blockSize: number;
  inlineSize: number;
  insetBlockStart: number;
  insetBlockEnd: number;
  insetInlineStart: number;
  insetInlineEnd: number;
}

// Applies its position to the dropdown element when expandToViewport is set to true.
export function applyDropdownPositionRelativeToViewport({
  position,
  dropdownElement,
  triggerRect,
  isMobile,
}: {
  position: DropdownPosition;
  dropdownElement: HTMLElement;
  triggerRect: LogicalDOMRect;
  isMobile: boolean;
}) {
  // Fixed positions is not respected in iOS when the virtual keyboard is being displayed.
  // For this reason we use absolute positioning in mobile.
  const useAbsolutePositioning = isMobile;

  // Since when using expandToViewport=true the dropdown is attached to the root of the body,
  // the same coordinates can be used for fixed or absolute position,
  // except when using absolute position we need to take into account the scroll position of the body itself.
  const verticalScrollOffset = useAbsolutePositioning ? document.documentElement.scrollTop : 0;
  const horizontalScrollOffset = useAbsolutePositioning ? document.documentElement.scrollLeft : 0;

  dropdownElement.style.position = useAbsolutePositioning ? 'absolute' : 'fixed';

  if (position.dropBlockStart) {
    dropdownElement.style.insetBlockEnd = `calc(100% - ${verticalScrollOffset + triggerRect.insetBlockStart}px)`;
  } else {
    dropdownElement.style.insetBlockStart = `${verticalScrollOffset + triggerRect.insetBlockEnd}px`;
  }
  if (position.dropInlineStart) {
    dropdownElement.style.insetInlineStart = `calc(${horizontalScrollOffset + triggerRect.insetInlineEnd}px - ${position.inlineSize})`;
  } else {
    dropdownElement.style.insetInlineStart = `${horizontalScrollOffset + triggerRect.insetInlineStart}px`;
  }
}
