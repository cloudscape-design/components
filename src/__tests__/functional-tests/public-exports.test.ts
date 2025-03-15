// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from 'fs';
import path from 'path';

// There are no typings for package.json
const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../../../lib/components/package.json'), 'utf-8'));

test('all exports declarations resolve to a file', () => {
  for (const exportPath of Object.values<string>(packageJson.exports)) {
    // context export is a folder, cannot be resolved
    if (exportPath === './internal/context/') {
      continue;
    }
    expect(() =>
      require.resolve(exportPath, { paths: [path.join(__dirname, '../../../lib/components')] })
    ).not.toThrow();
  }
});
