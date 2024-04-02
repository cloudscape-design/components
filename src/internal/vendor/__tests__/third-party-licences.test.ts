// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import path from 'path';
import fs from 'fs';

const licensesDir = path.resolve(__dirname, '../../../../vendor/');

describe('Vendor licenses attribution', () => {
  test('for d3-scale', () => {
    const content = fs.readFileSync(path.join(licensesDir, 'generated-third-party-licenses-d3-scale.txt'), 'utf8');
    expect(content).toMatchSnapshot();
  });
  test('for react-virtual', () => {
    const content = fs.readFileSync(path.join(licensesDir, 'generated-third-party-licenses-react-virtual.txt'), 'utf8');
    expect(content).toMatchSnapshot();
  });
});
