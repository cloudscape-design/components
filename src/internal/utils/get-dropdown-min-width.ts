// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getBreakpointValue } from '../breakpoints';
import { DropdownWidthConstraint } from '../components/dropdown/interfaces';

/**
 * AWSUI-19898
 * If `expandToViewport` is true, we want to constrain the dropdown width to the smallest of:
 * 1. The trigger width
 * 2. The xxs breakpoint width
 *
 * If `expandToViewport` is false, we want to constrain the dropdown width to the trigger width.
 */
export function getDropdownMinWidth({
  expandToViewport,
  triggerWidth,
  dropdownWidth,
}: {
  expandToViewport?: boolean;
  triggerWidth: number | null;
  dropdownWidth?: DropdownWidthConstraint;
}): DropdownWidthConstraint | undefined {
  if (dropdownWidth) {
    return dropdownWidth;
  }
  if (!expandToViewport) {
    return 'trigger';
  }
  return triggerWidth !== null ? Math.min(triggerWidth, getBreakpointValue('xxs')) : undefined;
}
