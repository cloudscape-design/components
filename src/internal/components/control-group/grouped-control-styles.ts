// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { GroupedControlContextProps } from '../../context/control-group-context';

/** Builds the shared grouped-control CSS classes for a consumer; empty when not grouped. */
export function getGroupedControlClassNames(
  styles: Record<string, string>,
  { position, direction, hasAction }: GroupedControlContextProps
): string[] {
  if (!position) {
    return [];
  }
  const classNames = [styles.grouped, styles[`grouped-${direction}-${position}`]];
  if (hasAction) {
    classNames.push(styles['grouped-with-action']);
  }
  return classNames;
}
