// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export function getDataAttributes(
  dataAttributes: Record<string, string> | undefined,
  excludeKeys: string[] = []
): Record<string, string> {
  if (!dataAttributes) {
    return {};
  }

  return Object.entries(dataAttributes).reduce(
    (acc, [key, value]) => {
      if (excludeKeys.includes(key) || excludeKeys.includes(`data-${key}`)) {
        warnOnce('getDataAttributes', `"${key}" key is reserved and cannot be overridden via dataAttributes`);
        return acc;
      }

      if (value === undefined) {
        return acc;
      }

      const attrKey = key.startsWith('data-') ? key : `data-${key}`;
      acc[attrKey] = value;
      return acc;
    },
    {} as Record<string, string>
  );
}
