// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const DEFAULT_TOKEN_VERSION = 'v3-1';

// Groups map a token-name pattern (matched against the token's CSS variable name) to a version.
// Tokens matching no group stay version-less and keep the legacy value-based hashes.
const versionGroups = [{ pattern: /^border-/, version: DEFAULT_TOKEN_VERSION }];

// Builds the token -> version allowlist from the full token -> cssName map.
function getTokenVersions(variablesMap, groups = versionGroups) {
  const counters = {};
  const tokenVersions = {};
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

module.exports = { versionGroups, getTokenVersions };
