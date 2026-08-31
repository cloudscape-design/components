// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { toStableKeyframeName } from '@cloudscape-design/theming-build';

// Single source of truth for design-token and motion-keyframe versions.
const TOKEN_VERSIONS = [{ pattern: /^.*$/, version: 'v3-1' }];
const MOTION_KEYFRAME_VERSION = 'v3-1';

export function getTokenVersions(variablesMap: Record<string, string>, groups = TOKEN_VERSIONS) {
  const counters: Record<string, number> = {};
  const tokenVersions: Record<string, string> = {};
  for (const [token, cssName] of Object.entries(variablesMap)) {
    const group = groups.find(({ pattern }) => pattern.test(cssName));
    if (group) {
      tokenVersions[token] = group.version;
      counters[group.version] = (counters[group.version] ?? 0) + 1;
    } else {
      counters.unset = (counters.unset ?? 0) + 1;
    }
  }
  console.log(`Design token versions: ${JSON.stringify(counters)}`);
  return tokenVersions;
}

export function getStableKeyframe(name: string): string {
  /* istanbul ignore next -- covered by integration tests snapshots */
  return toStableKeyframeName(name, MOTION_KEYFRAME_VERSION);
}
