// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';

describe('d3-scale-third-party-licenses.txt content', () => {
  test('stays unchanged without any d3-scale version changes', () => {
    // The file we assert against gets generated during building the project.
    const content = fs.readFileSync(path.resolve(__dirname, '../generated-third-party-licenses.txt'), 'utf8');
    expect(content).toMatchSnapshot();
  });
});
