// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'fs';
import path from 'path';

describe('Generate test utils ElementWrapper', () => {
  const importPaths = [
    {
      type: 'dom',
      relativePath: '../../test-utils/dom/index.ts',
    },
    {
      type: 'selectors',
      relativePath: '../../test-utils/selectors/index.ts',
    },
  ] as const;

  test.each(importPaths)('$type ElementWrapper matches the snapshot', ({ relativePath }) => {
    const testUtilsPath = path.join(__dirname, relativePath);
    const domWrapper = fs.readFileSync(testUtilsPath, 'utf8');
    expect(domWrapper).toMatchSnapshot();
  });
});
