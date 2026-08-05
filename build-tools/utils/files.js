// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const path = require('path');

function writeFile(filepath, content) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
}

function listPublicItems(baseDir) {
  return fs
    .readdirSync(baseDir)
    .filter(
      elem =>
        !elem.startsWith('__') &&
        !elem.startsWith('.') &&
        elem !== 'internal' &&
        elem !== 'types' &&
        elem !== 'index.tsx' &&
        elem !== 'index.ts' &&
        elem !== 'interfaces.ts' &&
        elem !== 'test-utils' &&
        elem !== 'i18n' &&
        elem !== 'theming' &&
        elem !== 'plugins' &&
        elem !== 'contexts' &&
        // `beta` is not a component: it is a container for versioned, opt-in beta components
        // (e.g. `beta/basic-table-0.1`) enumerated separately via `listBetaItems`.
        elem !== 'beta'
    );
}

// Lists the versioned beta components as `beta/<name>` (e.g. `beta/basic-table-0.1`). Beta components
// are opt-in and published only at their versioned export subpath — they are intentionally excluded
// from the top-level barrel and treated as their own kind of public item elsewhere in the build.
function listBetaItems(srcDir = 'src') {
  const betaDir = path.join(srcDir, 'beta');
  if (!fs.existsSync(betaDir)) {
    return [];
  }
  return fs
    .readdirSync(betaDir)
    .filter(elem => !elem.startsWith('__') && !elem.startsWith('.') && fs.statSync(path.join(betaDir, elem)).isDirectory())
    .map(elem => `beta/${elem}`);
}

module.exports = { writeFile, listPublicItems, listBetaItems };
