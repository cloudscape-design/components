// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { TestSuite } from '../types';

const suite: TestSuite = {
  description: 'FileUpload',
  componentName: 'file-upload',
  tests: [
    {
      description: 'Permutations',
      path: 'file-upload/permutations',
      screenshotType: 'permutations',
    },
  ],
};

export default suite;
