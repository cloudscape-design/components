// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { readdirSync, readFileSync } from 'fs';
import path from 'path';

const libPath = path.join(__dirname, '../../../lib/components');
// There are no typings for package.json
const packageJson = JSON.parse(readFileSync(path.join(libPath, 'package.json'), 'utf-8'));

test('all exports declarations resolve to a file', () => {
  for (const exportPath of Object.values<string>(packageJson.exports)) {
    // context export is a folder, cannot be resolved
    if (exportPath === './internal/context/') {
      continue;
    }
    // subpath pattern (e.g. ./styling/*.scss): at least one file must match it
    if (exportPath.includes('*')) {
      const files = readdirSync(path.join(libPath, path.dirname(exportPath)));
      expect(files.some(file => file.endsWith(path.extname(exportPath)))).toBe(true);
      continue;
    }
    expect(() => require.resolve(exportPath, { paths: [libPath] })).not.toThrow();
  }
});
