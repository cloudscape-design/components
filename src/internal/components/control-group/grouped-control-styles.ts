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
  { position, direction, hasAction, validation }: GroupedControlContextProps
): string[] {
  if (!position) {
    return [];
  }
  const classNames = [styles.grouped, styles[`grouped-${direction}-${position}`]];
  if (hasAction) {
    classNames.push(styles['grouped-with-action']);
  }
  if (validation) {
    classNames.push(validation === 'error' ? styles['grouped-in-error'] : styles['grouped-in-warning']);
    // Only the leading (inline-start) controls draw the thick validation border:
    // the first/only control horizontally, every control vertically.
    const isLeading = direction === 'vertical' || position === 'first' || position === 'only';
    if (isLeading) {
      classNames.push(styles['grouped-validation-first']);
    }
  }
  return classNames;
}
