// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GroupedControlContextProps } from '../../context/control-group-context';

/**
 * Builds the shared grouped-control CSS classes for a consumer.
 *
 * Returns an empty list when the control is not in a group (falsy `position`),
 * otherwise the `grouped` base class plus the position/direction modifier.
 * Spread the result into `clsx(...)` at the call site.
 */
export function getGroupedControlClassNames(
  styles: Record<string, string>,
  { position, direction, hasAction, invalid, warning }: GroupedControlContextProps
): string[] {
  if (!position) {
    return [];
  }
  const classNames = [styles.grouped, styles[`grouped-${direction}-${position}`]];
  if (hasAction) {
    classNames.push(styles['grouped-with-action']);
  }
  if (invalid || warning) {
    // Every control in the group gets the focus marker so each re-asserts its
    // own outward validation color (and the invalid ring) on focus.
    classNames.push(styles['grouped-in-validation']);
    // Only the leading (inline-start) controls draw the thick validation seam:
    // the first/only control horizontally, every control vertically.
    const isLeading = direction === 'vertical' || position === 'first' || position === 'only';
    if (isLeading) {
      classNames.push(styles['grouped-validation']);
    }
  }
  return classNames;
}
