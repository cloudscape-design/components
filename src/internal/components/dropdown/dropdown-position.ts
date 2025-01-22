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

export function applyFixedDropdownPosition({
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
  const useAbsolutePositioning = isMobile;

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
