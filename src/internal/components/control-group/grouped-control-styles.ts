// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import { GroupedControlContextProps } from '../../context/control-group-context';

/**
 * Builds the shared grouped-control CSS classes for a consumer.
 *
 * Returns an empty string when the control is not in a group (falsy `position`),
 * otherwise the `grouped` base class plus the position/direction modifier.
 * Pass the result into `clsx(...)` at the call site.
 */
export function getGroupedControlClassNames(
  styles: Record<string, string>,
  { position, direction, hasAction, validation }: GroupedControlContextProps
): string {
  if (!position) {
    return '';
  }
  // Only the leading (inline-start) controls draw the thick validation border
  const isLeading = direction === 'vertical' || position === 'first' || position === 'only';
  return clsx(
    styles.grouped,
    styles[`grouped-${direction}-${position}`],
    hasAction && styles['grouped-with-action'],
    validation && (validation === 'error' ? styles['with-error'] : styles['with-warning']),
    validation && isLeading && styles['grouped-validation-first']
  );
}
