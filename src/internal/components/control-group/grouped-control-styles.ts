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
  // Mark the controls on the group's leading (inline-start) edge so they draw
  // the thick validation seam: the first/only control horizontally, every
  // control vertically (the leading edge spans the whole column).
  const isLeading = direction === 'vertical' || position === 'first' || position === 'only';
  if ((invalid || warning) && isLeading) {
    classNames.push(styles['grouped-validation']);
  }
  return classNames;
}
