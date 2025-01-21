// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';

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
}: {
  position: DropdownPosition;
  dropdownElement: HTMLElement;
  triggerRect: LogicalDOMRect;
}) {
  const useAbsolutePositioning = window.visualViewport?.height && window.visualViewport.height < window.innerHeight;

  const verticalScrollOffset = useAbsolutePositioning ? document.documentElement.scrollTop : 0;
  const horizontalScrollOffset = useAbsolutePositioning
    ? getIsRtl(document.body)
      ? window.innerWidth - document.documentElement.scrollLeft
      : document.documentElement.scrollLeft
    : 0;

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
