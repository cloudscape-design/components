// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';

import { GroupedControlContextProps } from '../../context/control-group-context';

// STAYS INTERNAL: shared grouped-control styling helper used by the public ControlGroup
// implementation and other grouped controls (input, segmented-control, button-trigger,
// autosuggest-input). It is not part of the ControlGroup public surface.

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
  return clsx(
    styles.grouped,
    styles[`grouped-${direction}`],
    styles[`grouped-${direction}-${position}`],
    hasAction && styles['grouped-with-action'],
    validation && (validation === 'error' ? styles['grouped-with-error'] : styles['grouped-with-warning'])
  );
}
