// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'File input',
  componentName: 'file-input',
  tests: [
    {
      description: 'Simple',
      path: 'file-input/simple',
      screenshotType: 'screenshotArea',
    },
  ],
};

export default suite;
