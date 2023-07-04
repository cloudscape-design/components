// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import path from 'path';

// There are no typings for package.json
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../lib/components/package.json');

test('all exports declarations resolve to a file', () => {
  for (const exportPath of Object.values<string>(packageJson.exports)) {
    // this path is a hack, does not resolve to a
    // file
    if (exportPath === './i18n/messages') {
      continue;
    }
    expect(() => require.resolve(exportPath, { paths: [path.join(__dirname, '../../lib/components')] })).not.toThrow();
  }
});
