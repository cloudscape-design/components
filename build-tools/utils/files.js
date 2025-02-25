// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';

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
        elem !== 'index.tsx' &&
        elem !== 'index.ts' &&
        elem !== 'interfaces.ts' &&
        elem !== 'test-utils' &&
        elem !== 'i18n' &&
        elem !== 'theming' &&
        elem !== 'contexts'
    );
}

module.exports = { writeFile, listPublicItems };
