// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GroupedControlDirection, GroupedControlPosition } from '../../context/control-group-context';

/**
 * Builds the shared grouped-control CSS classes for a consumer.
 *
 * Returns an empty list when the control is not in a group (falsy `position`),
 * otherwise the `grouped` base class plus the position/direction modifier.
 * Spread the result into `clsx(...)` at the call site.
 */
export function getGroupedControlClassNames(
  styles: Record<string, string>,
  position: GroupedControlPosition | null,
  direction: GroupedControlDirection
): string[] {
  if (!position) {
    return [];
  }
  return [styles.grouped, styles[`grouped-${direction}-${position}`]];
}
